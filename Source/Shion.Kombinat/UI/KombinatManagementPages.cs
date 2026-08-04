using System;
using System.Collections.Generic;
using System.Linq;
using Shion.Storage;
using UnityEngine;
using Verse;

namespace Shion.Kombinat
{
    public sealed class KombinatOverviewPageWorker : KombinatManagementPageWorker
    {
        public override void Draw(Rect rect, KombinatManagementContext context)
        {
            WorldComponent_KombinatLedger ledger = context.Ledger;
            if (ledger == null)
            {
                Widgets.Label(rect, "Shion_LedgerUnavailable".Translate());
                return;
            }

            int stored = context.Storage?.Endpoints.Sum(endpoint => endpoint.StoredCount) ?? 0;
            int capacity = context.Storage?.Endpoints.Sum(endpoint => endpoint.Capacity) ?? 0;
            int reservedOutput = context.Storage?.Endpoints.Sum(
                endpoint => context.Storage.GetReservedOutputCount(endpoint.EndpointId)) ?? 0;

            Widgets.Label(
                new Rect(rect.x, rect.y, rect.width, 28f),
                "Shion_AccountSummary".Translate(ledger.Balance, ledger.Reserved, ledger.Available));
            Widgets.Label(
                new Rect(rect.x, rect.y + 30f, rect.width, 28f),
                "Shion_NetworkSummary".Translate(stored, capacity, reservedOutput));
            Widgets.Label(
                new Rect(rect.x, rect.y + 60f, rect.width, 28f),
                "Shion_RuntimeSummary".Translate(ledger.Plans.Count, ledger.Jobs.Count, ledger.Batches.Count)
                    + "    "
                    + "Shion_TransactionSummary".Translate(ledger.Transactions.Count));

            IReadOnlyList<KombinatProductionPattern> patterns =
                KombinatProductionCatalog.ForProfile(context.EffectiveProfile);
            Widgets.Label(
                new Rect(rect.x, rect.y + 104f, rect.width, 28f),
                "Shion_ProductionCatalogSummary".Translate(
                    patterns.Count,
                    patterns.Count(pattern => pattern.AvailableNow)));
            float x = rect.x;
            float y = rect.y + 136f;
            foreach (KombinatProductionPattern pattern in patterns
                .Where(item => item.AvailableNow)
                .Take(Math.Max(0, context.EffectiveProfile?.overviewQuickOrderCount ?? 0)))
            {
                float width = Math.Min(260f, rect.xMax - x);
                if (Widgets.ButtonText(new Rect(x, y, width, 34f), pattern.Label))
                {
                    ledger.CreateRequest(
                        pattern.Id,
                        context.EffectiveProfile.minimumOrderAmount,
                        context.Factory?.parent?.ThingID);
                }

                x += width + 8f;
                if (x + 180f > rect.xMax)
                {
                    x = rect.x;
                    y += 42f;
                }
            }
        }
    }

    public sealed class KombinatInventoryPageWorker : KombinatManagementPageWorker
    {
        private Vector2 scrollPosition;

        public override void Draw(Rect rect, KombinatManagementContext context)
        {
            if (context.SelectedStorage != null)
            {
                if (Widgets.ButtonText(
                    new Rect(rect.x, rect.y, 260f, 34f),
                    "Shion_OpenStorageDetails".Translate()))
                {
                    Find.WindowStack.Add(new Window_ShionStorage(context.SelectedStorage));
                }

                rect.yMin += 42f;
            }

            IReadOnlyList<StorageEndpointView> endpoints = context.Storage?.GetEndpoints()
                ?? new List<StorageEndpointView>();
            if (endpoints.Count == 0)
            {
                Widgets.Label(rect, "Shion_NoStorageEndpoints".Translate());
                return;
            }

            Rect outRect = rect;
            Rect viewRect = new Rect(0f, 0f, rect.width - 18f, Math.Max(rect.height, endpoints.Count * 68f + 8f));
            Widgets.BeginScrollView(outRect, ref scrollPosition, viewRect);
            float y = 4f;
            foreach (StorageEndpointView endpoint in endpoints)
            {
                Rect row = new Rect(0f, y, viewRect.width, 62f);
                Widgets.DrawMenuSection(row);
                Widgets.Label(
                    new Rect(row.x + 8f, row.y + 6f, row.width - 16f, 24f),
                    endpoint.Label + "    [" + endpoint.State + "]");
                int reservedInput = endpoint.Items.Sum(item => item.ReservedCount);
                Widgets.Label(
                    new Rect(row.x + 8f, row.y + 32f, row.width - 16f, 24f),
                    "Shion_EndpointReservationSummary".Translate(
                        endpoint.StoredCount,
                        endpoint.Capacity,
                        reservedInput,
                        endpoint.ReservedOutputCount));
                y += 68f;
            }

            Widgets.EndScrollView();
        }
    }

