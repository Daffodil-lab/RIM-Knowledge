using System.Collections.Generic;
using Verse;

namespace Shion.Core
{
    public sealed class PawnCapacityWorker_ShionFluidReprocessing : PawnCapacityWorker
    {
        public override bool CanHaveCapacity(BodyDef body)
        {
            return body != null &&
                ShionDefOf.Shion_FluidReprocessor != null &&
                body.GetPartsWithDef(ShionDefOf.Shion_FluidReprocessor).Count > 0;
        }

        public override float CalculateCapacityLevel(
            HediffSet diffSet,
            List<PawnCapacityUtility.CapacityImpactor> impactors)
        {
            var partDef = ShionDefOf.Shion_FluidReprocessor;
            if (diffSet?.pawn == null || partDef == null)
            {
                return 1f;
            }

            var parts = diffSet.pawn.RaceProps.body.GetPartsWithDef(partDef);
            if (parts.Count == 0)
            {
                return 1f;
            }

            var operational = 0;
            for (var index = 0; index < parts.Count; index++)
            {
                if (!diffSet.PartIsMissing(parts[index]))
                {
                    operational++;
                }
            }

            return (float)operational / parts.Count;
        }
    }
}
