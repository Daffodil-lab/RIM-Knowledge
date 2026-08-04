using System;
using Verse;

namespace Shion.Storage
{
    public static class StorageServices
    {
        public static MapComponent_ShionEndpointRegistry For(Map map)
        {
            return map?.GetComponent<MapComponent_ShionEndpointRegistry>();
        }
    }

    public static class StorageManagementUi
    {
        private static Func<CompShionStorage, bool> openIntegrated;

        public static bool HasIntegratedLauncher => openIntegrated != null;

        public static void RegisterIntegratedLauncher(Func<CompShionStorage, bool> launcher)
        {
            openIntegrated = launcher;
        }

        public static bool TryOpenIntegrated(CompShionStorage storage)
        {
            return storage != null && openIntegrated?.Invoke(storage) == true;
        }
    }
}

