using System;
using System.Collections.Generic;
using System.Linq;
using Shion.Storage;
using UnityEngine;
using Verse;

namespace Shion.Kombinat
{
    public sealed class Window_KombinatTerminal : Window
    {
        private const float SidebarWidth = 210f;

        private readonly KombinatManagementContext context;
        private readonly List<KombinatManagementPageWorker> pages;
        private KombinatManagementPageWorker selectedPage;
        private Vector2 sidebarScroll;

        public Window_KombinatTerminal(
            CompKombinatFactory factory,
            CompShionStorage selectedStorage = null,
            Type initialPageWorker = null)
        {
            context = new KombinatManagementContext(factory, selectedStorage);
            pages = KombinatManagementUiCatalog.CreateWorkers();
            selectedPage = initialPageWorker == null
                ? pages.FirstOrDefault()
                : pages.FirstOrDefault(page => initialPageWorker.IsInstanceOfType(page)) ?? pages.FirstOrDefault();
            selectedPage?.OnOpen(context);
            doCloseX = true;
            doCloseButton = true;
            absorbInputAroundWindow = false;
            forcePause = false;
        }

        public override Vector2 InitialSize => new Vector2(1100f, 680f);

        public override void DoWindowContents(Rect inRect)
        {
            context.Refresh();
            Text.Font = GameFont.Medium;
            Widgets.Label(new Rect(inRect.x, inRect.y, inRect.width, 36f), "Shion_KombinatTitle".Translate());
            Text.Font = GameFont.Small;

            Rect sidebarRect = new Rect(inRect.x, inRect.y + 42f, SidebarWidth, inRect.height - 90f);
            Rect contentRect = new Rect(
                sidebarRect.xMax + 12f,
                sidebarRect.y,
                inRect.xMax - sidebarRect.xMax - 12f,
                sidebarRect.height);
            DrawSidebar(sidebarRect);

            Widgets.DrawMenuSection(contentRect);
            Rect inner = contentRect.ContractedBy(14f);
            if (selectedPage == null)
            {
                Widgets.Label(inner, "Shion_NoManagementPages".Translate());
                return;
            }

            Text.Font = GameFont.Medium;
            Widgets.Label(new Rect(inner.x, inner.y, inner.width, 34f), selectedPage.Def.LabelCap);
            Text.Font = GameFont.Small;
            if (!selectedPage.Def.description.NullOrEmpty())
            {
                Widgets.Label(new Rect(inner.x, inner.y + 36f, inner.width, 42f), selectedPage.Def.description);
            }

            selectedPage.Draw(new Rect(inner.x, inner.y + 82f, inner.width, inner.height - 82f), context);
        }

        public override void PostClose()
        {
            selectedPage?.OnClose(context);
            base.PostClose();
        }

        private void DrawSidebar(Rect rect)
        {
            Widgets.DrawMenuSection(rect);
            Rect viewRect = new Rect(0f, 0f, rect.width - 18f, Math.Max(rect.height, pages.Count * 48f + 8f));
            Widgets.BeginScrollView(rect.ContractedBy(4f), ref sidebarScroll, viewRect);
            float y = 4f;
            foreach (KombinatManagementPageWorker page in pages)
            {
                Rect buttonRect = new Rect(4f, y, viewRect.width - 8f, 42f);
                if (page == selectedPage)
                {
                    Widgets.DrawHighlightSelected(buttonRect);
                }

                if (Mouse.IsOver(buttonRect))
                {
                    Widgets.DrawHighlight(buttonRect);
                }

                if (Widgets.ButtonInvisible(buttonRect))
                {
                    selectedPage?.OnClose(context);
                    selectedPage = page;
                    selectedPage.OnOpen(context);
                }

                float labelX = buttonRect.x + 10f;
                if (page.Icon != null)
                {
                    Widgets.DrawTextureFitted(
                        new Rect(buttonRect.x + 6f, buttonRect.y + 6f, 30f, 30f),
                        page.Icon,
                        0.9f);
                    labelX = buttonRect.x + 42f;
                }

                Text.Anchor = TextAnchor.MiddleLeft;
                Widgets.Label(
                    new Rect(labelX, buttonRect.y, buttonRect.xMax - labelX - 6f, buttonRect.height),
                    page.Def.LabelCap);
                Text.Anchor = TextAnchor.UpperLeft;
                y += 48f;
            }

            Widgets.EndScrollView();
        }
    }

    public sealed class KombinatManagementContext
    {
        public KombinatManagementContext(CompKombinatFactory factory, CompShionStorage selectedStorage)
        {
            Factory = factory;
            SelectedStorage = selectedStorage;
            Refresh();
        }

        public CompKombinatFactory Factory { get; }
        public CompShionStorage SelectedStorage { get; }
        public KombinatFacilityProfileDef EffectiveProfile =>
            Factory?.Profile
            ?? DefDatabase<KombinatFacilityProfileDef>.AllDefsListForReading
                .OrderBy(def => def.defName)
                .FirstOrDefault();
        public Map Map { get; private set; }
        public WorldComponent_KombinatLedger Ledger { get; private set; }
        public MapComponent_ShionEndpointRegistry Storage { get; private set; }

        public void Refresh()
        {
            Map = Factory?.parent?.MapHeld ?? SelectedStorage?.parent?.MapHeld ?? Find.CurrentMap;
            Ledger = KombinatServices.Ledger;
            Storage = StorageServices.For(Map);
        }
    }

    public abstract class KombinatManagementPageWorker
    {
        public KombinatManagementPageDef Def { get; private set; }
        public Texture2D Icon { get; private set; }

        internal void Initialize(KombinatManagementPageDef def)
        {
            Def = def;
            Icon = def.iconPath.NullOrEmpty()
                ? null
                : ContentFinder<Texture2D>.Get(def.iconPath, false);
        }

        public virtual void OnOpen(KombinatManagementContext context)
        {
        }

        public virtual void OnClose(KombinatManagementContext context)
        {
        }

        public abstract void Draw(Rect rect, KombinatManagementContext context);
    }

    public static class KombinatManagementUiCatalog
    {
        public static List<KombinatManagementPageWorker> CreateWorkers()
        {
            List<KombinatManagementPageWorker> workers = new List<KombinatManagementPageWorker>();
            foreach (KombinatManagementPageDef def in DefDatabase<KombinatManagementPageDef>.AllDefsListForReading
                .Where(page => page.visible)
                .OrderBy(page => page.order)
                .ThenBy(page => page.defName))
            {
                try
                {
                    KombinatManagementPageWorker worker =
                        (KombinatManagementPageWorker)Activator.CreateInstance(def.workerClass);
                    worker.Initialize(def);
                    workers.Add(worker);
                }
                catch (Exception exception)
                {
                    Log.Error("[Shion.Kombinat] Could not create management page " + def.defName + ": " + exception);
                }
            }

            return workers;
        }
    }
}
