using System;
using System.Collections.Generic;
using System.Linq;
using RimWorld;
using Shion.Storage;
using UnityEngine;
using Verse;

namespace Shion.Kombinat
{
    public sealed class KombinatResolvedStage
    {
        public bool Succeeded;
        public string FailureReasonKey;
        public int WorkTicks;
        public IReadOnlyList<StorageDefCount> Inputs;
        public IReadOnlyList<StorageProductSpec> Outputs;
    }

    public sealed class KombinatProductionPattern
    {
        private readonly KombinatPatternDef explicitDef;
        private readonly RecipeDef recipe;
        private readonly KombinatMassProductionPolicyDef policy;

        internal KombinatProductionPattern(KombinatPatternDef definition)
        {
            explicitDef = definition;
            Id = definition.defName;
            Label = definition.LabelCap;
            Description = definition.description;
            CurrencyCost = Math.Max(0, definition.currencyCost);
            StageCount = definition.stages?.Count ?? 0;
            PrimaryProduct = definition.stages?
                .SelectMany(stage => stage.outputs ?? new List<ThingDefCountClass>())
                .LastOrDefault()?.thingDef;
            SourceLabel = "Shion_KombinatNativePattern".Translate();
            IngredientSummary = definition.stages == null
                ? string.Empty
                : string.Join(
                    " → ",
                    definition.stages.Select(stage => string.Join(
                        ", ",
                        (stage.inputs ?? new List<ThingDefCountClass>())
                            .Select(item => item.thingDef.LabelCap + " x" + item.count))));
        }

        internal KombinatProductionPattern(
            RecipeDef sourceRecipe,
            KombinatMassProductionPolicyDef sourcePolicy)
        {
            recipe = sourceRecipe;
            policy = sourcePolicy;
            Id = KombinatProductionCatalog.BuildRecipeId(sourcePolicy, sourceRecipe);
            Label = sourceRecipe.LabelCap;
            Description = sourceRecipe.description;
            StageCount = 1;
            PrimaryProduct = sourceRecipe.ProducedThingDef ?? sourceRecipe.products?.FirstOrDefault()?.thingDef;
            SourceLabel = PrimaryProduct?.modContentPack?.Name ?? sourceRecipe.modContentPack?.Name ?? string.Empty;
            IngredientSummary = string.Join(
                ", ",
                (sourceRecipe.ingredients ?? new List<IngredientCount>())
                    .Select(ingredient => ingredient.SummaryFor(sourceRecipe)));
            int workTicks = WorkTicks;
            CurrencyCost = Math.Max(
                sourcePolicy.minimumCurrencyCost,
                Mathf.CeilToInt(workTicks / 1000f * sourcePolicy.currencyCostPerThousandWork));
        }

        public string Id { get; }
        public TaggedString Label { get; }
        public string Description { get; }
        public int CurrencyCost { get; }
        public int StageCount { get; }
        public ThingDef PrimaryProduct { get; }
        public string SourceLabel { get; }
        public string IngredientSummary { get; }
        public RecipeDef SourceRecipe => recipe;
        public KombinatPatternDef ExplicitDef => explicitDef;
        public KombinatMassProductionPolicyDef Policy => policy;
        public bool IsOfficialRecipe => recipe != null;
        public bool AvailableNow => recipe == null || policy == null || !policy.requireResearchFinished || recipe.AvailableNow;

        public int WorkTicks
        {
            get
            {
                if (recipe == null || policy == null)
                {
                    return 0;
                }

                return Math.Max(
                    policy.minimumWorkTicks,
                    Mathf.RoundToInt(Math.Max(1f, recipe.workAmount) * policy.workTicksFactor));
            }
        }