    public sealed class KombinatProductionPageWorker : KombinatManagementPageWorker
    {
        private const float CatalogRowHeight = 62f;
        private const float RequestRowHeight = 72f;

        private Vector2 catalogScrollPosition;
        private Vector2 requestScrollPosition;
        private string searchText = string.Empty;
        private string cachedSearchText;
        private string cachedProfileName;
        private string amountBuffer = "1";
        private int orderAmount = 1;
        private IReadOnlyList<KombinatProductionPattern> catalog =
            new List<KombinatProductionPattern>();
        private List<KombinatProductionPattern> filteredCatalog =
            new List<KombinatProductionPattern>();

        public override void Draw(Rect rect, KombinatManagementContext context)
        {
            WorldComponent_KombinatLedger ledger = context.Ledger;
            if (ledger == null)
            {
                Widgets.Label(rect, "Shion_LedgerUnavailable".Translate());
                return;
            }

            RefreshCatalog(context);
            float gap = 12f;
            float leftWidth = Mathf.Floor((rect.width - gap) * 0.52f);
            Rect catalogRect = new Rect(rect.x, rect.y, leftWidth, rect.height);
            Rect requestsRect = new Rect(catalogRect.xMax + gap, rect.y, rect.xMax - catalogRect.xMax - gap, rect.height);
            DrawCatalog(catalogRect, ledger, context);
            DrawRequests(requestsRect, ledger);
        }

        private void DrawCatalog(
            Rect rect,
            WorldComponent_KombinatLedger ledger,
            KombinatManagementContext context)
        {
            Widgets.DrawMenuSection(rect);
            Rect inner = rect.ContractedBy(8f);
            Widgets.Label(
                new Rect(inner.x, inner.y, inner.width, 26f),
                "Shion_ProductionCatalogTitle".Translate(filteredCatalog.Count, catalog.Count));

            searchText = Widgets.TextField(
                new Rect(inner.x, inner.y + 30f, inner.width - 118f, 30f),
                searchText ?? string.Empty);
            int minimumOrderAmount = Math.Max(
                1,
                context.EffectiveProfile?.minimumOrderAmount ?? 1);
            int maximumOrderAmount = Math.Max(
                minimumOrderAmount,
                context.EffectiveProfile?.maximumOrderAmount ?? minimumOrderAmount);
            Widgets.TextFieldNumeric(
                new Rect(inner.xMax - 110f, inner.y + 30f, 110f, 30f),
                ref orderAmount,
                ref amountBuffer,
                minimumOrderAmount,
                maximumOrderAmount);
            TooltipHandler.TipRegion(
                new Rect(inner.xMax - 110f, inner.y + 30f, 110f, 30f),
                "Shion_OrderAmount".Translate(minimumOrderAmount, maximumOrderAmount));

            if (!string.Equals(searchText, cachedSearchText, StringComparison.Ordinal))
            {
                ApplySearch();
            }

            Rect outRect = new Rect(inner.x, inner.y + 68f, inner.width, inner.height - 68f);
            Rect viewRect = new Rect(
                0f,
                0f,
                outRect.width - 18f,
                Math.Max(outRect.height, filteredCatalog.Count * CatalogRowHeight + 4f));
            Widgets.BeginScrollView(outRect, ref catalogScrollPosition, viewRect);
            int first = Math.Max(0, Mathf.FloorToInt(catalogScrollPosition.y / CatalogRowHeight) - 1);
            int visible = Mathf.CeilToInt(outRect.height / CatalogRowHeight) + 3;
            int last = Math.Min(filteredCatalog.Count, first + visible);
            for (int index = first; index < last; index++)
            {
                KombinatProductionPattern pattern = filteredCatalog[index];
                Rect row = new Rect(0f, index * CatalogRowHeight, viewRect.width, CatalogRowHeight - 4f);
                Widgets.DrawHighlightIfMouseover(row);
                if (pattern.PrimaryProduct != null)
                {
                    Widgets.ThingIcon(
                        new Rect(row.x + 4f, row.y + 7f, 42f, 42f),
                        pattern.PrimaryProduct);
                }

                float textX = row.x + 52f;
                Widgets.Label(
                    new Rect(textX, row.y + 4f, row.width - textX - 88f, 24f),
                    pattern.Label);
                string detail = "Shion_CatalogPatternDetail".Translate(
                    pattern.SourceLabel,
                    pattern.PrimaryProduct?.techLevel.ToString() ?? "-",
                    pattern.CurrencyCost);
                Text.Font = GameFont.Tiny;
                Widgets.Label(
                    new Rect(textX, row.y + 29f, row.width - textX - 88f, 24f),
                    detail);
                Text.Font = GameFont.Small;

                bool available = pattern.AvailableNow;
                if (Widgets.ButtonText(
                    new Rect(row.xMax - 82f, row.y + 13f, 76f, 30f),
                    available ? "Shion_Order".Translate() : "Shion_Locked".Translate(),
                    true,
                    true,
                    available))
                {
                    ledger.CreateRequest(
                        pattern.Id,
                        Math.Min(maximumOrderAmount, Math.Max(minimumOrderAmount, orderAmount)),
                        context.Factory?.parent?.ThingID);
                }

                TooltipHandler.TipRegion(
                    row,
                    pattern.Description
                        + "\n\n"
                        + "Shion_CatalogIngredients".Translate(pattern.IngredientSummary));
            }

            Widgets.EndScrollView();
        }

