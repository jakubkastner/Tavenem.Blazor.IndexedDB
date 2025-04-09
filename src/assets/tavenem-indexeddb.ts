const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
interface DatabaseInfo {
    databaseName: string;
    storeName: string | undefined | null;
    version: number | undefined | null;
    keyPath: string | undefined | null;
    storeNames: string[] | undefined | null;
}

export async function clear(databaseInfo: DatabaseInfo) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'clear', databaseInfo });
        worker.onmessage = (event) => {
            if (event.data.type === 'clearResult') {
                resolve(event.data.success);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}

export async function count(databaseInfo: DatabaseInfo) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'count', databaseInfo });
        worker.onmessage = (event) => {
            if (event.data.type === 'countResult') {
                resolve(event.data.count);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}

export async function deleteDatabase(name: string) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'deleteDatabase', name });
        worker.onmessage = (event) => {
            if (event.data.type === 'deleteDatabaseResult') {
                resolve(event.data.success);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}

export async function deleteValue(databaseInfo: DatabaseInfo, key: IDBValidKey) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'deleteValue', databaseInfo, key });
        worker.onmessage = (event) => {
            if (event.data.type === 'deleteValueResult') {
                resolve(event.data.success);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}

export async function getAll(databaseInfo: DatabaseInfo) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getAll', databaseInfo });
        worker.onmessage = (event) => {
            if (event.data.type === 'getAllResult') {
                resolve(event.data.items);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}

export async function getAllStrings(databaseInfo: DatabaseInfo) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getAllStrings', databaseInfo });
        worker.onmessage = (event) => {
            if (event.data.type === 'getAllStringsResult') {
                resolve(event.data.items);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}

export async function getBatch(databaseInfo: DatabaseInfo, reset: boolean) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getBatch', databaseInfo, reset });
        worker.onmessage = (event) => {
            if (event.data.type === 'getBatchResult') {
                resolve(event.data.items);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}

export async function getBatchStrings(databaseInfo: DatabaseInfo, reset: boolean) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getBatchStrings', databaseInfo, reset });
        worker.onmessage = (event) => {
            if (event.data.type === 'getBatchStringsResult') {
                resolve(event.data.items);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}

export async function getValue(databaseInfo: DatabaseInfo, key: IDBValidKey) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getValue', databaseInfo, key });
        worker.onmessage = (event) => {
            if (event.data.type === 'getValueResult') {
                resolve(event.data.value);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}

export async function getValueString(databaseInfo: DatabaseInfo, key: IDBValidKey) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getValueString', databaseInfo, key });
        worker.onmessage = (event) => {
            if (event.data.type === 'getValueStringResult') {
                resolve(event.data.value);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}

export async function putValue(databaseInfo: DatabaseInfo, value: string) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'putValue', databaseInfo, value });
        worker.onmessage = (event) => {
            if (event.data.type === 'putValueResult') {
                resolve(event.data.success);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}

export async function putValues(databaseInfo: DatabaseInfo, values: string[]) {
    console.log('Odesílám zprávu workeru...');
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'putValues', databaseInfo, values });
        worker.onmessage = (event) => {
            if (event.data.type === 'putValuesResult') {
                console.log('Zpráva pøijata zpìt:', event.data.success);
                resolve(event.data.success);
            } else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}






/***** */









/*import { openDB, deleteDB, IDBPCursorWithValue } from 'idb';

interface DatabaseInfo {
    databaseName: string;
    storeName: string | undefined | null;
    version: number | undefined | null;
    keyPath: string | undefined | null;
    storeNames: string[] | undefined | null;
}

interface CursorInfo {
    db: DatabaseInfo;
    cursor: IDBPCursorWithValue | null;
}

const cursors: Record<string, CursorInfo> = {};

async function openDatabase(databaseInfo: DatabaseInfo) {
    if (databaseInfo.version === null) {
        databaseInfo.version = undefined;
    }
    databaseInfo.keyPath ??= 'id';

    try {
        const database = await openDB(
            databaseInfo.databaseName,
            databaseInfo.version, {
            upgrade(db) {
                if (databaseInfo.storeNames) {
                    for (const storeName of databaseInfo.storeNames) {
                        if (!db.objectStoreNames.contains(storeName)) {
                            db.createObjectStore(storeName, {
                                keyPath: databaseInfo.keyPath,
                            });
                        }
                    }
                }
                if (db.objectStoreNames.length == 0
                    && !db.objectStoreNames.contains(databaseInfo.databaseName)) {
                    db.createObjectStore(databaseInfo.databaseName, {
                        keyPath: databaseInfo.keyPath,
                    });
                }
            }
        });
        return database;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function clear(databaseInfo: DatabaseInfo) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return;
    }
    try {
        return await db.clear(databaseInfo.storeName ?? databaseInfo.databaseName);
    } catch (e) {
        console.error(e);
    }
}

export async function count(databaseInfo: DatabaseInfo) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return 0;
    }
    try {
        return await db.count(databaseInfo.storeName ?? databaseInfo.databaseName);
    } catch (e) {
        console.error(e);
        return 0;
    }
}

export async function deleteDatabase(name: string) {
    try {
        await deleteDB(name);
    } catch (e) {
        console.error(e);
    }
}

export async function deleteValue(databaseInfo: DatabaseInfo, key: IDBValidKey) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return false;
    }
    try {
        await db.delete(databaseInfo.storeName ?? databaseInfo.databaseName, key);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getAll(databaseInfo: DatabaseInfo) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return [];
    }
    try {
        return await db.getAll(databaseInfo.storeName ?? databaseInfo.databaseName);
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function getAllStrings(databaseInfo: DatabaseInfo) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return [];
    }
    try {
        var items = await db.getAll(databaseInfo.storeName ?? databaseInfo.databaseName);
        return items.map(v => JSON.stringify(v));
    } catch (e) {
        console.error(e);
        return [];
    }
}
export async function getBatch(databaseInfo: DatabaseInfo, reset: boolean): Promise<any[]> {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return [];
    }
    const cursorKey = databaseInfo.databaseName + '.' + databaseInfo.storeName;
    if (reset) {
        delete cursors[cursorKey];
    }
    let cursorInfo = cursors[cursorKey];
    if (!cursorInfo || cursorInfo.db.version !== databaseInfo.version) {
        try {
            const transaction = db.transaction(databaseInfo.storeName ?? databaseInfo.databaseName, 'readonly');
            const store = transaction.objectStore(databaseInfo.storeName ?? databaseInfo.databaseName);
            const cursor = await store.openCursor();

            cursorInfo = { db: databaseInfo, cursor };
            cursors[cursorKey] = cursorInfo;
        } catch (e) {
            console.error('Error opening cursor:', e);
            return [];
        }
    }
    if (!cursorInfo.cursor) {
        return [];
    }

    const items: any[] = [];

    try {
        while (items.length < 20) {
            const transaction = db.transaction(databaseInfo.storeName ?? databaseInfo.databaseName, 'readonly');
            const store = transaction.objectStore(databaseInfo.storeName ?? databaseInfo.databaseName);
            const cursor = await store.openCursor(cursorInfo.cursor.key);

            if (!cursor) {
                break;
            }

            items.push(cursor.value);
            await cursor.continue();
            cursorInfo.cursor = cursor;
        }
    } catch (e) {
        console.error('Error iterating cursor:', e);
    }

    cursors[cursorKey] = cursorInfo;
    return items;
}

export async function getBatchStrings(databaseInfo: DatabaseInfo, reset: boolean) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return [];
    }
    const cursorKey = databaseInfo.databaseName + '.' + databaseInfo.storeName;
    if (reset) {
        delete cursors[cursorKey];
    }
    let cursorInfo = cursors[cursorKey];
    if (!cursorInfo || cursorInfo.db.version != databaseInfo.version) {
        try {
            const cursor = await db.transaction(databaseInfo.storeName ?? databaseInfo.databaseName).store.openCursor();
            cursorInfo = {
                db: databaseInfo,
                cursor,
            };
        } catch (e) {
            console.error(e);
        }
    }
    if (!cursorInfo) {
        return [];
    }
    const items = [];
    try {
        while (cursorInfo.cursor && items.length < 20) {
            items.push(JSON.stringify(cursorInfo.cursor.value));
            cursorInfo.cursor = await cursorInfo.cursor.continue();
        }
    } catch (e) {
        console.error(e);
    }
    cursors[cursorKey] = cursorInfo;
    return items;
}

export async function getValue(databaseInfo: DatabaseInfo, key: IDBValidKey) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return null;
    }
    try {
        return await db.get(databaseInfo.storeName ?? databaseInfo.databaseName, key);
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getValueString(databaseInfo: DatabaseInfo, key: IDBValidKey) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return null;
    }
    try {
        return JSON.stringify(await db.get(databaseInfo.storeName ?? databaseInfo.databaseName, key));
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function putValue(databaseInfo: DatabaseInfo, value: string) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return false;
    }
    try {
        await db.put(databaseInfo.storeName ?? databaseInfo.databaseName, JSON.parse(value));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function putValuesOld(databaseInfo: DatabaseInfo, values: string[]) {
    debugger;
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return false;
    }
    try {
        for (const value of values) {
            await db.put(databaseInfo.storeName ?? databaseInfo.databaseName, JSON.parse(value));
        }
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function putValues(databaseInfo: DatabaseInfo, values: string[]) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return false;
    }
    try {
        const transaction = db.transaction(databaseInfo.storeName ?? databaseInfo.databaseName, 'readwrite');
        const store = transaction.objectStore(databaseInfo.storeName ?? databaseInfo.databaseName);

        for (const value of values) {
            store.put(JSON.parse(value));
        }

        await transaction.done;
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}


/*export async function getBatch(databaseInfo: DatabaseInfo, reset: boolean) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return [];
    }
    const cursorKey = databaseInfo.databaseName + '.' + databaseInfo.storeName;
    if (reset) {
        delete cursors[cursorKey];
    }
    let cursorInfo = cursors[cursorKey];
    if (!cursorInfo || cursorInfo.db.version != databaseInfo.version) {
        try {
            const cursor = await db.transaction(databaseInfo.storeName ?? databaseInfo.databaseName).store.openCursor();
            cursorInfo = {
                db: databaseInfo,
                cursor,
            };
        } catch (e) {
            console.error(e);
        }
    }
    if (!cursorInfo) {
        return [];
    }
    const items = [];
    try {
        while (cursorInfo.cursor && items.length < 20) {
            items.push(cursorInfo.cursor.value);
            cursorInfo.cursor = await cursorInfo.cursor.continue();
        }
    } catch (e) {
        console.error(e);
    }
    cursors[cursorKey] = cursorInfo;
    return items;
}*/