        public bool TryResolveStage(
            int stageIndex,
            MapComponent_ShionEndpointRegistry storage,
            out KombinatResolvedStage resolved)
        {
            if (explicitDef != null)
            {
                if (stageIndex < 0 || stageIndex >= (explicitDef.stages?.Count ?? 0))
                {
                    resolved = Failure("Shion_StatusPatternMissing");
                    return false;
                }

                KombinatStageDef stage = explicitDef.stages[stageIndex];
                resolved = new KombinatResolvedStage
                {
                    Succeeded = true,
                    WorkTicks = Math.Max(1, stage.workTicks),
                    Inputs = (stage.inputs ?? new List<ThingDefCountClass>())
                        .Select(item => new StorageDefCount(item.thingDef, item.count))
                        .ToList(),
                    Outputs = (stage.outputs ?? new List<ThingDefCountClass>())
                        .Select(item => new StorageProductSpec(item.thingDef, item.count))
                        .ToList()
                };
                return true;
            }

            if (recipe == null || policy == null || stageIndex != 0)
            {
                resolved = Failure("Shion_StatusPatternMissing");
                return false;
            }

            if (!AvailableNow)
            {
                resolved = Failure("Shion_StatusResearchLocked");
                return false;
            }

            return TryResolveRecipe(storage, out resolved);
        }

        private bool TryResolveRecipe(
            MapComponent_ShionEndpointRegistry storage,
            out KombinatResolvedStage resolved)
        {
            if (storage == null)
            {
                resolved = Failure("Shion_StatusMaterialWaiting");
                return false;
            }

            Dictionary<ThingDef, int> remaining = storage.GetEndpoints()
                .SelectMany(endpoint => endpoint.Items)
                .Where(item => item?.Def != null && item.StackCount > item.ReservedCount)
                .GroupBy(item => item.Def)
                .ToDictionary(
                    group => group.Key,
                    group => group.Sum(item => Math.Max(0, item.StackCount - item.ReservedCount)));
            List<StorageDefCount> selected = new List<StorageDefCount>();

            foreach (IngredientCount ingredient in recipe.ingredients ?? new List<IngredientCount>())
            {
                if (!TrySelectIngredient(ingredient, remaining, selected))
                {
                    resolved = Failure("Shion_StatusMaterialWaiting");
                    return false;
                }
            }

            ThingDef ingredientStuff = selected
                .Select(item => item.Def)
                .FirstOrDefault(def => recipe.products.Any(
                    product => product.thingDef.MadeFromStuff
                        && def?.stuffProps?.CanMake(product.thingDef) == true));
            List<StorageProductSpec> outputs = new List<StorageProductSpec>();
            foreach (ThingDefCountClass product in recipe.products)
            {
                ThingDef stuff = null;
                if (product.thingDef.MadeFromStuff)
                {
                    stuff = ingredientStuff;
                    if (stuff == null)
                    {
                        resolved = Failure("Shion_StatusMaterialWaiting");
                        return false;
                    }
                }

                outputs.Add(new StorageProductSpec(
                    product.thingDef,
                    product.count,
                    stuff,
                    policy.outputQuality));
            }

            resolved = new KombinatResolvedStage
            {
                Succeeded = true,
                WorkTicks = WorkTicks,
                Inputs = selected
                    .GroupBy(item => item.Def)
                    .Select(group => new StorageDefCount(group.Key, group.Sum(item => item.Count)))
                    .ToList(),
                Outputs = outputs
            };
            return true;
        }

        private bool TrySelectIngredient(
            IngredientCount ingredient,
            Dictionary<ThingDef, int> remaining,
            List<StorageDefCount> selected)
        {
            float requiredValue = Math.Max(0f, ingredient.CountFor(recipe));
            if (requiredValue <= 0f)
            {
                return true;
            }

            List<ThingDef> candidates = remaining
                .Where(pair => pair.Value > 0
                    && policy.AllowsPackage(pair.Key.modContentPack)
                    && ingredient.filter.Allows(pair.Key)
                    && RecipeAllows(pair.Key))
                .OrderByDescending(pair => pair.Value * ValuePerUnit(pair.Key))
                .ThenBy(pair => pair.Key.defName)
                .Select(pair => pair.Key)
                .ToList();

            if (!recipe.allowMixingIngredients)
            {
                ThingDef chosen = candidates.FirstOrDefault(def =>
                    remaining[def] * ValuePerUnit(def) + 0.0001f >= requiredValue);
                if (chosen == null)
                {
                    return false;
                }

                int count = Mathf.CeilToInt(requiredValue / ValuePerUnit(chosen));
                selected.Add(new StorageDefCount(chosen, count));
                remaining[chosen] -= count;
                return true;
            }

            foreach (ThingDef candidate in candidates)
            {
                float valuePerUnit = ValuePerUnit(candidate);
                if (valuePerUnit <= 0f)
                {
                    continue;
                }

                int count = Math.Min(
                    remaining[candidate],
                    Mathf.CeilToInt(requiredValue / valuePerUnit));
                if (count <= 0)
                {
                    continue;
                }

                selected.Add(new StorageDefCount(candidate, count));
                remaining[candidate] -= count;
                requiredValue -= count * valuePerUnit;
                if (requiredValue <= 0.0001f)
                {
                    return true;
                }
            }

            return false;
        }

