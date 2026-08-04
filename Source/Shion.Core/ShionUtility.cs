using Verse;

namespace Shion.Core
{
    public static class ShionUtility
    {
        public static bool IsShion(Pawn pawn)
        {
            return pawn != null && pawn.def == ShionDefOf.Shion_Race;
        }

        public static ShionRaceExtension RaceExtensionFor(Pawn pawn)
        {
            return IsShion(pawn) ? pawn.def.GetModExtension<ShionRaceExtension>() : null;
        }

        public static bool HasNotMissingPart(Pawn pawn, BodyPartDef partDef)
        {
            if (pawn == null || partDef == null || pawn.health == null)
            {
                return false;
            }

            var parts = pawn.RaceProps.body.GetPartsWithDef(partDef);
            for (var index = 0; index < parts.Count; index++)
            {
                if (!pawn.health.hediffSet.PartIsMissing(parts[index]))
                {
                    return true;
                }
            }

            return false;
        }
    }
}

