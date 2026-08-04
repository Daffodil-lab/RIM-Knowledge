using System;
using System.Collections.Generic;
using System.Linq;
using RimWorld.Planet;
using Shion.Storage;
using Verse;

namespace Shion.Kombinat
{
    public sealed class WorldComponent_KombinatLedger : WorldComponent, IAccountService, IProductionApplicationService
    {
        private const int CurrentDataVersion = 2;

        private int dataVersion = CurrentDataVersion;
        private int balance;
        private int reserved;
        private bool initialized;
        private List<AccountTransactionRecord> transactions = new List<AccountTransactionRecord>();
        private List<ProductionRequestRecord> requests = new List<ProductionRequestRecord>();
        private List<ProductionPlanRecord> plans = new List<ProductionPlanRecord>();
        private List<ProductionJobRecord> jobs = new List<ProductionJobRecord>();
        private List<ProductionBatchRecord> batches = new List<ProductionBatchRecord>();
        private Dictionary<string, AccountTransactionRecord> transactionIndex = new Dictionary<string, AccountTransactionRecord>();

        public WorldComponent_KombinatLedger(World world) : base(world)
        {
        }

        public int Balance => balance;
        public int Reserved => reserved;
        public int Available => Math.Max(0, balance - reserved);
        public IReadOnlyList<AccountTransactionRecord> Transactions => transactions;
        public IReadOnlyList<ProductionRequestRecord> Requests => requests;
        public IReadOnlyList<ProductionPlanRecord> Plans => plans;
        public IReadOnlyList<ProductionJobRecord> Jobs => jobs;
        public IReadOnlyList<ProductionBatchRecord> Batches => batches;

        public override void FinalizeInit(bool fromLoad)
        {
            base.FinalizeInit(fromLoad);
            InitializeOnce();
            RebuildIndexes();
            ValidateState();
        }

        public AccountOperationResult Reserve(string operationId, int amount)
        {
            InitializeOnce();
            if (operationId.NullOrEmpty())
            {
                return Result(false, AccountFailureReason.InvalidOperationId);
            }

            if (transactionIndex.TryGetValue(operationId, out AccountTransactionRecord existing))
            {
                return Result(existing.State != AccountTransactionState.Rejected, ToFailure(existing));
            }

            AccountTransactionRecord record = new AccountTransactionRecord
            {
                OperationId = operationId,
                Amount = amount,
                CreatedTick = Find.TickManager?.TicksGame ?? 0
            };

            if (amount <= 0)
            {
                record.State = AccountTransactionState.Rejected;
                AddTransaction(record);
                return Result(false, AccountFailureReason.InvalidAmount);
            }

            if (Available < amount)
            {
                record.State = AccountTransactionState.Rejected;
                AddTransaction(record);
                return Result(false, AccountFailureReason.InsufficientFunds);
            }

            record.State = AccountTransactionState.Reserved;
            reserved += amount;
            AddTransaction(record);
            return Result(true, AccountFailureReason.None);
        }

        public AccountOperationResult Commit(string operationId)
        {
            if (!TryGetReservation(
                operationId,
                AccountTransactionState.Committed,
                out AccountTransactionRecord record,
                out AccountOperationResult prior))
            {
                return prior;
            }

            balance -= record.Amount;
            reserved -= record.Amount;
            record.State = AccountTransactionState.Committed;
            return Result(true, AccountFailureReason.None);
        }

        public AccountOperationResult Release(string operationId)
        {
            if (!TryGetReservation(
                operationId,
                AccountTransactionState.Released,
                out AccountTransactionRecord record,
                out AccountOperationResult prior))
            {
                return prior;
            }

            reserved -= record.Amount;
            record.State = AccountTransactionState.Released;
            return Result(true, AccountFailureReason.None);
        }

        public ProductionRequestRecord CreateRequest(string patternDefName, int amount, string factoryThingId = null)
        {
            if (patternDefName.NullOrEmpty() || amount <= 0)
            {
                return null;
            }

            ProductionRequestRecord request = new ProductionRequestRecord
            {
                RequestId = "request:" + Guid.NewGuid().ToString("N"),
                PatternDefName = patternDefName,
                FactoryThingId = factoryThingId,
                RequestedAmount = amount,
                CompletedAmount = 0,
                StageIndex = 0,
                WorkTicksRemaining = 0,
                Priority = 0,
                State = ProductionRequestState.Planned,
                StatusReason = "Shion_StatusPlanned",
                CurrencyOperationId = "currency:" + Guid.NewGuid().ToString("N"),
                CreatedTick = Find.TickManager?.TicksGame ?? 0
            };
            requests.Add(request);
            KombinatProductionPattern pattern = KombinatProductionCatalog.Resolve(patternDefName);
            plans.Add(new ProductionPlanRecord
            {
                PlanId = "plan:" + request.RequestId,
                RequestId = request.RequestId,
                PatternDefName = patternDefName,
                NodeCount = pattern?.StageCount ?? 0,
                RequestedAmount = amount,
                CreatedTick = request.CreatedTick
            });
            EnsureBatches(request);
            return request;
        }