        private bool RecipeAllows(ThingDef def)
        {
            bool hasFixed = recipe.fixedIngredientFilter?.AllowedDefCount > 0;
            bool hasDefault = recipe.defaultIngredientFilter?.AllowedDefCount > 0;
            return (!hasFixed && !hasDefault)
                || (hasFixed && recipe.fixedIngredientFilter.Allows(def))
                || (hasDefault && recipe.defaultIngredientFilter.Allows(def));
        }

        private float ValuePerUnit(ThingDef def)
        {
            return Math.Max(0f, recipe.IngredientValueGetter.ValuePerUnitOf(def));
        }

        private static KombinatResolvedStage Failure(string reason)
        {
            return new KombinatResolvedStage
            {
                Succeeded = false,
                FailureReasonKey = reason,
                Inputs = new List<StorageDefCount>(),
                Outputs = new List<StorageProductSpec>()
            };
        }
    }

    public static class KombinatProductionCatalog
    {
        private const string RecipePrefix = "official-recipe:";
        private static readonly Dictionary<string, IReadOnlyList<KombinatProductionPattern>> policyCache =
            new Dictionary<string, IReadOnlyList<KombinatProductionPattern>>();

        public static IReadOnlyList<KombinatProductionPattern> ForProfile(KombinatFacilityProfileDef profile)
        {
            List<KombinatProductionPattern> result = (profile?.patterns ?? new List<KombinatPatternDef>())
                .Where(def => def != null)
                .Select(def => new KombinatProductionPattern(def))
                .ToList();
            if (profile?.massProductionPolicy != null)
            {
                result.AddRange(ForPolicy(profile.massProductionPolicy));
            }

            return result
                .GroupBy(pattern => pattern.Id)
                .Select(group => group.First())
                .OrderBy(
                    pattern => pattern.Label.ToString(),
                    StringComparer.CurrentCultureIgnoreCase)
                .ThenBy(pattern => pattern.Id)
                .ToList();
        }

        public static IReadOnlyList<KombinatProductionPattern> ForPolicy(
            KombinatMassProductionPolicyDef policy)
        {
            if (policy == null)
            {
                return new List<KombinatProductionPattern>();
            }

            if (policyCache.TryGetValue(policy.defName, out IReadOnlyList<KombinatProductionPattern> cached))
            {
                return cached;
            }

            cached = DefDatabase<RecipeDef>.AllDefsListForReading
                .Where(recipe => IsEligible(recipe, policy))
                .Select(recipe => new KombinatProductionPattern(recipe, policy))
                .OrderBy(
                    pattern => pattern.Label.ToString(),
                    StringComparer.CurrentCultureIgnoreCase)
                .ThenBy(pattern => pattern.Id)
                .ToList();
            policyCache[policy.defName] = cached;
            return cached;
        }

        public static KombinatProductionPattern Resolve(string patternId)
        {
            if (patternId.NullOrEmpty())
            {
                return null;
            }

            KombinatPatternDef explicitDef =
                DefDatabase<KombinatPatternDef>.GetNamedSilentFail(patternId);
            if (explicitDef != null)
            {
                return new KombinatProductionPattern(explicitDef);
            }

            if (!TryParseRecipeId(patternId, out string policyName, out string recipeName))
            {
                return null;
            }

            KombinatMassProductionPolicyDef policy =
                DefDatabase<KombinatMassProductionPolicyDef>.GetNamedSilentFail(policyName);
            RecipeDef recipe = DefDatabase<RecipeDef>.GetNamedSilentFail(recipeName);
            return IsEligible(recipe, policy)
                ? new KombinatProductionPattern(recipe, policy)
                : null;
        }

