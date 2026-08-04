using System;
using System.Collections.Generic;
using Verse;

namespace Shion.Kombinat
{
    public sealed class KombinatManagementPageDef : Def
    {
        public Type workerClass;
        public int order;
        public string iconPath;
        public bool visible = true;

        public override IEnumerable<string> ConfigErrors()
        {
            foreach (string error in base.ConfigErrors())
            {
                yield return error;
            }

            if (workerClass == null || !typeof(KombinatManagementPageWorker).IsAssignableFrom(workerClass))
            {
                yield return defName + " workerClass must derive from KombinatManagementPageWorker.";
            }
        }
    }
}
