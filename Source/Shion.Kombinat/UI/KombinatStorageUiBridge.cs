using Shion.Storage;
using Verse;

namespace Shion.Kombinat
{
    [StaticConstructorOnStartup]
    public static class KombinatStorageUiBridge
    {
        static KombinatStorageUiBridge()
        {
            StorageManagementUi.RegisterIntegratedLauncher(Open);
        }

        private static bool Open(CompShionStorage storage)
        {
            if (storage == null)
            {
                return false;
            }

            Find.WindowStack.Add(
                new Window_KombinatTerminal(
                    null,
                    storage,
                    typeof(KombinatInventoryPageWorker)));
            return true;
        }
    }
}
