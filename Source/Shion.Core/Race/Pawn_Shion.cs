using Verse;

namespace Shion.Core
{
    public sealed class Pawn_Shion : Pawn
    {
        private bool rejectAnomalyDuplicate;

        public override void Notify_DuplicatedFrom(Pawn source)
        {
            base.Notify_DuplicatedFrom(source);
            rejectAnomalyDuplicate = true;
        }

        public override void SpawnSetup(Map map, bool respawningAfterLoad)
        {
            base.SpawnSetup(map, respawningAfterLoad);

            if (rejectAnomalyDuplicate && !Destroyed)
            {
                Destroy(DestroyMode.Vanish);
            }
        }
    }
}
