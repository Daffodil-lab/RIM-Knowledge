using System;
using System.Collections.Generic;
using System.Linq;
using RimWorld;
using Verse;

namespace Shion.Core.Scenario
{
    public sealed class ScenPart_EnsureShionExpeditionSkills : ScenPart
    {
        public override void PostGameStart()
        {
            base.PostGameStart();

            List<Pawn> shion = PawnsFinder.AllMaps_FreeColonistsSpawned
                .Where(ShionUtility.IsShion)
                .Take(3)
                .ToList();

            if (shion.Count < 3)
            {
                Log.Warning("[Shion] Independent Expedition started without three spawned Shion; skill guarantees were applied to the available Shion only.");
            }

            EnsurePair(shion, 0, SkillDefOf.Construction, 8, SkillDefOf.Crafting, 8);
            EnsurePair(shion, 1, SkillDefOf.Medicine, 8, SkillDefOf.Plants, 6);
            EnsurePair(shion, 2, SkillDefOf.Intellectual, 8, SkillDefOf.Social, 8);
        }

        private static void EnsurePair(
            IReadOnlyList<Pawn> pawns,
            int index,
            SkillDef first,
            int firstLevel,
            SkillDef second,
            int secondLevel)
        {
            if (index >= pawns.Count)
            {
                return;
            }

            EnsureSkill(pawns[index], first, firstLevel);
            EnsureSkill(pawns[index], second, secondLevel);
        }

        private static void EnsureSkill(Pawn pawn, SkillDef skillDef, int level)
        {
            SkillRecord skill = pawn.skills?.GetSkill(skillDef);
            if (skill == null)
            {
                return;
            }

            skill.Level = Math.Max(skill.Level, level);
            if (skill.passion == Passion.None)
            {
                skill.passion = Passion.Minor;
            }
        }
    }
}
