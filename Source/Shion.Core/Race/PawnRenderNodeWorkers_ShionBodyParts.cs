using Verse;

namespace Shion.Core
{
    public sealed class PawnRenderNodeWorker_ShionFoxEars : PawnRenderNodeWorker_FlipWhenCrawling
    {
        public override bool CanDrawNow(PawnRenderNode node, PawnDrawParms parms)
        {
            var extension = ShionUtility.RaceExtensionFor(parms.pawn);
            return base.CanDrawNow(node, parms) &&
                (extension == null ||
                    ShionUtility.HasNotMissingPart(parms.pawn, extension.foxEarPart));
        }
    }

    public sealed class PawnRenderNodeWorker_ShionFoxTail : PawnRenderNodeWorker_AttachmentBody
    {
        public override bool CanDrawNow(PawnRenderNode node, PawnDrawParms parms)
        {
            var extension = ShionUtility.RaceExtensionFor(parms.pawn);
            return base.CanDrawNow(node, parms) &&
                (extension == null ||
                    ShionUtility.HasNotMissingPart(parms.pawn, extension.foxTailPart));
        }
    }
}