        public bool Cancel(string requestId)
        {
            ProductionRequestRecord request = requests.FirstOrDefault(item => item.RequestId == requestId);
            if (request == null || request.State == ProductionRequestState.Completed || request.State == ProductionRequestState.Cancelled)
            {
                return false;
            }

            if (!request.CurrencyOperationId.NullOrEmpty())
            {
                Release(request.CurrencyOperationId);
            }

            if (!request.ActiveStorageOperationId.NullOrEmpty())
            {
                Map map = Find.Maps.FirstOrDefault(candidate => candidate.uniqueID == request.ActiveMapId);
                StorageServices.For(map)?.ReleaseProduction(request.ActiveStorageOperationId);
                request.ActiveStorageOperationId = null;
                request.ActiveMapId = -1;
            }

            request.State = ProductionRequestState.Cancelled;
            request.StatusReason = "Shion_StatusCancelled";
            SynchronizeRuntime(request);
            return true;
        }

        public bool SetPriority(string requestId, int priority)
        {
            ProductionRequestRecord request = requests.FirstOrDefault(item => item.RequestId == requestId);
            if (request == null)
            {
                return false;
            }

            request.Priority = priority;
            return true;
        }

        public override void ExposeData()
        {
            base.ExposeData();
            Scribe_Values.Look(ref dataVersion, "dataVersion", CurrentDataVersion);
            Scribe_Values.Look(ref balance, "balance", KombinatDefResolver.OpeningBalance);
            Scribe_Values.Look(ref reserved, "reserved", 0);
            Scribe_Values.Look(ref initialized, "initialized", false);
            Scribe_Collections.Look(ref transactions, "transactions", LookMode.Deep);
            Scribe_Collections.Look(ref requests, "requests", LookMode.Deep);
            Scribe_Collections.Look(ref plans, "plans", LookMode.Deep);
            Scribe_Collections.Look(ref jobs, "jobs", LookMode.Deep);
            Scribe_Collections.Look(ref batches, "batches", LookMode.Deep);

            if (Scribe.mode == LoadSaveMode.PostLoadInit)
            {
                transactions = transactions ?? new List<AccountTransactionRecord>();
                requests = requests ?? new List<ProductionRequestRecord>();
                plans = plans ?? new List<ProductionPlanRecord>();
                jobs = jobs ?? new List<ProductionJobRecord>();
                batches = batches ?? new List<ProductionBatchRecord>();
                RebuildIndexes();
                ValidateState();
                RepairProductionRecords();
            }
        }

        public void SynchronizeRuntime(ProductionRequestRecord request)
        {
            if (request == null)
            {
                return;
            }

            EnsurePlan(request);
            EnsureBatches(request);
            int now = Find.TickManager?.TicksGame ?? 0;
            KombinatProductionPattern pattern =
                KombinatProductionCatalog.Resolve(request.PatternDefName);
            int stageCount = Math.Max(1, pattern?.StageCount ?? 1);

            foreach (ProductionBatchRecord batch in batches.Where(item => item.RequestId == request.RequestId))
            {
                if (batch.BatchIndex < request.CompletedAmount)
                {
                    batch.CompletedStages = stageCount;
                    batch.State = ProductionBatchState.Completed;
                    if (batch.CompletedTick == 0)
                    {
                        batch.CompletedTick = now;
                    }
                }
                else if (request.State == ProductionRequestState.Cancelled)
                {
                    batch.State = ProductionBatchState.Cancelled;
                }
                else if (request.State == ProductionRequestState.Faulted)
                {
                    batch.State = ProductionBatchState.Faulted;
                }
                else if (batch.BatchIndex == request.CompletedAmount)
                {
                    batch.CompletedStages = Math.Max(0, request.StageIndex);
                    batch.State = request.State == ProductionRequestState.Planned
                        ? ProductionBatchState.Planned
                        : ProductionBatchState.Working;
                }
            }

            int currentBatch = Math.Min(Math.Max(0, request.CompletedAmount), Math.Max(0, request.RequestedAmount - 1));
            foreach (ProductionJobRecord prior in jobs.Where(item =>
                item.RequestId == request.RequestId
                && (item.BatchIndex < currentBatch
                    || (item.BatchIndex == currentBatch && item.StageIndex < request.StageIndex))))
            {
                prior.State = ProductionRequestState.Completed;
                prior.StatusReason = "Shion_StatusCompleted";
                prior.WorkTicksRemaining = 0;
                prior.UpdatedTick = now;
            }

            if (request.State == ProductionRequestState.Completed
                || request.State == ProductionRequestState.Cancelled)
            {
                return;
            }

            int currentStage = Math.Min(Math.Max(0, request.StageIndex), stageCount - 1);
            string jobId = "job:" + request.RequestId + ":" + currentBatch + ":" + currentStage;
            ProductionJobRecord job = jobs.FirstOrDefault(item => item.JobId == jobId);
            if (job == null)
            {
                job = new ProductionJobRecord
                {
                    JobId = jobId,
                    RequestId = request.RequestId,
                    FactoryThingId = request.FactoryThingId,
                    BatchIndex = currentBatch,
                    StageIndex = currentStage
                };
                jobs.Add(job);
            }

            job.State = request.State;
            job.StatusReason = request.StatusReason;
            job.WorkTicksRemaining = request.WorkTicksRemaining;
            job.UpdatedTick = now;
        }

