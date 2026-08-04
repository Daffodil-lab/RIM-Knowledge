using System.Collections.Generic;

namespace Shion.Kombinat
{
    public enum AccountFailureReason
    {
        None,
        InvalidOperationId,
        InvalidAmount,
        InsufficientFunds,
        ReservationMissing,
        AlreadyFinalized
    }

    public sealed class AccountOperationResult
    {
        public bool Succeeded;
        public AccountFailureReason FailureReason;
        public int Balance;
        public int Reserved;
    }

    public interface IAccountService
    {
        int Balance { get; }
        int Reserved { get; }
        int Available { get; }
        IReadOnlyList<AccountTransactionRecord> Transactions { get; }
        AccountOperationResult Reserve(string operationId, int amount);
        AccountOperationResult Commit(string operationId);
        AccountOperationResult Release(string operationId);
    }

    public interface IProductionApplicationService
    {
        IReadOnlyList<ProductionRequestRecord> Requests { get; }
        IReadOnlyList<ProductionPlanRecord> Plans { get; }
        IReadOnlyList<ProductionJobRecord> Jobs { get; }
        IReadOnlyList<ProductionBatchRecord> Batches { get; }
        ProductionRequestRecord CreateRequest(string patternDefName, int amount, string factoryThingId = null);
        bool Cancel(string requestId);
        bool SetPriority(string requestId, int priority);
    }
}