        public static bool Supports(
            KombinatFacilityProfileDef profile,
            KombinatProductionPattern pattern)
        {
            if (profile == null || pattern == null)
            {
                return false;
            }

            if (pattern.ExplicitDef != null)
            {
                return profile.patterns?.Contains(pattern.ExplicitDef) == true;
            }

            return pattern.Policy != null && pattern.Policy == profile.massProductionPolicy;
        }

        internal static string BuildRecipeId(
            KombinatMassProductionPolicyDef policy,
            RecipeDef recipe)
        {
            return RecipePrefix + policy.defName + ":" + recipe.defName;
        }

        private static bool TryParseRecipeId(
            string patternId,
            out string policyName,
            out string recipeName)
        {
            policyName = null;
            recipeName = null;
            if (!patternId.StartsWith(RecipePrefix, StringComparison.Ordinal))
            {
                return false;
            }

            string value = patternId.Substring(RecipePrefix.Length);
            int separator = value.IndexOf(':');
            if (separator <= 0 || separator >= value.Length - 1)
            {
                return false;
            }

            policyName = value.Substring(0, separator);
            recipeName = value.Substring(separator + 1);
            return true;
        }

        private static bool IsEligible(
            RecipeDef recipe,
            KombinatMassProductionPolicyDef policy)
        {
            if (recipe == null
                || policy == null
                || !policy.AllowsPackage(recipe.modContentPack)
                || policy.excludedRecipes?.Contains(recipe) == true
                || recipe.products == null
                || recipe.products.Count == 0)
            {
                return false;
            }

            if (policy.requireRecipeUsers && !recipe.AllRecipeUsers.Any())
            {
                return false;
            }

            if (policy.requireIngredients
                && (recipe.ingredients == null || recipe.ingredients.Count == 0))
            {
                return false;
            }

            if (policy.excludeSpecialProducts
                && recipe.specialProducts != null
                && recipe.specialProducts.Count > 0)
            {
                return false;
            }

            if (policy.requireDefaultRecipeWorker
                && recipe.workerClass != null
                && recipe.workerClass != typeof(RecipeWorker))
            {
                return false;
            }

            if (policy.requireContextFreeRecipe && HasSpecialContext(recipe))
            {
                return false;
            }

            foreach (ThingDefCountClass product in recipe.products)
            {
                ThingDef def = product?.thingDef;
                if (def == null
                    || product.count <= 0
                    || !policy.AllowsPackage(def.modContentPack)
                    || policy.excludedProducts?.Contains(def) == true
                    || policy.excludedTechLevels?.Contains(def.techLevel) == true
                    || (policy.requirePlayerAcquirable && !def.PlayerAcquirable)
                    || (policy.requireItemCategory && def.category != ThingCategory.Item)
                    || (policy.excludeArtProducts
                        && def.comps?.Any(comp => comp.compClass == typeof(CompArt)) == true)
                    || def.requiresFactionToAcquire != null)
                {
                    return false;
                }
            }

            return true;
        }

        private static bool HasSpecialContext(RecipeDef recipe)
        {
            return recipe.IsSurgery
                || recipe.addsHediff != null
                || recipe.addsHediffOnFailure != null
                || recipe.removesHediff != null
                || recipe.changesHediffLevel != null
                || recipe.mechanitorOnlyRecipe
                || recipe.fromIdeoBuildingPreceptOnly
                || recipe.genderPrerequisite.HasValue
                || recipe.developmentalStageFilter.HasValue
                || recipe.factionPrerequisiteTags?.Count > 0
                || recipe.memePrerequisitesAny?.Count > 0
                || recipe.mutantPrerequisite?.Count > 0
                || recipe.mutantBlacklist?.Count > 0;
        }
    }
}
