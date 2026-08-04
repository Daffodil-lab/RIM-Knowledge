using System;
using RimWorld;
using Verse;

namespace Shion.Core
{
    public abstract class StatPart_ShionBodyBase : StatPart
    {
        protected static Pawn PawnFor(StatRequest request)
        {
            return request.Thing as Pawn ?? request.Pawn;
        }

        protected static bool IsNeutral(float factor)
        {
            return Math.Abs(factor - 1f) < 0.0001f;
        }
    }

    public sealed class StatPart_ShionTailIntegrity : StatPart_ShionBodyBase
    {
        public override void TransformValue(StatRequest req, ref float val)
        {
            val *= FactorFor(PawnFor(req));
        }

        public override string ExplanationPart(StatRequest req)
        {
            var factor = FactorFor(PawnFor(req));
            return IsNeutral(factor)
                ? null
                : "Shion_StatPart_TailIntegrity".Translate(factor.ToStringPercent());
        }

        private static float FactorFor(Pawn pawn)
        {
            var extension = ShionUtility.RaceExtensionFor(pawn);
            if (extension == null || extension.foxTailPart == null)
            {
                return 1f;
            }

            return ShionUtility.HasNotMissingPart(pawn, extension.foxTailPart)
                ? 1f
                : extension.tailMoveFactor;
        }
    }

    public sealed class StatPart_ShionFluidReprocessing : StatPart_ShionBodyBase
    {
        public override void TransformValue(StatRequest req, ref float val)
        {
            val *= FactorFor(PawnFor(req));
        }

        public override string ExplanationPart(StatRequest req)
        {
            var factor = FactorFor(PawnFor(req));
            return IsNeutral(factor)
                ? null
                : "Shion_StatPart_FluidReprocessing".Translate(factor.ToStringPercent());
        }

        private static float FactorFor(Pawn pawn)
        {
            return ShionUtility.IsShion(pawn) &&
                pawn.health?.capacities != null &&
                ShionDefOf.Shion_FluidReprocessing != null
                ? pawn.health.capacities.GetLevel(ShionDefOf.Shion_FluidReprocessing)
                : 1f;
        }
    }

    public sealed class StatPart_ShionDrive : StatPart_ShionBodyBase
    {
        public override void TransformValue(StatRequest req, ref float val)
        {
            val *= FactorFor(PawnFor(req));
        }

        public override string ExplanationPart(StatRequest req)
        {
            var factor = FactorFor(PawnFor(req));
            return IsNeutral(factor)
                ? null
                : "Shion_StatPart_Drive".Translate(factor.ToStringPercent());
        }

        private static float FactorFor(Pawn pawn)
        {
            var extension = ShionUtility.RaceExtensionFor(pawn);
            if (extension?.driveWorkSpeedByMood == null || pawn.needs?.mood == null)
            {
                return 1f;
            }

            return extension.driveWorkSpeedByMood.Evaluate(pawn.needs.mood.CurLevelPercentage);
        }
    }
}
