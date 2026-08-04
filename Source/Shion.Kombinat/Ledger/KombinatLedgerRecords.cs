using Verse;

namespace Shion.Kombinat
{
    public enum AccountTransactionState
    {
        Reserved,
        Committed,
        Released,
        Rejected
    }

    public sealed class AccountTransactionRecord : IExposable
    {
        public string OperationId;
        public int Amount;
        public AccountTransactionState State;
        public int CreatedTick;

        public void ExposeData()
        {
            Scribe_Values.Look(ref OperationId, "operationId");
            Scribe_Values.Look(ref Amount, "amount");
            Scribe_Values.Look(ref State, "state", AccountTransactionState.Reserved);
            Scribe_Values.Look(ref CreatedTick, "createdTick");
        }
    }

    public enum ProductionRequestState
    {
        Planned,
        MaterialWaiting,
        Working,
        OutputBlocked,
        Completed,
        Cancelled,
        Faulted
    }

    public sealed class ProductionRequestRecord : IExposable
    {
        public string RequestId;
        public string PatternDefName;
        public string FactoryThingId;
        public int RequestedAmount;
        public int CompletedAmount;
        public int StageIndex;
        public int WorkTicksRemaining;
        public int Priority;
        public ProductionRequestState State;
        public string StatusReason;
        public string CurrencyOperationId;
        public string ActiveStorageOperationId;
        public int ActiveMapId = -1;
        public int CreatedTick;

        public void ExposeData()
        {
            Scribe_Values.Look(ref RequestId, "requestId");
            Scribe_Values.Look(ref PatternDefName, "patternDefName");
            Scribe_Values.Look(ref FactoryThingId, "factoryThingId");
            Scribe_Values.Look(ref RequestedAmount, "requestedAmount");
            Scribe_Values.Look(ref CompletedAmount, "completedAmount");
            Scribe_Values.Look(ref StageIndex, "stageIndex");
            Scribe_Values.Look(ref WorkTicksRemaining, "workTicksRemaining");
            Scribe_Values.Look(ref Priority, "priority");
            Scribe_Values.Look(ref State, "state", ProductionRequestState.Planned);
            Scribe_Values.Look(ref StatusReason, "statusReason");
            Scribe_Values.Look(ref CurrencyOperationId, "currencyOperationId");
            Scribe_Values.Look(ref ActiveStorageOperationId, "activeStorageOperationId");
            Scribe_Values.Look(ref ActiveMapId, "activeMapId", -1);
            Scribe_Values.Look(ref CreatedTick, "createdTick");
        }
    }

    public sealed class ProductionPlanRecord : IExposable
    {
        public string PlanId;
        public string RequestId;
        public string PatternDefName;
        public int NodeCount;
        public int RequestedAmount;
        public int CreatedTick;

        public void ExposeData()
        {
            Scribe_Values.Look(ref PlanId, "planId");
            Scribe_Values.Look(ref RequestId, "requestId");
            Scribe_Values.Look(ref PatternDefName, "patternDefName");
            Scribe_Values.Look(ref NodeCount, "nodeCount");
            Scribe_Values.Look(ref RequestedAmount, "requestedAmount");
            Scribe_Values.Look(ref CreatedTick, "createdTick");
        }
    }

    public sealed class ProductionJobRecord : IExposable
    {
        public string JobId;
        public string RequestId;
        public string FactoryThingId;
        public int BatchIndex;
        public int StageIndex;
        public int WorkTicksRemaining;
        public ProductionRequestState State;
        public string StatusReason;
        public int UpdatedTick;

        public void ExposeData()
        {
            Scribe_Values.Look(ref JobId, "jobId");
            Scribe_Values.Look(ref RequestId, "requestId");
            Scribe_Values.Look(ref FactoryThingId, "factoryThingId");
            Scribe_Values.Look(ref BatchIndex, "batchIndex");
            Scribe_Values.Look(ref StageIndex, "stageIndex");
            Scribe_Values.Look(ref WorkTicksRemaining, "workTicksRemaining");
            Scribe_Values.Look(ref State, "state", ProductionRequestState.Planned);
            Scribe_Values.Look(ref StatusReason, "statusReason");
            Scribe_Values.Look(ref UpdatedTick, "updatedTick");
        }
    }

    public enum ProductionBatchState
    {
        Planned,
        Working,
        Completed,
        Cancelled,
        Faulted
    }

    public sealed class ProductionBatchRecord : IExposable
    {
        public string BatchId;
        public string RequestId;
        public int BatchIndex;
        public int CompletedStages;
        public ProductionBatchState State;
        public int CreatedTick;
        public int CompletedTick;

        public void ExposeData()
        {
            Scribe_Values.Look(ref BatchId, "batchId");
            Scribe_Values.Look(ref RequestId, "requestId");
            Scribe_Values.Look(ref BatchIndex, "batchIndex");
            Scribe_Values.Look(ref CompletedStages, "completedStages");
            Scribe_Values.Look(ref State, "state", ProductionBatchState.Planned);
            Scribe_Values.Look(ref CreatedTick, "createdTick");
            Scribe_Values.Look(ref CompletedTick, "completedTick");
        }
    }
}
