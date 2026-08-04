using Verse;

namespace Shion.Core
{
    public sealed class ShionRaceExtension : DefModExtension
    {
        public BodyPartDef fluidReprocessorPart;
        public BodyPartDef foxEarPart;
        public BodyPartDef foxTailPart;
        public HediffDef cellLossHediff;
        public HediffDef fluidReprocessingOfflineHediff;
        public int healthCheckIntervalTicks = 60;
        public float restFloor = 0.02f;
        public float tailMoveFactor = 0.85f;
        public int requiredRecreationTypesOffset = 3;
        public SimpleCurve driveWorkSpeedByMood;
    }
}
