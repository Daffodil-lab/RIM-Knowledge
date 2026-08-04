using System;
using System.Collections.Generic;
using System.Linq;
using RimWorld;
using UnityEngine;
using Verse;

namespace Shion.Storage
{
    public sealed class Window_ShionStorage : Window
    {
        private readonly CompShionStorage storage;
        private Vector2 scrollPosition;
        private string searchText = string.Empty;
        private string ejectCountText = "1";

        public Window_ShionStorage(CompShionStorage storage)
        {
            this.storage = storage;
            doCloseX = true;
            doCloseButton = true;
            absorbInputAroundWindow = false;
            forcePause = false;
        }

        public override Vector2 InitialSize => new Vector2(720f, 560f);

        public override void DoWindowContents(Rect inRect)
        {
            Text.Font = GameFont.Medium;
            Widgets.Label(new Rect(inRect.x, inRect.y, inRect.width, 36f), "Shion_StorageTitle".Translate(storage.Label));
            Text.Font = GameFont.Small;

            Rect summary = new Rect(inRect.x, inRect.y + 40f, inRect.width, 28f);
            Widgets.Label(
                summary,
                "Shion_StorageSummary".Translate(storage.StoredCount, storage.Capacity, storage.EndpointId)
                    + "    "
                    + "Shion_EndpointState".Translate(storage.State.ToString()));

            Widgets.Label(new Rect(inRect.x, inRect.y + 72f, 72f, 28f), "Shion_Search".Translate());
            searchText = Widgets.TextField(new Rect(inRect.x + 76f, inRect.y + 70f, 260f, 28f), searchText);
            Widgets.Label(new Rect(inRect.x + 356f, inRect.y + 72f, 102f, 28f), "Shion_EjectCount".Translate());
            ejectCountText = Widgets.TextField(new Rect(inRect.x + 464f, inRect.y + 70f, 74f, 28f), ejectCountText);
            int requestedCount = int.TryParse(ejectCountText, out int parsedCount)
                ? Math.Max(1, parsedCount)
                : 1;

            List<Thing> visibleThings = storage.InnerContainer
                .Where(item => searchText.NullOrEmpty()
                    || item.LabelCap.IndexOf(searchText, StringComparison.OrdinalIgnoreCase) >= 0
                    || item.def.defName.IndexOf(searchText, StringComparison.OrdinalIgnoreCase) >= 0)
                .OrderBy(item => item.LabelCap)
                .ToList();

            Rect outRect = new Rect(inRect.x, inRect.y + 106f, inRect.width, inRect.height - 152f);
            float viewHeight = Mathf.Max(outRect.height, visibleThings.Count * 38f + 8f);
            Rect viewRect = new Rect(0f, 0f, outRect.width - 18f, viewHeight);

            Widgets.BeginScrollView(outRect, ref scrollPosition, viewRect);
            float y = 4f;
            foreach (Thing thing in visibleThings)
            {
                Rect row = new Rect(0f, y, viewRect.width, 34f);
                if (((int)(y / 38f) & 1) == 0)
                {
                    Widgets.DrawLightHighlight(row);
                }

                Widgets.ThingIcon(new Rect(row.x + 4f, row.y + 3f, 28f, 28f), thing);
                Widgets.Label(new Rect(row.x + 40f, row.y + 7f, row.width - 304f, 24f), thing.LabelCap + " × " + thing.stackCount);

                if (Widgets.ButtonText(new Rect(row.xMax - 252f, row.y + 3f, 76f, 28f), "Shion_EjectOne".Translate()))
                {
                    storage.TryEject(thing, 1, out _);
                    break;
                }

                if (Widgets.ButtonText(new Rect(row.xMax - 170f, row.y + 3f, 76f, 28f), "Shion_EjectSpecified".Translate()))
                {
                    storage.TryEject(thing, requestedCount, out _);
                    break;
                }

                if (Widgets.ButtonText(new Rect(row.xMax - 88f, row.y + 3f, 84f, 28f), "Shion_EjectStack".Translate()))
                {
                    storage.TryEject(thing, thing.stackCount, out _);
                    break;
                }

                y += 38f;
            }

            Widgets.EndScrollView();
        }
    }
}
