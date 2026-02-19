import { db, ScanHistoryItem } from './db';

const OLD_HISTORY_KEY = 'wellness_scan_history';

// Export the type so other files can reference it
export type { ScanHistoryItem };

export const saveScanToHistory = async (data: Omit<ScanHistoryItem, 'id' | 'timestamp'>): Promise<ScanHistoryItem> => {
    // Ensure migration happens if it hasn't already
    await migrateFromLocalStorage();

    const newItem: ScanHistoryItem = {
        ...data,
        id: crypto.randomUUID(),
        timestamp: Date.now()
    };

    await db.scans.add(newItem);
    return newItem;
};

export const getScanHistory = async (): Promise<ScanHistoryItem[]> => {
    // Ensure migration happens if it hasn't already
    await migrateFromLocalStorage();

    // Return scans sorted by timestamp descending (newest first)
    return await db.scans.orderBy('timestamp').reverse().toArray();
};

export const clearHistory = async (): Promise<void> => {
    await db.scans.clear();
    localStorage.removeItem(OLD_HISTORY_KEY);
};

export const deleteScanEntry = async (id: string): Promise<void> => {
    await db.scans.delete(id);
};

// Internal migration function
const migrateFromLocalStorage = async () => {
    // Check if we've already migrated (could use a flag, but checking empty DB + existing localstorage is a decent heuristic)
    const count = await db.scans.count();
    const stored = localStorage.getItem(OLD_HISTORY_KEY);

    if (count === 0 && stored) {
        try {
            const oldData: ScanHistoryItem[] = JSON.parse(stored);
            if (Array.isArray(oldData) && oldData.length > 0) {
                console.log(`Migrating ${oldData.length} items from localStorage to IndexedDB...`);
                await db.scans.bulkAdd(oldData);
                // Optionally clear old storage, or leave it as backup for now?
                // Let's keep it for safety until explicit clear, but the app won't read from it anymore.
                // localStorage.removeItem(OLD_HISTORY_KEY); 
            }
        } catch (e) {
            console.error('Failed to migrate history from localStorage', e);
        }
    }
};
