using System.Collections.Generic;
using System.Linq;
using Verse;

namespace Shion.Kombinat
{
    public sealed class KombinatStageDef
    {
        public string label;
        public int workTicks = 600;
        public List<ThingDefCountClass> inputs = new List<ThingDefCountClass>();
        public List<ThingDefCountClass> outputs = new List<ThingDefCountClass>();
    }

    public sealed class KombinatPatternDef : Def
    {
        public int currencyCost = 10;
        public List<KombinatStageDef> stages = new List<KombinatStageDef>();

        public override IEnumerable<string> ConfigErrors()
        {
            foreach (string error in base.ConfigErrors())
            {
                yield return error;
            }

            if (stages == null || stages.Count == 0)
            {
                yield return defName + " must define at least one production stage.";
            }

            if (stages != null && stages.Any(stage => stage == null
                || stage.workTicks <= 0
                || stage.outputs == null
                || stage.outputs.Count == 0))
            {
                yield return defName + " contains an invalid production stage.";
            }
        }
    }
}

