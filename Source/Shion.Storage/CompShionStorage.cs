using System;
using System.Collections.Generic;
using System.Linq;
using RimWorld;
using UnityEngine;
using VEF.Graphics;
using Verse;

namespace Shion.Storage
{
    public sealed class CompProperties_ShionStorage : CompProperties
    {
        public int capacity = 2000;
        public bool allowImportNearby = true;

        public CompProperties_ShionStorage()
        {
            compClass = typeof(CompShionStorage);
        }
    }

    public sealed class CompShionStorage : ThingComp, IStorageEndpoint
    {
        private const int CurrentDataVersion = 1;

        private ThingOwner<Thing> innerContainer;
        private string endpointId;
        private int dataVersion = CurrentDataVersion;

        public event Action ContentsChanged;

        public CompProperties_ShionStorage Props => (CompProperties_ShionStorage)props;
        public string EndpointId => endpointId;
        public string Label => parent.LabelCap;
        public int Capacity => Props.capacity;
        public int StoredCount => InnerContainer.TotalStackCount;
        public Thing ParentThing => parent;
        public ThingOwner InnerContainer => EnsureContainer();
        public new IThingHolder ParentHolder => parent.ParentHolder;

        public EndpointState State
        {
            get
            {
                if (!parent.Spawned)
                {
                    return EndpointState.Disconnected;
                }

                CompPowerTrader power = parent.TryGetComp<CompPowerTrader>();
                if (power != null && !power.PowerOn)
                {
                    return EndpointState.Faulted;
                }

                return StoredCount >= Capacity ? EndpointState.Full : EndpointState.Ready;
            }
        }

        public override void PostPostMake()
        {
            base.PostPostMake();
            EnsureContainer();
            EnsureEndpointId();
        }

        public override void PostSpawnSetup(bool respawningAfterLoad)
        {
            base.PostSpawnSetup(respawningAfterLoad);
            EnsureContainer();
            EnsureEndpointId();
            innerContainer.OnContentsChanged -= NotifyContentsChanged;
            innerContainer.OnContentsChanged += NotifyContentsChanged;
            StorageServices.For(parent.Map)?.Register(this);

            CustomOverlayDrawer drawer = parent.Map?.GetComponent<CustomOverlayDrawer>();
            if (drawer != null && ShionStorageDefOf.Shion_EndpointOverlay != null)
            {
                drawer.Enable(parent, ShionStorageDefOf.Shion_EndpointOverlay);
            }
        }

        public override void PostDeSpawn(Map map, DestroyMode mode = DestroyMode.Vanish)
        {
            map?.GetComponent<MapComponent_ShionEndpointRegistry>()?.Unregister(this);
            CustomOverlayDrawer drawer = map?.GetComponent<CustomOverlayDrawer>();
            if (drawer != null && ShionStorageDefOf.Shion_EndpointOverlay != null)
            {
                drawer.Disable(parent, ShionStorageDefOf.Shion_EndpointOverlay);
            }

            base.PostDeSpawn(map, mode);
        }

        public override void PostDestroy(DestroyMode mode, Map previousMap)
        {
            if (previousMap != null && innerContainer != null && innerContainer.Any)
            {
                innerContainer.TryDropAll(parent.Position, previousMap, ThingPlaceMode.Near);
            }

            base.PostDestroy(mode, previousMap);
        }

        public override void PostExposeData()
        {
            base.PostExposeData();
            Scribe_Values.Look(ref dataVersion, "dataVersion", CurrentDataVersion);
            Scribe_Values.Look(ref endpointId, "endpointId");
            Scribe_Deep.Look(ref innerContainer, "innerContainer", this);
            EnsureContainer();
            EnsureEndpointId();
        }

        public ThingOwner GetDirectlyHeldThings()
        {
            return InnerContainer;
        }

        public void GetChildHolders(List<IThingHolder> outChildren)
        {
            ThingOwnerUtility.AppendThingHoldersFromThings(outChildren, EnsureContainer());
        }

        public bool Accepts(ThingDef def)
        {
            return def != null
                && def.category == ThingCategory.Item
                && State != EndpointState.Disconnected
                && State != EndpointState.Faulted;
        }

        public bool CanAccept(Thing thing, int count)
        {
            MapComponent_ShionEndpointRegistry registry = parent.Spawned ? StorageServices.For(parent.Map) : null;
            int reservedOutput = registry?.GetReservedOutputCount(EndpointId) ?? 0;
            return thing != null
                && count > 0
                && Accepts(thing.def)
                && StoredCount + reservedOutput + count <= Capacity;
        }

        public override string CompInspectStringExtra()
        {
            return "Shion_StorageInspect".Translate(StoredCount, Capacity, EndpointId);
        }

