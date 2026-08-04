using System.Collections.Generic;
using UnityEngine;
using Verse;

namespace Shion.Kombinat
{
    public sealed class CompProperties_KombinatTerminal : CompProperties
    {
        public CompProperties_KombinatTerminal()
        {
            compClass = typeof(CompKombinatTerminal);
        }
    }

    public sealed class CompKombinatTerminal : ThingComp
    {
        public override IEnumerable<Gizmo> CompGetGizmosExtra()
        {
            foreach (Gizmo gizmo in base.CompGetGizmosExtra())
            {
                yield return gizmo;
            }

            yield return new Command_Action
            {
                defaultLabel = "Shion_OpenKombinat".Translate(),
                defaultDesc = "Shion_OpenKombinatDesc".Translate(),
                icon = ContentFinder<Texture2D>.Get("UI/Commands/ShionKombinat", false),
                action = () => Find.WindowStack.Add(new Window_KombinatTerminal(null))
            };
        }
    }
}