        private void InitializeOnce()
        {
            if (initialized)
            {
                return;
            }

            balance = KombinatDefResolver.OpeningBalance;
            reserved = 0;
            initialized = true;
        }

        private void AddTransaction(AccountTransactionRecord record)
        {
            transactions.Add(record);
            transactionIndex[record.OperationId] = record;
        }

        private bool TryGetReservation(
            string operationId,
            AccountTransactionState desiredFinalState,
            out AccountTransactionRecord record,
            out AccountOperationResult result)
        {
            record = null;
            if (operationId.NullOrEmpty() || !transactionIndex.TryGetValue(operationId, out record))
            {
                result = Result(false, AccountFailureReason.ReservationMissing);
                return false;
            }

            if (record.State == desiredFinalState)
            {
                result = Result(true, AccountFailureReason.None);
                return false;
            }

            if (record.State == AccountTransactionState.Committed || record.State == AccountTransactionState.Released)
            {
                result = Result(false, AccountFailureReason.AlreadyFinalized);
                return false;
            }

            if (record.State != AccountTransactionState.Reserved)
            {
                result = Result(false, AccountFailureReason.AlreadyFinalized);
                return false;
            }

            result = null;
            return true;
        }

        private AccountOperationResult Result(bool succeeded, AccountFailureReason failure)
        {
            return new AccountOperationResult
            {
                Succeeded = succeeded,
                FailureReason = failure,
                Balance = balance,
                Reserved = reserved
            };
        }

        private static AccountFailureReason ToFailure(AccountTransactionRecord record)
        {
            if (record.State != AccountTransactionState.Rejected)
            {
                return AccountFailureReason.None;
            }

            return record.Amount <= 0
                ? AccountFailureReason.InvalidAmount
                : AccountFailureReason.InsufficientFunds;
        }

        private void RebuildIndexes()
        {
            transactionIndex = transactions
                .Where(record => record != null && !record.OperationId.NullOrEmpty())
                .GroupBy(record => record.OperationId)
                .ToDictionary(group => group.Key, group => group.Last());
        }

        private void ValidateState()
        {
            balance = Math.Max(0, balance);
            int remaining = balance;
            foreach (AccountTransactionRecord record in transactions
                .Where(item => item != null && item.State == AccountTransactionState.Reserved)
                .OrderBy(item => item.CreatedTick))
            {
                if (record.Amount > 0 && record.Amount <= remaining)
                {
                    remaining -= record.Amount;
                }
                else
                {
                    record.State = AccountTransactionState.Released;
                }
            }

            reserved = balance - remaining;
        }

        private void RepairProductionRecords()
        {
            foreach (ProductionRequestRecord request in requests.Where(item => item != null))
            {
                EnsurePlan(request);
                EnsureBatches(request);
                SynchronizeRuntime(request);
            }
        }

        private void EnsurePlan(ProductionRequestRecord request)
        {
            if (plans.Any(item => item.RequestId == request.RequestId))
            {
                return;
            }

            KombinatProductionPattern pattern =
                KombinatProductionCatalog.Resolve(request.PatternDefName);
            plans.Add(new ProductionPlanRecord
            {
                PlanId = "plan:" + request.RequestId,
                RequestId = request.RequestId,
                PatternDefName = request.PatternDefName,
                NodeCount = pattern?.StageCount ?? 0,
                RequestedAmount = request.RequestedAmount,
                CreatedTick = request.CreatedTick
            });
        }

        private void EnsureBatches(ProductionRequestRecord request)
        {
            for (int index = 0; index < request.RequestedAmount; index++)
            {
                if (batches.Any(item => item.RequestId == request.RequestId && item.BatchIndex == index))
                {
                    continue;
                }

                batches.Add(new ProductionBatchRecord
                {
                    BatchId = "batch:" + request.RequestId + ":" + index,
                    RequestId = request.RequestId,
                    BatchIndex = index,
                    State = ProductionBatchState.Planned,
                    CreatedTick = request.CreatedTick
                });
            }
        }
    }

    public static class KombinatServices
    {
        public static WorldComponent_KombinatLedger Ledger
        {
            get
            {
                return Find.World?.GetComponent<WorldComponent_KombinatLedger>();
            }
        }
    }
}
