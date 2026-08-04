using RimWorld;
using Verse;

namespace Shion.Core
{
    public sealed class ThoughtWorker_ShionMoreHumanThanHuman : ThoughtWorker
    {
        protected override ThoughtState CurrentStateInternal(Pawn pawn)
        {
            return ShionUtility.IsShion(pawn);
        }
    }

    public sealed class ThoughtWorker_ShionEnslaved : ThoughtWorker
    {
        protected override ThoughtState CurrentStateInternal(Pawn pawn)
        {
            return ShionUtility.IsShion(pawn) && pawn.IsSlave;
        }
    }
}