        public override IEnumerable<Gizmo> CompGetGizmosExtra()
        {
            foreach (Gizmo gizmo in base.CompGetGizmosExtra())
            {
                yield return gizmo;
            }

            yield return new Command_Action
            {
                defaultLabel = "Shion_OpenStorage".Translate(),
                defaultDesc = "Shion_OpenStorageDesc".Translate(),
                icon = ContentFinder<Texture2D>.Get("UI/Commands/ShionStorage", false),
                action = () =>
                {
                    if (!StorageManagementUi.TryOpenIntegrated(this))
                    {
                        Find.WindowStack.Add(new Window_ShionStorage(this));
                    }
                }
            };

            if (Props.allowImportNearby)
            {
                yield return new Command_Action
                {
                    defaultLabel = "Shion_ImportNearby".Translate(),
                    defaultDesc = "Shion_ImportNearbyDesc".Translate(),
                    action = ImportNearby
                };
            }

            yield return new Command_Action
            {
                defaultLabel = "Shion_EjectAll".Translate(),
                defaultDesc = "Shion_EjectAllDesc".Translate(),
                action = EjectAll
            };
        }

        public bool TryEject(Thing thing, int count, out Thing dropped)
        {
            dropped = null;
            if (thing == null || !InnerContainer.Contains(thing) || count <= 0 || !parent.Spawned)
            {
                return false;
            }

            MapComponent_ShionEndpointRegistry registry = StorageServices.For(parent.Map);
            int available = Math.Max(0, thing.stackCount - (registry?.GetReservedInputCount(EndpointId, thing.ThingID) ?? 0));
            if (available <= 0)
            {
                return false;
            }

            bool result = InnerContainer.TryDrop(
                thing,
                parent.InteractionCell,
                parent.Map,
                ThingPlaceMode.Near,
                Math.Min(count, available),
                out dropped,
                null,
                cell => cell.InBounds(parent.Map) && cell.Standable(parent.Map));

            if (result)
            {
                NotifyContentsChanged();
            }

            return result;
        }

        private ThingOwner<Thing> EnsureContainer()
        {
            if (innerContainer == null)
            {
                innerContainer = new ThingOwner<Thing>(this, false, LookMode.Deep);
                innerContainer.OnContentsChanged += NotifyContentsChanged;
            }

            return innerContainer;
        }

        private void EnsureEndpointId()
        {
            if (endpointId.NullOrEmpty() && parent != null)
            {
                endpointId = "storage:" + parent.ThingID;
            }
        }

        private void NotifyContentsChanged()
        {
            ContentsChanged?.Invoke();
            if (parent.Spawned)
            {
                StorageServices.For(parent.Map)?.NotifyEndpointChanged(this);
            }
        }

        private void EjectAll()
        {
            if (!parent.Spawned || !InnerContainer.Any)
            {
                return;
            }

            bool result = true;
            foreach (Thing thing in InnerContainer.ToList())
            {
                int available = thing.stackCount
                    - (StorageServices.For(parent.Map)?.GetReservedInputCount(EndpointId, thing.ThingID) ?? 0);
                if (available > 0 && !TryEject(thing, available, out _))
                {
                    result = false;
                }
            }

            if (!result)
            {
                Messages.Message("Shion_NoOutputCell".Translate(), parent, MessageTypeDefOf.RejectInput, false);
            }
            else
            {
                NotifyContentsChanged();
            }
        }

        private void ImportNearby()
        {
            if (!parent.Spawned || StoredCount >= Capacity)
            {
                return;
            }

            MapComponent_ShionEndpointRegistry registry = StorageServices.For(parent.Map);
            if (registry == null)
            {
                return;
            }

            List<Thing> candidates = GenRadial.RadialDistinctThingsAround(parent.Position, parent.Map, 2.9f, true)
                .Where(thing => thing.Spawned && thing.def.category == ThingCategory.Item)
                .ToList();

            int imported = 0;
            foreach (Thing candidate in candidates)
            {
                int count = Math.Min(candidate.stackCount, Capacity - StoredCount);
                if (count <= 0)
                {
                    break;
                }

                TransferResult result = registry.TryDeposit(new DepositRequest
                {
                    OperationId = "manual-deposit:" + Guid.NewGuid().ToString("N"),
                    DestinationEndpointId = EndpointId,
                    ThingId = candidate.ThingID,
                    Count = count
                });
                if (result.Succeeded)
                {
                    imported += result.MovedCount;
                }
            }

            if (imported > 0)
            {
                NotifyContentsChanged();
                Messages.Message("Shion_ImportedCount".Translate(imported), parent, MessageTypeDefOf.PositiveEvent, false);
            }
        }
    }
}
