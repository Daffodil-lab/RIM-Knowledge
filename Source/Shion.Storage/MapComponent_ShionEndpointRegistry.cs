using System;
using System.Collections.Generic;
using System.Linq;
using RimWorld;
using Verse;

namespace Shion.Storage
{
    public sealed class TransferOperationRecord : IExposable
    {
        public string OperationId;
        public bool Succeeded;
        public int MovedCount;
        public int RemainingCount;
        public TransferFailureReason FailureReason;

        public void ExposeData()
        {
            Scribe_Values.Look(ref OperationId, "operationId");
            Scribe_Values.Look(ref Succeeded, "succeeded");
            Scribe_Values.Look(ref MovedCount, "movedCount");
            Scribe_Values.Look(ref RemainingCount, "remainingCount");
            Scribe_Values.Look(ref FailureReason, "failureReason", TransferFailureReason.None);
        }

        public TransferResult ToResult()
        {
            return new TransferResult
            {
                Succeeded = Succeeded,
                MovedCount = MovedCount,
                RemainingCount = RemainingCount,
                FailureReason = FailureReason
            };
        }
    }

    public sealed class StorageInputReservationSlice : IExposable
    {
        public string EndpointId;
        public string ThingId;
        public string ThingDefName;
        public int Count;

        public void ExposeData()
        {
            Scribe_Values.Look(ref EndpointId, "endpointId");
            Scribe_Values.Look(ref ThingId, "thingId");
            Scribe_Values.Look(ref ThingDefName, "thingDefName");
            Scribe_Values.Look(ref Count, "count");
        }
    }

    public sealed class StorageOutputReservationSlice : IExposable
    {
        public string EndpointId;
        public string ThingDefName;
        public string StuffDefName;
        public int Count;
        public QualityCategory Quality = QualityCategory.Normal;

        public void ExposeData()
        {
            Scribe_Values.Look(ref EndpointId, "endpointId");
            Scribe_Values.Look(ref ThingDefName, "thingDefName");
            Scribe_Values.Look(ref StuffDefName, "stuffDefName");
            Scribe_Values.Look(ref Count, "count");
            Scribe_Values.Look(ref Quality, "quality", QualityCategory.Normal);
        }
    }

    public sealed class ProductionReservationRecord : IExposable
    {
        public string OperationId;
        public ProductionReservationState State;
        public ProductionFailureReason FailureReason;
        public List<StorageInputReservationSlice> Inputs = new List<StorageInputReservationSlice>();
        public List<StorageOutputReservationSlice> Outputs = new List<StorageOutputReservationSlice>();

        public int ReservedInputCount => Inputs?.Sum(slice => Math.Max(0, slice?.Count ?? 0)) ?? 0;
        public int ReservedOutputCount => Outputs?.Sum(slice => Math.Max(0, slice?.Count ?? 0)) ?? 0;

        public void ExposeData()
        {
            Scribe_Values.Look(ref OperationId, "operationId");
            Scribe_Values.Look(ref State, "state", ProductionReservationState.Reserved);
            Scribe_Values.Look(ref FailureReason, "failureReason", ProductionFailureReason.None);
            Scribe_Collections.Look(ref Inputs, "inputs", LookMode.Deep);
            Scribe_Collections.Look(ref Outputs, "outputs", LookMode.Deep);

            if (Scribe.mode == LoadSaveMode.PostLoadInit)
            {
                Inputs = Inputs ?? new List<StorageInputReservationSlice>();
                Outputs = Outputs ?? new List<StorageOutputReservationSlice>();
            }
        }

        public ProductionReservationResult ToResult(bool succeeded = true)
        {
            return new ProductionReservationResult
            {
                Succeeded = succeeded,
                State = State,
                FailureReason = FailureReason,
                ReservedInputCount = ReservedInputCount,
                ReservedOutputCount = ReservedOutputCount
            };
        }
    }

