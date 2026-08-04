using System;
using System.Collections.Generic;
using System.Linq;
using RimWorld;
using Shion.Storage;
using UnityEngine;
using VEF;
using Verse;

namespace Shion.Kombinat
{
    public sealed class CompProperties_KombinatFactory : CompProperties
    {
        public KombinatFacilityProfileDef facilityProfile;

        public CompProperties_KombinatFactory()
        {
            compClass = typeof(CompKombinatFactory);
        }

        public override IEnumerable<string> ConfigErrors(ThingDef parentDef)
        {
            foreach (string error in base.ConfigErrors(parentDef))
            {
                yield return error;
            }

            if (facilityProfile == null)
            {
                yield return parentDef.defName + " requires a KombinatFacilityProfileDef.";
            }
        }
    }

    public sealed class CompKombinatFactory : ThingComp, IThingHolder
    {
        private const int CurrentDataVersion = 2;

        private ThingOwner<Thing> legacyInputBuffer;
        private ThingOwner<Thing> legacyOutputBuffer;
        private LegacyOutputHolder legacyOutputHolder;
        private int dataVersion = CurrentDataVersion;

        public CompProperties_KombinatFactory Props => (CompProperties_KombinatFactory)props;
        public KombinatFacilityProfileDef Profile => Props.facilityProfile;
        public string FacilityId => "facility:" + parent.ThingID;
        public new IThingHolder ParentHolder => parent.ParentHolder;

        public override void PostSpawnSetup(bool respawningAfterLoad)
        {
            base.PostSpawnSetup(respawningAfterLoad);
            RecoverLegacyBuffers();
        }

        public override void PostDeSpawn(Map map, DestroyMode mode = DestroyMode.Vanish)
        {
            ReleaseAssignments(map);
            base.PostDeSpawn(map, mode);
        }

        public override void PostDestroy(DestroyMode mode, Map previousMap)
        {
            ReleaseAssignments(previousMap);
            if (previousMap != null)
            {
                legacyInputBuffer?.TryDropAll(parent.Position, previousMap, ThingPlaceMode.Near);
                legacyOutputBuffer?.TryDropAll(parent.Position, previousMap, ThingPlaceMode.Near);
            }

            base.PostDestroy(mode, previousMap);
        }

        public override void PostExposeData()
        {
            base.PostExposeData();
            Scribe_Values.Look(ref dataVersion, "dataVersion", CurrentDataVersion);
            if (Scribe.mode == LoadSaveMode.LoadingVars || legacyInputBuffer?.Any == true)
            {
                Scribe_Deep.Look(ref legacyInputBuffer, "inputBuffer", this);
            }

            if (Scribe.mode == LoadSaveMode.LoadingVars || legacyOutputBuffer?.Any == true)
            {
                EnsureLegacyOutputHolder();
                Scribe_Deep.Look(ref legacyOutputBuffer, "outputBuffer", legacyOutputHolder);
            }
        }

        public ThingOwner GetDirectlyHeldThings()
        {
            return EnsureLegacyInputBuffer();
        }

        public void GetChildHolders(List<IThingHolder> outChildren)
        {
            if (legacyInputBuffer != null)
            {
                ThingOwnerUtility.AppendThingHoldersFromThings(outChildren, legacyInputBuffer);
            }

            if (legacyOutputBuffer != null)
            {
                ThingOwnerUtility.AppendThingHoldersFromThings(outChildren, legacyOutputBuffer);
            }
        }

        public override void CompTickInterval(int delta)
        {
            base.CompTickInterval(delta);
            int interval = Math.Max(1, Profile?.processIntervalTicks ?? 60);
            if (!parent.Spawned || Find.TickManager.TicksGame % interval != 0)
            {
                return;
            }

            ProductionRequestRecord request = AssignedRequest();
            if (request == null)
            {
                return;
            }

            CompPowerTrader power = parent.TryGetComp<CompPowerTrader>();
            if (power != null && !power.PowerOn)
            {
                request.State = ProductionRequestState.Faulted;
                request.StatusReason = "Shion_StatusNoPower";
                KombinatServices.Ledger?.SynchronizeRuntime(request);
                return;
            }

            ProcessOneInterval(interval, request);
            KombinatServices.Ledger?.SynchronizeRuntime(request);
        }

        public override string CompInspectStringExtra()
        {
            ProductionRequestRecord request = AssignedRequest();
            string status = request == null ? "Shion_StatusIdle".Translate() : request.StatusReason.Translate();
            return "Shion_FactoryInspect".Translate(Profile?.LabelCap ?? "Shion_UnknownProfile".Translate(), status, FacilityId);
        }

