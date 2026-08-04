using Verse;

namespace Shion.Core
{
    public sealed class ShionMod : Mod
    {
        public ShionMod(ModContentPack content) : base(content)
        {
        }
    }

    [StaticConstructorOnStartup]
    internal static class ShionBootstrap
    {
        static ShionBootstrap()
        {
            Log.Message("[Shion] Core alpha initialized with the vanilla race renderer, Biotech genes, and VEF visual projections.");
        }
    }
}
