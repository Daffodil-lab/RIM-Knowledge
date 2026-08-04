using RimWorld;
using UnityEngine;
using Verse;

namespace Shion.Core
{
    public sealed class Gene_ShionManufacturedBody : Gene
    {
        public override void PostAdd()
        {
            base.PostAdd();
            RefreshBodyState();
        }

        public override void Tick()
        {
            base.Tick();

            var extension = ShionUtility.RaceExtensionFor(pawn);
            if (extension == null || pawn.Dead)
            {
                return;
            }

            var rest = pawn.needs?.rest;
            if (rest != null && rest.CurLevel < extension.restFloor)
            {
                rest.CurLevel = extension.restFloor;
            }

            ConvertBloodLossToCellLoss(extension.cellLossHediff);

            var interval = extension.healthCheckIntervalTicks > 0
                ? extension.healthCheckIntervalTicks
                : 60;
            if (pawn.IsHashIntervalTick(interval))
            {
                RefreshBodyState();
            }
        }

        public void RefreshBodyState()
        {
            var extension = ShionUtility.RaceExtensionFor(pawn);
            if (extension == null || pawn.health == null || pawn.Dead)
            {
                return;
            }

            UpdateFluidReprocessing(extension);
            RemoveBlockedAnomalyStates();
        }

        private void ConvertBloodLossToCellLoss(HediffDef cellLossDef)
        {
            if (cellLossDef == null)
            {
                return;
            }

            var bloodLoss = pawn.health.hediffSet.GetFirstHediffOfDef(HediffDefOf.BloodLoss);
            if (bloodLoss == null)
            {
                return;
            }

            var cellLoss = pawn.health.hediffSet.GetFirstHediffOfDef(cellLossDef)
                ?? pawn.health.AddHediff(cellLossDef);
            cellLoss.Severity = Mathf.Clamp01(cellLoss.Severity + bloodLoss.Severity);
            pawn.health.RemoveHediff(bloodLoss);
        }

        private void UpdateFluidReprocessing(ShionRaceExtension extension)
        {
            if (extension.fluidReprocessorPart == null ||
                extension.fluidReprocessingOfflineHediff == null)
            {
                return;
            }

            var parts = pawn.RaceProps.body.GetPartsWithDef(extension.fluidReprocessorPart);
            var anyOperational = false;
            for (var index = 0; index < parts.Count; index++)
            {
                if (!pawn.health.hediffSet.PartIsMissing(parts[index]))
                {
                    anyOperational = true;
                    break;
                }
            }

            var offline = pawn.health.hediffSet.GetFirstHediffOfDef(
                extension.fluidReprocessingOfflineHediff);
            if (parts.Count > 0 && !anyOperational)
            {
                if (offline == null)
                {
                    pawn.health.AddHediff(extension.fluidReprocessingOfflineHediff);
                }
            }
            else if (offline != null)
            {
                pawn.health.RemoveHediff(offline);
            }
        }

        private void RemoveBlockedAnomalyStates()
        {
            var hediffs = pawn.health.hediffSet.hediffs;
            for (var index = hediffs.Count - 1; index >= 0; index--)
            {
                var hediff = hediffs[index];
                if (hediff.def.organicAddedBodypart ||
                    (def.makeImmuneTo != null && def.makeImmuneTo.Contains(hediff.def)))
                {
                    pawn.health.RemoveHediff(hediff);
                }
            }
        }
    }
}