        private void DrawRequests(Rect rect, WorldComponent_KombinatLedger ledger)
        {
            Widgets.DrawMenuSection(rect);
            Rect inner = rect.ContractedBy(8f);
            Widgets.Label(
                new Rect(inner.x, inner.y, inner.width, 26f),
                "Shion_ProductionRequestsTitle".Translate(ledger.Requests.Count));
            Rect outRect = new Rect(inner.x, inner.y + 30f, inner.width, inner.height - 30f);
            List<ProductionRequestRecord> requests = ledger.Requests
                .OrderByDescending(item => item.Priority)
                .ThenByDescending(item => item.CreatedTick)
                .ToList();
            Rect viewRect = new Rect(
                0f,
                0f,
                outRect.width - 18f,
                Math.Max(outRect.height, requests.Count * RequestRowHeight + 4f));
            Widgets.BeginScrollView(outRect, ref requestScrollPosition, viewRect);
            int first = Math.Max(0, Mathf.FloorToInt(requestScrollPosition.y / RequestRowHeight) - 1);
            int visible = Mathf.CeilToInt(outRect.height / RequestRowHeight) + 3;
            int last = Math.Min(requests.Count, first + visible);
            for (int index = first; index < last; index++)
            {
                ProductionRequestRecord request = requests[index];
                Rect row = new Rect(0f, index * RequestRowHeight, viewRect.width, 66f);
                Widgets.DrawMenuSection(row);
                string patternLabel =
                    KombinatProductionCatalog.Resolve(request.PatternDefName)?.Label
                    ?? request.PatternDefName;
                Widgets.Label(
                    new Rect(row.x + 8f, row.y + 6f, row.width - 130f, 24f),
                    patternLabel + "    " + request.CompletedAmount + "/" + request.RequestedAmount);
                Widgets.Label(
                    new Rect(row.x + 8f, row.y + 34f, row.width - 130f, 24f),
                    request.StatusReason.Translate() + "    [" + request.RequestId + "]");

                if (request.State != ProductionRequestState.Completed
                    && request.State != ProductionRequestState.Cancelled
                    && Widgets.ButtonText(
                        new Rect(row.xMax - 116f, row.y + 18f, 104f, 30f),
                        "Shion_Cancel".Translate()))
                {
                    ledger.Cancel(request.RequestId);
                }
            }

            Widgets.EndScrollView();
        }

