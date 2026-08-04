using System;
using System.Collections.Generic;
using System.Linq;
using Verse;

namespace Shion.Kombinat
{
    public sealed class KombinatFacilityProfileDef : Def
    {
        public int processIntervalTicks = 60;
        public float workSpeedFactor = 1f;
        public int minimumOrderAmount = 1;
        public int maximumOrderAmount = 10000;
        public int overviewQuickOrderCount = 4;
        public List<KombinatPatternDef> patterns = new List<KombinatPatternDef>();
        public KombinatMassProductionPolicyDef massProductionPolicy;

        public override IEnumerable<string> ConfigErrors()
        {
            foreach (string error in base.ConfigErrors())
            {
                yield return error;
            }

            if (processIntervalTicks <= 0)
            {
                yield return defName + " processIntervalTicks must be positive.";
            }

            if (workSpeedFactor <= 0f)
            {
                yield return defName + " workSpeedFactor must be positive.";
            }

            if (minimumOrderAmount <= 0 || maximumOrderAmount < minimumOrderAmount)
            {
                yield return defName + " order amount bounds are invalid.";
            }

            if (overviewQuickOrderCount < 0)
            {
                yield return defName + " overviewQuickOrderCount cannot be negative.";
            }

            if ((patterns == null || patterns.Count == 0) && massProductionPolicy == null)
            {
                yield return defName + " must reference a pattern or mass-production policy.";
            }

            if (patterns != null && patterns.Any(pattern => pattern == null))
            {
                yield return defName + " contains a null KombinatPatternDef.";
            }
        }
    }

    public sealed class KombinatLedgerDef : Def
    {
        public bool isDefault;
        public int openingBalance = 1000;

        public override IEnumerable<string> ConfigErrors()
        {
            foreach (string error in base.ConfigErrors())
            {
                yield return error;
            }

            if (openingBalance < 0)
            {
                yield return defName + " openingBalance cannot be negative.";
            }
        }
    }

    public static class KombinatDefResolver
    {
        public static KombinatLedgerDef Ledger
        {
            get
            {
                IReadOnlyList<KombinatLedgerDef> defs = DefDatabase<KombinatLedgerDef>.AllDefsListForReading;
                return defs.FirstOrDefault(def => def.isDefault) ?? defs.FirstOrDefault();
            }
        }

        public static int OpeningBalance => Math.Max(0, Ledger?.openingBalance ?? 0);
    }
}