        public override IEnumerable<Gizmo> CompGetGizmosExtra()
        {
            foreach (Gizmo gizmo in base.CompGetGizmosExtra())
            {
                yield return gizmo;
            }

            yield return new Command_Action
            {
                defaultLabel = "Shion_OpenKombinat".Translate(),
                defaultDesc = "Shion_OpenKombinatDesc".Translate(),
                icon = ContentFinder<Texture2D>.Get("UI/Commands/ShionKombinat", false),
                action = () => Find.WindowStack.Add(
                    new Window_KombinatTerminal(
                        this,
                        null,
                        typeof(KombinatFacilitiesPageWorker)))
            };
        }

        public bool Supports(KombinatPatternDef pattern)
        {
            return pattern != null && Profile?.patterns?.Contains(pattern) == true;
        }

        public bool Supports(KombinatProductionPattern pattern)
        {
            return KombinatProductionCatalog.Supports(Profile, pattern);
        }

        private void ProcessOneInterval(int delta, ProductionRequestRecord request)
        {
            WorldComponent_KombinatLedger ledger = KombinatServices.Ledger;
            MapComponent_ShionEndpointRegistry storage = StorageServices.For(parent.Map);
            if (ledger == null || storage == null || request == null)
            {
                return;
            }

            KombinatProductionPattern pattern =
                KombinatProductionCatalog.Resolve(request.PatternDefName);
            if (pattern == null || !Supports(pattern) || pattern.StageCount <= 0)
            {
                request.State = ProductionRequestState.Faulted;
                request.StatusReason = "Shion_StatusPatternMissing";
                return;
            }

            if (request.StageIndex < 0 || request.StageIndex >= pattern.StageCount)
            {
                request.StageIndex = 0;
                request.WorkTicksRemaining = 0;
            }

            string storageOperationId = BuildStorageOperationId(request);
            if (request.ActiveStorageOperationId.NullOrEmpty())
            {
                if (!pattern.TryResolveStage(request.StageIndex, storage, out KombinatResolvedStage stage))
                {
                    request.State = ProductionRequestState.MaterialWaiting;
                    request.StatusReason = stage.FailureReasonKey ?? "Shion_StatusMaterialWaiting";
                    return;
                }

                if (request.StageIndex == 0 && request.CompletedAmount == 0)
                {
                    AccountOperationResult currencyReservation = ledger.Reserve(
                        request.CurrencyOperationId,
                        pattern.CurrencyCost * request.RequestedAmount);
                    if (!currencyReservation.Succeeded)
                    {
                        request.State = ProductionRequestState.Faulted;
                        request.StatusReason = "Shion_StatusCurrencyShortage";
                        return;
                    }
                }

                ProductionReservationResult reservation = storage.ReserveProduction(
                    new ProductionReservationRequest
                    {
                        OperationId = storageOperationId,
                        Inputs = stage.Inputs,
                        Products = stage.Outputs
                    });
                if (!reservation.Succeeded)
                {
                    request.State = reservation.FailureReason == ProductionFailureReason.OutputCapacityUnavailable
                        ? ProductionRequestState.OutputBlocked
                        : ProductionRequestState.MaterialWaiting;
                    request.StatusReason = request.State == ProductionRequestState.OutputBlocked
                        ? "Shion_StatusOutputBlocked"
                        : "Shion_StatusMaterialWaiting";
                    return;
                }

                request.ActiveStorageOperationId = storageOperationId;
                request.ActiveMapId = parent.Map.uniqueID;
                request.WorkTicksRemaining = Math.Max(1, stage.WorkTicks);
            }

            request.State = ProductionRequestState.Working;
            request.StatusReason = "Shion_StatusWorking";
            int workDone = Mathf.Max(1, Mathf.RoundToInt(delta * Math.Max(0.01f, Profile.workSpeedFactor)));
            request.WorkTicksRemaining -= workDone;
            if (request.WorkTicksRemaining > 0)
            {
                return;
            }

            ProductionReservationResult commit = storage.CommitProduction(request.ActiveStorageOperationId);
            if (!commit.Succeeded)
            {
                if (commit.State == ProductionReservationState.Released)
                {
                    request.ActiveStorageOperationId = null;
                    request.ActiveMapId = -1;
                    request.WorkTicksRemaining = 0;
                    request.State = ProductionRequestState.MaterialWaiting;
                    request.StatusReason = "Shion_StatusMaterialWaiting";
                }
                else
                {
                    request.State = ProductionRequestState.Faulted;
                    request.StatusReason = "Shion_StatusStorageCommitFault";
                }

                return;
            }

            request.ActiveStorageOperationId = null;
            request.ActiveMapId = -1;
            VefFleckMaker.MakeLightningGlow(parent.Map, parent.DrawPos, 0.6f, 0.08f, 0.08f);
            request.StageIndex++;
            request.WorkTicksRemaining = 0;
            if (request.StageIndex < pattern.StageCount)
            {
                request.State = ProductionRequestState.Planned;
                request.StatusReason = "Shion_StatusPlanned";
                return;
            }

            request.CompletedAmount++;
            if (request.CompletedAmount >= request.RequestedAmount)
            {
                ledger.Commit(request.CurrencyOperationId);
                request.State = ProductionRequestState.Completed;
                request.StatusReason = "Shion_StatusCompleted";
                request.StageIndex = pattern.StageCount - 1;
                return;
            }

            request.StageIndex = 0;
            request.State = ProductionRequestState.Planned;
            request.StatusReason = "Shion_StatusPlanned";
        }

