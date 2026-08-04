using System;
using System.Collections.Generic;
using System.Linq;
using RimWorld;
using Verse;

namespace Shion.Kombinat
{
    public sealed class KombinatMassProductionPolicyDef : Def
    {
        public List<string> allowedPackageIds = new List<string>();
        public List<TechLevel> excludedTechLevels = new List<TechLevel>();
        public List<ThingDef> excludedProducts = new List<ThingDef>();
        public List<RecipeDef> excludedRecipes = new List<RecipeDef>();
        public bool requirePlayerAcquirable = true;
        public bool requireItemCategory = true;
        public bool requireRecipeUsers = true;
        public bool requireIngredients = true;
        public bool requireDefaultRecipeWorker = true;
        public bool requireContextFreeRecipe = true;
        public bool requireResearchFinished = true;
        public bool excludeSpecialProducts = true;
        public bool excludeArtProducts = true;
        public QualityCategory outputQuality = QualityCategory.Normal;
        public float workTicksFactor = 1f;
        public int minimumWorkTicks = 60;
        public int currencyCostPerThousandWork = 1;
        public int minimumCurrencyCost = 1;

        public bool AllowsPackage(ModContentPack content)
        {
            if (content == null || allowedPackageIds == null || allowedPackageIds.Count == 0)
            {
                return false;
            }

            string packageId = content.PackageIdPlayerFacing ?? content.PackageId;
            return allowedPackageIds.Any(
                allowed => string.Equals(allowed, packageId, StringComparison.OrdinalIgnoreCase));
        }

        public override IEnumerable<string> ConfigErrors()
        {
            foreach (string error in base.ConfigErrors())
            {
                yield return error;
            }

            if (allowedPackageIds == null
                || allowedPackageIds.Count == 0
                || allowedPackageIds.Any(id => id.NullOrEmpty()))
            {
                yield return defName + " must declare at least one allowed package ID.";
            }

            if (workTicksFactor <= 0f || minimumWorkTicks <= 0)
            {
                yield return defName + " work timing values must be positive.";
            }

            if (currencyCostPerThousandWork < 0 || minimumCurrencyCost < 0)
            {
                yield return defName + " currency cost values cannot be negative.";
            }
        }
    }
}
