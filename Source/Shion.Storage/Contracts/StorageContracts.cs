using System;
using System.Collections.Generic;
using RimWorld;
using Verse;

namespace Shion.Storage
{
    public enum EndpointState
    {
        Ready,
        TransferPending,
        Full,
        Disconnected,
        Faulted
    }

    public enum TransferFailureReason
    {
        None,
        InvalidOperationId,
        EndpointMissing,
        SourceDoesNotOwnThing,
        RejectedByFilter,
        DestinationFull,
        EndpointUnavailable,
        InvalidCount,
        TransferFailed
    }

    public enum ProductionReservationState
    {
        Reserved,
        Committed,
        Released
    }

    public enum ProductionFailureReason
    {
        None,
        InvalidOperationId,
        InvalidRequest,
        ReservationMissing,
        AlreadyFinalized,
        MaterialsUnavailable,
        OutputCapacityUnavailable,
        EndpointUnavailable,
        CommitFailed
    }

    public sealed class StorageItemView
    {
        public string ThingId;
        public ThingDef Def;
        public int StackCount;
        public int ReservedCount;
        public int HitPoints;
        public int MaxHitPoints;
        public string Label;
    }

    public sealed class StorageEndpointView
    {
        public string EndpointId;
        public string Label;
        public EndpointState State;
        public int StoredCount;
        public int Capacity;
        public int ReservedOutputCount;
        public IReadOnlyList<StorageItemView> Items;
    }

    public sealed class StorageDefCount
    {
        public ThingDef Def;
        public int Count;

        public StorageDefCount()
        {
        }

        public StorageDefCount(ThingDef def, int count)
        {
            Def = def;
            Count = count;
        }
    }

    public sealed class StorageProductSpec
    {
        public ThingDef Def;
        public ThingDef StuffDef;
        public int Count;
        public QualityCategory Quality = QualityCategory.Normal;

        public StorageProductSpec()
        {
        }

        public StorageProductSpec(
            ThingDef def,
            int count,
            ThingDef stuffDef = null,
            QualityCategory quality = QualityCategory.Normal)
        {
            Def = def;
            StuffDef = stuffDef;
            Count = count;
            Quality = quality;
        }
    }

    public sealed class ProductionReservationRequest
    {
        public string OperationId;
        public IReadOnlyList<StorageDefCount> Inputs;
        public IReadOnlyList<StorageDefCount> Outputs;
        public IReadOnlyList<StorageProductSpec> Products;
    }

    public sealed class ProductionReservationResult
    {
        public bool Succeeded;
        public ProductionReservationState State;
        public ProductionFailureReason FailureReason;
        public int ReservedInputCount;
        public int ReservedOutputCount;

        public static ProductionReservationResult Failure(ProductionFailureReason reason)
        {
            return new ProductionReservationResult
            {
                Succeeded = false,
                State = ProductionReservationState.Released,
                FailureReason = reason
            };
        }
    }

    public sealed class TransferRequest
    {
        public string OperationId;
        public string SourceEndpointId;
        public string DestinationEndpointId;
        public string ThingId;
        public int Count;
    }

    public sealed class DepositRequest
    {
        public string OperationId;
        public string DestinationEndpointId;
        public string ThingId;
        public int Count;
    }

    public sealed class TransferResult
    {
        public bool Succeeded;
        public int MovedCount;
        public int RemainingCount;
        public TransferFailureReason FailureReason;

        public static TransferResult Failure(TransferFailureReason reason, int remaining)
        {
            return new TransferResult
            {
                Succeeded = false,
                MovedCount = 0,
                RemainingCount = remaining,
                FailureReason = reason
            };
        }
    }

    public interface IStorageEndpoint : IThingHolder
    {
        string EndpointId { get; }
        string Label { get; }
        EndpointState State { get; }
        int Capacity { get; }
        int StoredCount { get; }
        Thing ParentThing { get; }
        ThingOwner InnerContainer { get; }
        bool Accepts(ThingDef def);
        bool CanAccept(Thing thing, int count);
        event Action ContentsChanged;
    }

    public interface IStorageQueryService
    {
        IReadOnlyList<StorageEndpointView> GetEndpoints();
        StorageEndpointView GetEndpoint(string endpointId);
    }

    public interface IStorageTransactionService
    {
        TransferResult TryDeposit(DepositRequest request);
        TransferResult TryTransfer(TransferRequest request);
        TransferResult TryWithdraw(string operationId, string endpointId, string thingId, int count);
    }

    public interface IStorageProductionService
    {
        ProductionReservationResult ReserveProduction(ProductionReservationRequest request);
        ProductionReservationResult CommitProduction(string operationId);
        ProductionReservationResult ReleaseProduction(string operationId);
        int GetReservedInputCount(string endpointId, string thingId);
        int GetReservedOutputCount(string endpointId);
    }

    public interface IEndpointRegistry
    {
        event Action Changed;
        IEnumerable<IStorageEndpoint> Endpoints { get; }
        void Register(IStorageEndpoint endpoint);
        void Unregister(IStorageEndpoint endpoint);
        void NotifyEndpointChanged(IStorageEndpoint endpoint);
        bool TryGet(string endpointId, out IStorageEndpoint endpoint);
    }
}