        private ProductionRequestRecord AssignedRequest()
        {
            WorldComponent_KombinatLedger ledger = KombinatServices.Ledger;
            ProductionRequestRecord request = ledger?.Requests
                .Where(item => item.State != ProductionRequestState.Completed
                    && item.State != ProductionRequestState.Cancelled
                    && (item.FactoryThingId.NullOrEmpty() || item.FactoryThingId == parent.ThingID)
                    && Supports(KombinatProductionCatalog.Resolve(item.PatternDefName)))
                .OrderByDescending(item => item.Priority)
                .ThenBy(item => item.CreatedTick)
                .FirstOrDefault();
            if (request != null && request.FactoryThingId.NullOrEmpty())
            {
                request.FactoryThingId = parent.ThingID;
            }

            return request;
        }

        private string BuildStorageOperationId(ProductionRequestRecord request)
        {
            return request.RequestId
                + ":batch:" + request.CompletedAmount
                + ":stage:" + request.StageIndex;
        }

        private void ReleaseAssignments(Map map)
        {
            WorldComponent_KombinatLedger ledger = KombinatServices.Ledger;
            if (ledger == null)
            {
                return;
            }

            foreach (ProductionRequestRecord request in ledger.Requests
                .Where(item => item.FactoryThingId == parent.ThingID
                    && item.State != ProductionRequestState.Completed
                    && item.State != ProductionRequestState.Cancelled))
            {
                if (!request.ActiveStorageOperationId.NullOrEmpty())
                {
                    StorageServices.For(map)?.ReleaseProduction(request.ActiveStorageOperationId);
                    request.ActiveStorageOperationId = null;
                    request.ActiveMapId = -1;
                }

                request.FactoryThingId = null;
                request.WorkTicksRemaining = 0;
                request.State = ProductionRequestState.Planned;
                request.StatusReason = "Shion_StatusPlanned";
                ledger.SynchronizeRuntime(request);
            }
        }

        private void RecoverLegacyBuffers()
        {
            MapComponent_ShionEndpointRegistry registry = StorageServices.For(parent.Map);
            registry?.RecoverLegacyContents(legacyInputBuffer, parent.Position);
            registry?.RecoverLegacyContents(legacyOutputBuffer, parent.Position);
            if (legacyInputBuffer?.Any == false)
            {
                legacyInputBuffer = null;
            }

            if (legacyOutputBuffer?.Any == false)
            {
                legacyOutputBuffer = null;
            }

            dataVersion = CurrentDataVersion;
        }

        private ThingOwner<Thing> EnsureLegacyInputBuffer()
        {
            if (legacyInputBuffer == null)
            {
                legacyInputBuffer = new ThingOwner<Thing>(this, false, LookMode.Deep);
            }

            return legacyInputBuffer;
        }

        private void EnsureLegacyOutputHolder()
        {
            if (legacyOutputHolder == null)
            {
                legacyOutputHolder = new LegacyOutputHolder(this);
            }
        }

        private sealed class LegacyOutputHolder : IThingHolder
        {
            private readonly CompKombinatFactory factory;

            public LegacyOutputHolder(CompKombinatFactory factory)
            {
                this.factory = factory;
            }

            public IThingHolder ParentHolder => factory;
            public ThingOwner GetDirectlyHeldThings() => factory.legacyOutputBuffer;
            public void GetChildHolders(List<IThingHolder> outChildren)
            {
            }
        }
    }
}