        private void RefreshCatalog(KombinatManagementContext context)
        {
            string profileName = context.EffectiveProfile?.defName;
            if (string.Equals(cachedProfileName, profileName, StringComparison.Ordinal))
            {
                return;
            }

            cachedProfileName = profileName;
            if (context.EffectiveProfile != null)
            {
                orderAmount = Math.Min(
                    context.EffectiveProfile.maximumOrderAmount,
                    Math.Max(context.EffectiveProfile.minimumOrderAmount, orderAmount));
                amountBuffer = orderAmount.ToString();
            }

            catalog = KombinatProductionCatalog.ForProfile(context.EffectiveProfile);
            ApplySearch();
        }

        private void ApplySearch()
        {
            cachedSearchText = searchText ?? string.Empty;
            string normalized = cachedSearchText.Trim();
            filteredCatalog = catalog
                .Where(pattern => normalized.Length == 0
                    || pattern.Label.ToString().IndexOf(normalized, StringComparison.OrdinalIgnoreCase) >= 0
                    || pattern.Id.IndexOf(normalized, StringComparison.OrdinalIgnoreCase) >= 0
                    || pattern.SourceLabel.IndexOf(normalized, StringComparison.OrdinalIgnoreCase) >= 0)
                .ToList();
            catalogScrollPosition = Vector2.zero;
        }
    }

    public sealed class KombinatFacilitiesPageWorker : KombinatManagementPageWorker
    {
        public override void Draw(Rect rect, KombinatManagementContext context)
        {
            if (context.Factory == null)
            {
                DrawExtensionSlot(rect, "Shion_FacilityPageEmpty".Translate());
                return;
            }

            KombinatFacilityProfileDef profile = context.Factory.Profile;
            Widgets.Label(
                new Rect(rect.x, rect.y, rect.width, 30f),
                "Shion_FacilityIdentity".Translate(
                    context.Factory.parent.LabelCap,
                    context.Factory.FacilityId));
            Widgets.Label(
                new Rect(rect.x, rect.y + 34f, rect.width, 30f),
                "Shion_FacilityProfile".Translate(
                    profile?.LabelCap ?? "Shion_UnknownProfile".Translate(),
                    profile?.processIntervalTicks ?? 0,
                    profile?.workSpeedFactor ?? 0f));
            Widgets.Label(
                new Rect(rect.x, rect.y + 68f, rect.width, 60f),
                "Shion_FacilityStorageBoundary".Translate());
        }

        private static void DrawExtensionSlot(Rect rect, string message)
        {
            Widgets.DrawMenuSection(rect);
            Widgets.Label(rect.ContractedBy(12f), message);
        }
    }

    public sealed class KombinatLogisticsPageWorker : KombinatManagementPageWorker
    {
        public override void Draw(Rect rect, KombinatManagementContext context)
        {
            Widgets.DrawMenuSection(rect);
            Widgets.Label(
                rect.ContractedBy(12f),
                "Shion_LogisticsExtensionSlot".Translate());
        }
    }

    public sealed class KombinatFinancePageWorker : KombinatManagementPageWorker
    {
        public override void Draw(Rect rect, KombinatManagementContext context)
        {
            WorldComponent_KombinatLedger ledger = context.Ledger;
            if (ledger == null)
            {
                Widgets.Label(rect, "Shion_LedgerUnavailable".Translate());
                return;
            }

            Widgets.Label(
                new Rect(rect.x, rect.y, rect.width, 30f),
                "Shion_AccountSummary".Translate(ledger.Balance, ledger.Reserved, ledger.Available));
            Widgets.Label(
                new Rect(rect.x, rect.y + 34f, rect.width, 30f),
                "Shion_TransactionSummary".Translate(ledger.Transactions.Count));
            Widgets.DrawMenuSection(new Rect(rect.x, rect.y + 76f, rect.width, 96f));
            Widgets.Label(
                new Rect(rect.x + 12f, rect.y + 88f, rect.width - 24f, 72f),
                "Shion_FinanceExtensionSlot".Translate());
        }
    }
}
