using RimWorld;
using VEF.Graphics;
using Verse;

namespace Shion.Storage
{
    [DefOf]
    public static class ShionStorageDefOf
    {
        public static CustomOverlayDef Shion_EndpointOverlay;

        static ShionStorageDefOf()
        {
            DefOfHelper.EnsureInitializedInCtor(typeof(ShionStorageDefOf));
        }
    }
}