    public sealed class MapComponent_ShionEndpointRegistry : MapComponent,
        IEndpointRegistry,
        IStorageQueryService,
        IStorageTransactionService,
        IStorageProductionService
    {
        private const int CurrentDataVersion = 3;
        private const int MaxRememberedOperations = 2048;

        private readonly Dictionary<string, IStorageEndpoint> endpoints = new Dictionary<string, IStorageEndpoint>();
        private readonly Dictionary<string, TransferOperationRecord> operations = new Dictionary<string, TransferOperationRecord>();
        private readonly Dictionary<string, ProductionReservationRecord> productionReservations =
            new Dictionary<string, ProductionReservationRecord>();
        private readonly Dictionary<string, int> reservedInputIndex = new Dictionary<string, int>();
        private readonly Dictionary<string, int> reservedOutputIndex = new Dictionary<string, int>();
        private List<TransferOperationRecord> savedOperations = new List<TransferOperationRecord>();
        private List<ProductionReservationRecord> savedProductionReservations = new List<ProductionReservationRecord>();
        private int dataVersion = CurrentDataVersion;

        public MapComponent_ShionEndpointRegistry(Map map) : base(map)
        {
        }

        public event Action Changed;

        public IEnumerable<IStorageEndpoint> Endpoints => endpoints.Values;

        public void Register(IStorageEndpoint endpoint)
        {
            if (endpoint == null || endpoint.EndpointId.NullOrEmpty())
            {
                return;
            }

            endpoints[endpoint.EndpointId] = endpoint;
            endpoint.ContentsChanged -= HandleEndpointContentsChanged;
            endpoint.ContentsChanged += HandleEndpointContentsChanged;
            Changed?.Invoke();
        }

        public void Unregister(IStorageEndpoint endpoint)
        {
            if (endpoint == null)
            {
                return;
            }

            endpoint.ContentsChanged -= HandleEndpointContentsChanged;
            if (!endpoint.EndpointId.NullOrEmpty())
            {
                ReleaseReservationsForEndpoint(endpoint.EndpointId);
                endpoints.Remove(endpoint.EndpointId);
            }

            Changed?.Invoke();
        }

        public void NotifyEndpointChanged(IStorageEndpoint endpoint)
        {
            Changed?.Invoke();
        }

        public bool TryGet(string endpointId, out IStorageEndpoint endpoint)
        {
            return endpoints.TryGetValue(endpointId ?? string.Empty, out endpoint);
        }

        public IReadOnlyList<StorageEndpointView> GetEndpoints()
        {
            return endpoints.Values
                .OrderBy(endpoint => endpoint.Label)
                .Select(ToView)
                .ToList();
        }

        public StorageEndpointView GetEndpoint(string endpointId)
        {
            return TryGet(endpointId, out IStorageEndpoint endpoint) ? ToView(endpoint) : null;
        }

        public int GetReservedInputCount(string endpointId, string thingId)
        {
            if (endpointId.NullOrEmpty() || thingId.NullOrEmpty())
            {
                return 0;
            }

            return reservedInputIndex.TryGetValue(InputReservationKey(endpointId, thingId), out int count)
                ? count
                : 0;
        }

        public int GetReservedOutputCount(string endpointId)
        {
            if (endpointId.NullOrEmpty())
            {
                return 0;
            }

            return reservedOutputIndex.TryGetValue(endpointId, out int count) ? count : 0;
        }

        public ProductionReservationResult ReserveProduction(ProductionReservationRequest request)
        {
            if (request == null || request.OperationId.NullOrEmpty())
            {
                return ProductionReservationResult.Failure(ProductionFailureReason.InvalidOperationId);
            }

            if (productionReservations.TryGetValue(request.OperationId, out ProductionReservationRecord previous))
            {
                if (previous.State == ProductionReservationState.Released)
                {
                    previous.FailureReason = previous.FailureReason == ProductionFailureReason.None
                        ? ProductionFailureReason.AlreadyFinalized
                        : previous.FailureReason;
                    return previous.ToResult(false);
                }

                return previous.ToResult();
            }

            List<StorageDefCount> inputs = Normalize(request.Inputs);
            List<StorageProductSpec> outputs = NormalizeProducts(request);
            if (outputs.Count == 0
                || inputs.Any(item => item.Def == null || item.Count <= 0)
                || outputs.Any(item => !IsValidProduct(item)))
            {
                return ProductionReservationResult.Failure(ProductionFailureReason.InvalidRequest);
            }

            List<IStorageEndpoint> availableEndpoints = endpoints.Values
                .Where(IsAvailable)
                .OrderBy(endpoint => endpoint.EndpointId)
                .ToList();
            if (availableEndpoints.Count == 0)
            {
                return ProductionReservationResult.Failure(ProductionFailureReason.EndpointUnavailable);
            }

            List<StorageInputReservationSlice> inputSlices = new List<StorageInputReservationSlice>();
            foreach (StorageDefCount input in inputs)
            {
                int remaining = input.Count;
                foreach (IStorageEndpoint endpoint in availableEndpoints)
                {
                    foreach (Thing thing in endpoint.InnerContainer
                        .Where(item => item.def == input.Def)
                        .OrderBy(item => item.ThingID))
                    {
                        int alreadyReserved = GetReservedInputCount(endpoint.EndpointId, thing.ThingID);
                        int count = Math.Min(remaining, Math.Max(0, thing.stackCount - alreadyReserved));
                        if (count <= 0)
                        {
                            continue;
                        }

                        inputSlices.Add(new StorageInputReservationSlice
                        {
                            EndpointId = endpoint.EndpointId,
                            ThingId = thing.ThingID,
                            ThingDefName = input.Def.defName,
                            Count = count
                        });
                        remaining -= count;
                        if (remaining <= 0)
                        {
                            break;
                        }
                    }

                    if (remaining <= 0)
                    {
                        break;
                    }
                }

                if (remaining > 0)
                {
                    return ProductionReservationResult.Failure(ProductionFailureReason.MaterialsUnavailable);
                }
            }

            Dictionary<string, int> reservedInputByEndpoint = inputSlices
                .GroupBy(slice => slice.EndpointId)
                .ToDictionary(group => group.Key, group => group.Sum(slice => slice.Count));
            Dictionary<string, int> pendingOutputByEndpoint = new Dictionary<string, int>();
            List<StorageOutputReservationSlice> outputSlices = new List<StorageOutputReservationSlice>();
            foreach (StorageProductSpec output in outputs)
            {
                int remaining = output.Count;
                foreach (IStorageEndpoint endpoint in availableEndpoints.Where(item => item.Accepts(output.Def)))
                {
                    int locallyAssigned = pendingOutputByEndpoint.TryGetValue(endpoint.EndpointId, out int assigned)
                        ? assigned
                        : 0;
                    int capacityReleasedAtCommit = reservedInputByEndpoint.TryGetValue(
                        endpoint.EndpointId,
                        out int consumedAtCommit)
                        ? consumedAtCommit
                        : 0;
                    int free = Math.Max(
                        0,
                        endpoint.Capacity
                            - endpoint.StoredCount
                            - GetReservedOutputCount(endpoint.EndpointId)
                            - locallyAssigned
                            + capacityReleasedAtCommit);
                    int count = Math.Min(remaining, free);
                    if (count <= 0)
                    {
                        continue;
                    }

                    outputSlices.Add(new StorageOutputReservationSlice
                    {
                        EndpointId = endpoint.EndpointId,
                        ThingDefName = output.Def.defName,
                        StuffDefName = output.StuffDef?.defName,
                        Quality = output.Quality,
                        Count = count
                    });
                    pendingOutputByEndpoint[endpoint.EndpointId] = locallyAssigned + count;
                    remaining -= count;
                    if (remaining <= 0)
                    {
                        break;
                    }
                }

                if (remaining > 0)
                {
                    return ProductionReservationResult.Failure(ProductionFailureReason.OutputCapacityUnavailable);
                }
            }

            ProductionReservationRecord record = new ProductionReservationRecord
            {
                OperationId = request.OperationId,
                State = ProductionReservationState.Reserved,
                FailureReason = ProductionFailureReason.None,
                Inputs = inputSlices,
                Outputs = outputSlices
            };
            productionReservations[record.OperationId] = record;
            IndexReservation(record, 1);
            Changed?.Invoke();
            return record.ToResult();
        }

        public ProductionReservationResult CommitProduction(string operationId)
        {
            if (operationId.NullOrEmpty())
            {
                return ProductionReservationResult.Failure(ProductionFailureReason.InvalidOperationId);
            }

            if (!productionReservations.TryGetValue(operationId, out ProductionReservationRecord record))
            {
                return ProductionReservationResult.Failure(ProductionFailureReason.ReservationMissing);
            }

            if (record.State == ProductionReservationState.Committed)
            {
                return record.ToResult();
            }

            if (record.State != ProductionReservationState.Reserved)
            {
                record.FailureReason = record.FailureReason == ProductionFailureReason.None
                    ? ProductionFailureReason.AlreadyFinalized
                    : record.FailureReason;
                return record.ToResult(false);
            }

            if (!CanCommit(record, out ProductionFailureReason failure))
            {
                bool endpointMissing = record.Inputs.Any(slice => !endpoints.ContainsKey(slice.EndpointId))
                    || record.Outputs.Any(slice => !endpoints.ContainsKey(slice.EndpointId));
                if (endpointMissing)
                {
                    IndexReservation(record, -1);
                    record.State = ProductionReservationState.Released;
                    record.FailureReason = ProductionFailureReason.EndpointUnavailable;
                    Changed?.Invoke();
                    return record.ToResult(false);
                }

                return new ProductionReservationResult
                {
                    Succeeded = false,
                    State = ProductionReservationState.Reserved,
                    FailureReason = failure,
                    ReservedInputCount = record.ReservedInputCount,
                    ReservedOutputCount = record.ReservedOutputCount
                };
            }

            List<ConsumedThing> consumed = new List<ConsumedThing>();
            List<ProducedThing> produced = new List<ProducedThing>();
            try
            {
                foreach (StorageInputReservationSlice slice in record.Inputs)
                {
                    IStorageEndpoint endpoint = endpoints[slice.EndpointId];
                    Thing source = endpoint.InnerContainer.First(item => item.ThingID == slice.ThingId);
                    Thing taken = endpoint.InnerContainer.Take(source, slice.Count);
                    if (taken == null || taken.stackCount != slice.Count)
                    {
                        throw new InvalidOperationException("Reserved input could not be taken.");
                    }

                    consumed.Add(new ConsumedThing(endpoint, taken));
                }

                foreach (StorageOutputReservationSlice slice in record.Outputs)
                {
                    IStorageEndpoint endpoint = endpoints[slice.EndpointId];
                    ThingDef thingDef = DefDatabase<ThingDef>.GetNamedSilentFail(slice.ThingDefName);
                    ThingDef stuffDef = slice.StuffDefName.NullOrEmpty()
                        ? null
                        : DefDatabase<ThingDef>.GetNamedSilentFail(slice.StuffDefName);
                    int remaining = slice.Count;
                    while (remaining > 0)
                    {
                        int stackCount = Math.Min(remaining, Math.Max(1, thingDef.stackLimit));
                        Thing product = ThingMaker.MakeThing(thingDef, stuffDef);
                        product.TryGetComp<CompQuality>()?.SetQuality(slice.Quality, ArtGenerationContext.Colony);
                        product.stackCount = stackCount;
                        if (!endpoint.InnerContainer.TryAdd(product, false))
                        {
                            product.Destroy();
                            throw new InvalidOperationException("Reserved output could not be stored.");
                        }

                        produced.Add(new ProducedThing(endpoint, product));
                        remaining -= stackCount;
                    }
                }
            }
            catch (Exception exception)
            {
                RollBack(consumed, produced);
                Log.Error("[Shion.Storage] Production commit rolled back for " + operationId + ": " + exception);
                return ProductionReservationResult.Failure(ProductionFailureReason.CommitFailed);
            }

            foreach (ConsumedThing entry in consumed)
            {
                entry.Thing.Destroy();
            }

            IndexReservation(record, -1);
            record.State = ProductionReservationState.Committed;
            foreach (IStorageEndpoint endpoint in consumed.Select(entry => entry.Endpoint)
                .Concat(produced.Select(entry => entry.Endpoint))
                .Distinct())
            {
                NotifyEndpointChanged(endpoint);
            }

            Changed?.Invoke();
            return record.ToResult();
        }

        public ProductionReservationResult ReleaseProduction(string operationId)
        {
            if (operationId.NullOrEmpty())
            {
                return ProductionReservationResult.Failure(ProductionFailureReason.InvalidOperationId);
            }

            if (!productionReservations.TryGetValue(operationId, out ProductionReservationRecord record))
            {
                return ProductionReservationResult.Failure(ProductionFailureReason.ReservationMissing);
            }

            if (record.State == ProductionReservationState.Released)
            {
                return record.ToResult();
            }

            if (record.State == ProductionReservationState.Committed)
            {
                return ProductionReservationResult.Failure(ProductionFailureReason.AlreadyFinalized);
            }

            IndexReservation(record, -1);
            record.State = ProductionReservationState.Released;
            record.FailureReason = ProductionFailureReason.None;
            Changed?.Invoke();
            return record.ToResult();
        }

        public TransferResult TryTransfer(TransferRequest request)
        {
            if (request == null || request.OperationId.NullOrEmpty())
            {
                return TransferResult.Failure(TransferFailureReason.InvalidOperationId, request?.Count ?? 0);
            }

            if (operations.TryGetValue(request.OperationId, out TransferOperationRecord previous))
            {
                return previous.ToResult();
            }

            TransferResult result = ExecuteTransfer(request);
            Remember(request.OperationId, result);
            return result;
        }

        public TransferResult TryDeposit(DepositRequest request)
        {
            if (request == null || request.OperationId.NullOrEmpty())
            {
                return TransferResult.Failure(TransferFailureReason.InvalidOperationId, request?.Count ?? 0);
            }

            if (operations.TryGetValue(request.OperationId, out TransferOperationRecord previous))
            {
                return previous.ToResult();
            }

            TransferResult result = ExecuteDeposit(request);
            Remember(request.OperationId, result);
            return result;
        }

        public TransferResult TryWithdraw(string operationId, string endpointId, string thingId, int count)
        {
            if (operationId.NullOrEmpty())
            {
                return TransferResult.Failure(TransferFailureReason.InvalidOperationId, count);
            }

            if (operations.TryGetValue(operationId, out TransferOperationRecord previous))
            {
                return previous.ToResult();
            }

            if (!TryGet(endpointId, out IStorageEndpoint endpoint))
            {
                TransferResult missing = TransferResult.Failure(TransferFailureReason.EndpointMissing, count);
                Remember(operationId, missing);
                return missing;
            }

            Thing thing = endpoint.InnerContainer.FirstOrDefault(item => item.ThingID == thingId);
            int available = thing == null ? 0 : thing.stackCount - GetReservedInputCount(endpointId, thingId);
            if (thing == null || available <= 0)
            {
                TransferResult missingThing = TransferResult.Failure(TransferFailureReason.SourceDoesNotOwnThing, count);
                Remember(operationId, missingThing);
                return missingThing;
            }

            CompShionStorage storage = endpoint as CompShionStorage;
            if (storage == null || !storage.TryEject(thing, Math.Min(count, available), out Thing dropped))
            {
                TransferResult failed = TransferResult.Failure(TransferFailureReason.TransferFailed, count);
                Remember(operationId, failed);
                return failed;
            }

            TransferResult result = new TransferResult
            {
                Succeeded = true,
                MovedCount = dropped.stackCount,
                RemainingCount = Math.Max(0, count - dropped.stackCount),
                FailureReason = TransferFailureReason.None
            };
            Remember(operationId, result);
            return result;
        }

        public int RecoverLegacyContents(ThingOwner legacyContainer, IntVec3 fallbackPosition)
        {
            if (legacyContainer == null || !legacyContainer.Any)
            {
                return 0;
            }

            int recovered = 0;
            List<IStorageEndpoint> destinations = endpoints.Values
                .Where(IsAvailable)
                .OrderBy(endpoint => endpoint.EndpointId)
                .ToList();
            foreach (Thing thing in legacyContainer.ToList())
            {
                foreach (IStorageEndpoint destination in destinations.Where(endpoint => endpoint.Accepts(thing.def)))
                {
                    int free = Math.Max(
                        0,
                        destination.Capacity
                            - destination.StoredCount
                            - GetReservedOutputCount(destination.EndpointId));
                    int moved = Math.Min(thing.stackCount, free);
                    if (moved <= 0)
                    {
                        continue;
                    }

                    recovered += legacyContainer.TryTransferToContainer(
                        thing,
                        destination.InnerContainer,
                        moved,
                        out _,
                        false);
                    NotifyEndpointChanged(destination);
                    if (!legacyContainer.Contains(thing))
                    {
                        break;
                    }
                }
            }

            if (legacyContainer.Any)
            {
                int beforeDrop = legacyContainer.TotalStackCount;
                legacyContainer.TryDropAll(
                    fallbackPosition,
                    map,
                    ThingPlaceMode.Near,
                    null,
                    cell => cell.InBounds(map) && cell.Standable(map));
                recovered += beforeDrop - legacyContainer.TotalStackCount;
            }

            Changed?.Invoke();
            return recovered;
        }

        public override void ExposeData()
        {
            base.ExposeData();
            Scribe_Values.Look(ref dataVersion, "dataVersion", CurrentDataVersion);

            if (Scribe.mode == LoadSaveMode.Saving)
            {
                savedOperations = operations.Values.ToList();
                savedProductionReservations = productionReservations.Values.ToList();
            }

            Scribe_Collections.Look(ref savedOperations, "transferOperations", LookMode.Deep);
            Scribe_Collections.Look(ref savedProductionReservations, "productionReservations", LookMode.Deep);
            if (Scribe.mode == LoadSaveMode.PostLoadInit)
            {
                operations.Clear();
                productionReservations.Clear();
                reservedInputIndex.Clear();
                reservedOutputIndex.Clear();
                if (savedOperations != null)
                {
                    foreach (TransferOperationRecord operation in savedOperations.Where(record => record?.OperationId != null))
                    {
                        operations[operation.OperationId] = operation;
                    }
                }

                if (savedProductionReservations != null)
                {
                    foreach (ProductionReservationRecord reservation in savedProductionReservations
                        .Where(record => record?.OperationId != null))
                    {
                        productionReservations[reservation.OperationId] = reservation;
                    }
                }

                RebuildReservationIndexes();
            }
        }

        private TransferResult ExecuteTransfer(TransferRequest request)
        {
            if (request.Count <= 0)
            {
                return TransferResult.Failure(TransferFailureReason.InvalidCount, request.Count);
            }

            if (!TryGet(request.SourceEndpointId, out IStorageEndpoint source)
                || !TryGet(request.DestinationEndpointId, out IStorageEndpoint destination))
            {
                return TransferResult.Failure(TransferFailureReason.EndpointMissing, request.Count);
            }

            if (!IsAvailable(source) || !IsAvailable(destination))
            {
                return TransferResult.Failure(TransferFailureReason.EndpointUnavailable, request.Count);
            }

            Thing thing = source.InnerContainer.FirstOrDefault(item => item.ThingID == request.ThingId);
            if (thing == null)
            {
                return TransferResult.Failure(TransferFailureReason.SourceDoesNotOwnThing, request.Count);
            }

            int sourceAvailable = Math.Max(
                0,
                thing.stackCount - GetReservedInputCount(source.EndpointId, thing.ThingID));
            int requested = Math.Min(request.Count, sourceAvailable);
            int movable = Math.Min(
                requested,
                Math.Max(0, destination.Capacity - destination.StoredCount - GetReservedOutputCount(destination.EndpointId)));
            if (movable <= 0 || !destination.CanAccept(thing, movable))
            {
                return TransferResult.Failure(
                    destination.StoredCount + GetReservedOutputCount(destination.EndpointId) >= destination.Capacity
                        ? TransferFailureReason.DestinationFull
                        : TransferFailureReason.RejectedByFilter,
                    request.Count);
            }

            int moved = source.InnerContainer.TryTransferToContainer(
                thing,
                destination.InnerContainer,
                movable,
                out _,
                false);
            if (moved <= 0)
            {
                return TransferResult.Failure(TransferFailureReason.TransferFailed, request.Count);
            }

            NotifyEndpointChanged(source);
            NotifyEndpointChanged(destination);
            return new TransferResult
            {
                Succeeded = true,
                MovedCount = moved,
                RemainingCount = Math.Max(0, request.Count - moved),
                FailureReason = TransferFailureReason.None
            };
        }

        private TransferResult ExecuteDeposit(DepositRequest request)
        {
            if (request.Count <= 0)
            {
                return TransferResult.Failure(TransferFailureReason.InvalidCount, request.Count);
            }

            if (!TryGet(request.DestinationEndpointId, out IStorageEndpoint destination))
            {
                return TransferResult.Failure(TransferFailureReason.EndpointMissing, request.Count);
            }

            if (!IsAvailable(destination))
            {
                return TransferResult.Failure(TransferFailureReason.EndpointUnavailable, request.Count);
            }

            Thing thing = map.listerThings.AllThings.FirstOrDefault(item => item.ThingID == request.ThingId);
            if (thing == null || !thing.Spawned)
            {
                return TransferResult.Failure(TransferFailureReason.SourceDoesNotOwnThing, request.Count);
            }

            int requested = Math.Min(request.Count, thing.stackCount);
            int movable = Math.Min(
                requested,
                Math.Max(0, destination.Capacity - destination.StoredCount - GetReservedOutputCount(destination.EndpointId)));
            if (movable <= 0 || !destination.CanAccept(thing, movable))
            {
                return TransferResult.Failure(
                    destination.StoredCount + GetReservedOutputCount(destination.EndpointId) >= destination.Capacity
                        ? TransferFailureReason.DestinationFull
                        : TransferFailureReason.RejectedByFilter,
                    request.Count);
            }

            IntVec3 originalPosition = thing.Position;
            Thing moving = movable == thing.stackCount ? thing : thing.SplitOff(movable);
            if (moving.Spawned)
            {
                moving.DeSpawn();
            }

            if (!destination.InnerContainer.TryAdd(moving, false))
            {
                GenPlace.TryPlaceThing(moving, originalPosition, map, ThingPlaceMode.Near);
                return TransferResult.Failure(TransferFailureReason.TransferFailed, request.Count);
            }

            NotifyEndpointChanged(destination);
            return new TransferResult
            {
                Succeeded = true,
                MovedCount = movable,
                RemainingCount = Math.Max(0, request.Count - movable),
                FailureReason = TransferFailureReason.None
            };
        }

        private bool CanCommit(ProductionReservationRecord record, out ProductionFailureReason failure)
        {
            foreach (StorageInputReservationSlice slice in record.Inputs)
            {
                if (!TryGet(slice.EndpointId, out IStorageEndpoint endpoint) || !IsAvailable(endpoint))
                {
                    failure = ProductionFailureReason.EndpointUnavailable;
                    return false;
                }

                Thing thing = endpoint.InnerContainer.FirstOrDefault(item => item.ThingID == slice.ThingId);
                if (thing == null || thing.stackCount < slice.Count)
                {
                    failure = ProductionFailureReason.MaterialsUnavailable;
                    return false;
                }
            }

            foreach (IGrouping<string, StorageOutputReservationSlice> group in record.Outputs.GroupBy(slice => slice.EndpointId))
            {
                if (!TryGet(group.Key, out IStorageEndpoint endpoint) || !IsAvailable(endpoint))
                {
                    failure = ProductionFailureReason.EndpointUnavailable;
                    return false;
                }

                int reservedForEndpoint = GetReservedOutputCount(endpoint.EndpointId);
                int consumedAtCommit = record.Inputs
                    .Where(slice => slice.EndpointId == endpoint.EndpointId)
                    .Sum(slice => slice.Count);
                if (endpoint.StoredCount - consumedAtCommit + reservedForEndpoint > endpoint.Capacity
                    || group.Any(slice =>
                    {
                        ThingDef def = DefDatabase<ThingDef>.GetNamedSilentFail(slice.ThingDefName);
                        ThingDef stuff = slice.StuffDefName.NullOrEmpty()
                            ? null
                            : DefDatabase<ThingDef>.GetNamedSilentFail(slice.StuffDefName);
                        return def == null
                            || !endpoint.Accepts(def)
                            || (def.MadeFromStuff && (stuff?.stuffProps?.CanMake(def) != true))
                            || (!def.MadeFromStuff && stuff != null);
                    }))
                {
                    failure = ProductionFailureReason.OutputCapacityUnavailable;
                    return false;
                }
            }

            failure = ProductionFailureReason.None;
            return true;
        }

        private void RollBack(List<ConsumedThing> consumed, List<ProducedThing> produced)
        {
            foreach (ProducedThing entry in produced.AsEnumerable().Reverse())
            {
                if (entry.Endpoint.InnerContainer.Contains(entry.Thing))
                {
                    Thing removed = entry.Endpoint.InnerContainer.Take(entry.Thing, entry.Thing.stackCount);
                    removed?.Destroy();
                }
            }

            foreach (ConsumedThing entry in consumed.AsEnumerable().Reverse())
            {
                if (!entry.Endpoint.InnerContainer.TryAdd(entry.Thing, false))
                {
                    GenPlace.TryPlaceThing(entry.Thing, entry.Endpoint.ParentThing.Position, map, ThingPlaceMode.Near);
                }
            }
        }

        private void Remember(string operationId, TransferResult result)
        {
            if (operations.Count >= MaxRememberedOperations)
            {
                string oldest = operations.Keys.FirstOrDefault();
                if (oldest != null)
                {
                    operations.Remove(oldest);
                }
            }

            operations[operationId] = new TransferOperationRecord
            {
                OperationId = operationId,
                Succeeded = result.Succeeded,
                MovedCount = result.MovedCount,
                RemainingCount = result.RemainingCount,
                FailureReason = result.FailureReason
            };
        }

        private StorageEndpointView ToView(IStorageEndpoint endpoint)
        {
            return new StorageEndpointView
            {
                EndpointId = endpoint.EndpointId,
                Label = endpoint.Label,
                State = endpoint.State,
                StoredCount = endpoint.StoredCount,
                Capacity = endpoint.Capacity,
                ReservedOutputCount = GetReservedOutputCount(endpoint.EndpointId),
                Items = endpoint.InnerContainer
                    .Select(thing => new StorageItemView
                    {
                        ThingId = thing.ThingID,
                        Def = thing.def,
                        StackCount = thing.stackCount,
                        ReservedCount = GetReservedInputCount(endpoint.EndpointId, thing.ThingID),
                        HitPoints = thing.HitPoints,
                        MaxHitPoints = thing.MaxHitPoints,
                        Label = thing.LabelCap
                    })
                    .ToList()
            };
        }

        private static List<StorageDefCount> Normalize(IReadOnlyList<StorageDefCount> items)
        {
            return (items ?? new List<StorageDefCount>())
                .Where(item => item != null)
                .GroupBy(item => item.Def)
                .Select(group => new StorageDefCount(group.Key, group.Sum(item => item.Count)))
                .ToList();
        }

        private static List<StorageProductSpec> NormalizeProducts(ProductionReservationRequest request)
        {
            IEnumerable<StorageProductSpec> products = request?.Products;
            if (products == null || !products.Any())
            {
                products = (request?.Outputs ?? new List<StorageDefCount>())
                    .Where(item => item != null)
                    .Select(item => new StorageProductSpec(item.Def, item.Count));
            }

            return products
                .Where(item => item != null)
                .GroupBy(item => new
                {
                    item.Def,
                    item.StuffDef,
                    item.Quality
                })
                .Select(group => new StorageProductSpec(
                    group.Key.Def,
                    group.Sum(item => item.Count),
                    group.Key.StuffDef,
                    group.Key.Quality))
                .ToList();
        }

        private static bool IsValidProduct(StorageProductSpec product)
        {
            if (product?.Def == null || product.Count <= 0)
            {
                return false;
            }

            return product.Def.MadeFromStuff
                ? product.StuffDef?.stuffProps?.CanMake(product.Def) == true
                : product.StuffDef == null;
        }

        private static bool IsAvailable(IStorageEndpoint endpoint)
        {
            return endpoint != null
                && endpoint.State != EndpointState.Disconnected
                && endpoint.State != EndpointState.Faulted;
        }

        private void RebuildReservationIndexes()
        {
            reservedInputIndex.Clear();
            reservedOutputIndex.Clear();
            foreach (ProductionReservationRecord record in productionReservations.Values
                .Where(item => item.State == ProductionReservationState.Reserved))
            {
                IndexReservation(record, 1);
            }
        }

        private void ReleaseReservationsForEndpoint(string endpointId)
        {
            foreach (ProductionReservationRecord record in productionReservations.Values
                .Where(item => item.State == ProductionReservationState.Reserved
                    && (item.Inputs.Any(slice => slice.EndpointId == endpointId)
                        || item.Outputs.Any(slice => slice.EndpointId == endpointId)))
                .ToList())
            {
                IndexReservation(record, -1);
                record.State = ProductionReservationState.Released;
                record.FailureReason = ProductionFailureReason.EndpointUnavailable;
            }
        }

        private void IndexReservation(ProductionReservationRecord record, int direction)
        {
            if (record == null || direction == 0)
            {
                return;
            }

            foreach (StorageInputReservationSlice slice in record.Inputs ?? new List<StorageInputReservationSlice>())
            {
                UpdateIndex(
                    reservedInputIndex,
                    InputReservationKey(slice.EndpointId, slice.ThingId),
                    direction * Math.Max(0, slice.Count));
            }

            foreach (StorageOutputReservationSlice slice in record.Outputs ?? new List<StorageOutputReservationSlice>())
            {
                UpdateIndex(
                    reservedOutputIndex,
                    slice.EndpointId,
                    direction * Math.Max(0, slice.Count));
            }
        }

        private static void UpdateIndex(Dictionary<string, int> index, string key, int delta)
        {
            if (key.NullOrEmpty() || delta == 0)
            {
                return;
            }

            int next = (index.TryGetValue(key, out int current) ? current : 0) + delta;
            if (next <= 0)
            {
                index.Remove(key);
            }
            else
            {
                index[key] = next;
            }
        }

        private static string InputReservationKey(string endpointId, string thingId)
        {
            return endpointId + "\u001f" + thingId;
        }

        private void HandleEndpointContentsChanged()
        {
            Changed?.Invoke();
        }

        private sealed class ConsumedThing
        {
            public ConsumedThing(IStorageEndpoint endpoint, Thing thing)
            {
                Endpoint = endpoint;
                Thing = thing;
            }

            public IStorageEndpoint Endpoint { get; }
            public Thing Thing { get; }
        }

        private sealed class ProducedThing
        {
            public ProducedThing(IStorageEndpoint endpoint, Thing thing)
            {
                Endpoint = endpoint;
                Thing = thing;
            }

            public IStorageEndpoint Endpoint { get; }
            public Thing Thing { get; }
        }
    }
}
