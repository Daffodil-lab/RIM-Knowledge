using RimWorld;
using Verse;

namespace Shion.Core
{
    [DefOf]
    public static class ShionDefOf
    {
        public static ThingDef Shion_Race;
        public static BodyDef Shion_StandardBody;
        public static BodyPartDef Shion_FluidReprocessor;
        public static BodyPartDef Shion_FoxEar;
        public static BodyPartDef Shion_FoxTail;
        public static HediffDef Shion_CellLoss;
        public static HediffDef Shion_FluidReprocessingOffline;
        public static PawnCapacityDef Shion_FluidReprocessing;
        public static GeneDef Shion_ClockworkBody;
        public static XenotypeDef Shion_Xenotype;
        public static ThingDef Shion_Cell;
        public static ThingDef Shion_EnergyCrystal;
        public static ThingDef Shion_StructuralMaterial;
        public static ThingDef Shion_MaintenanceMaterial;
        public static ThingDef Shion_AmmunitionCrystal;

        static ShionDefOf()
        {
            DefOfHelper.EnsureInitializedInCtor(typeof(ShionDefOf));
        }
    }
}

