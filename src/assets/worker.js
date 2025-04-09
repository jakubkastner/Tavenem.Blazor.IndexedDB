import { openDB, deleteDB } from 'idb';
const cursors = {};
async function openDatabase(databaseInfo) {
    if (databaseInfo.version === null) {
        databaseInfo.version = undefined;
    }
    databaseInfo.keyPath ??= 'id';
    try {
        const database = await openDB(databaseInfo.databaseName, databaseInfo.version, {
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
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
async function clear(databaseInfo) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return false;
    }
    try {
        await db.clear(databaseInfo.storeName ?? databaseInfo.databaseName);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
async function count(databaseInfo) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return 0;
    }
    try {
        return await db.count(databaseInfo.storeName ?? databaseInfo.databaseName);
    }
    catch (e) {
        console.error(e);
        return 0;
    }
}
async function deleteDatabase(name) {
    try {
        await deleteDB(name);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
async function deleteValue(databaseInfo, key) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return false;
    }
    try {
        await db.delete(databaseInfo.storeName ?? databaseInfo.databaseName, key);
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
async function getAll(databaseInfo) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return [];
    }
    try {
        return await db.getAll(databaseInfo.storeName ?? databaseInfo.databaseName);
    }
    catch (e) {
        console.error(e);
        return [];
    }
}
async function getAllStrings(databaseInfo) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return [];
    }
    try {
        var items = await db.getAll(databaseInfo.storeName ?? databaseInfo.databaseName);
        return items.map(v => JSON.stringify(v));
    }
    catch (e) {
        console.error(e);
        return [];
    }
}
async function getBatch(databaseInfo, reset) {
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
        }
        catch (e) {
            console.error('Error opening cursor:', e);
            return [];
        }
    }
    if (!cursorInfo.cursor) {
        return [];
    }
    const items = [];
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
    }
    catch (e) {
        console.error('Error iterating cursor:', e);
    }
    cursors[cursorKey] = cursorInfo;
    return items;
}
async function getBatchStrings(databaseInfo, reset) {
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
        }
        catch (e) {
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
    }
    catch (e) {
        console.error(e);
    }
    cursors[cursorKey] = cursorInfo;
    return items;
}
async function getValue(databaseInfo, key) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return null;
    }
    try {
        return await db.get(databaseInfo.storeName ?? databaseInfo.databaseName, key);
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
async function getValueString(databaseInfo, key) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return null;
    }
    try {
        return JSON.stringify(await db.get(databaseInfo.storeName ?? databaseInfo.databaseName, key));
    }
    catch (e) {
        console.error(e);
        return null;
    }
}
async function putValue(databaseInfo, value) {
    const db = await openDatabase(databaseInfo);
    if (!db) {
        return false;
    }
    try {
        await db.put(databaseInfo.storeName ?? databaseInfo.databaseName, JSON.parse(value));
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
async function putValues(databaseInfo, values) {
    debugger;
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
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
self.onmessage = async (event) => {
    debugger;
    switch (event.data.type) {
        case 'clear':
            const clearResult = await clear(event.data.databaseInfo);
            self.postMessage({ type: 'clearResult', success: clearResult });
            break;
        case 'count':
            const countResult = await count(event.data.databaseInfo);
            self.postMessage({ type: 'countResult', count: countResult });
            break;
        case 'deleteDatabase':
            const deleteDatabaseResult = await deleteDatabase(event.data.name);
            self.postMessage({ type: 'deleteDatabaseResult', success: deleteDatabaseResult });
            break;
        case 'deleteValue':
            const deleteValueResult = await deleteValue(event.data.databaseInfo, event.data.key);
            self.postMessage({ type: 'deleteValueResult', success: deleteValueResult });
            break;
        case 'getAll':
            const getAllResult = await getAll(event.data.databaseInfo);
            self.postMessage({ type: 'getAllResult', items: getAllResult });
            break;
        case 'getAllStrings':
            const getAllStringsResult = await getAllStrings(event.data.databaseInfo);
            self.postMessage({ type: 'getAllStringsResult', items: getAllStringsResult });
            break;
        case 'getBatch':
            const getBatchResult = await getBatch(event.data.databaseInfo, event.data.reset);
            self.postMessage({ type: 'getBatchResult', items: getBatchResult });
            break;
        case 'getBatchStrings':
            const getBatchStringsResult = await getBatchStrings(event.data.databaseInfo, event.data.reset);
            self.postMessage({ type: 'getBatchStringsResult', items: getBatchStringsResult });
            break;
        case 'getValue':
            const getValueResult = await getValue(event.data.databaseInfo, event.data.key);
            self.postMessage({ type: 'getValueResult', value: getValueResult });
            break;
        case 'getValueString':
            const getValueStringResult = await getValueString(event.data.databaseInfo, event.data.key);
            self.postMessage({ type: 'getValueStringResult', value: getValueStringResult });
            break;
        case 'putValue':
            const putValueResult = await putValue(event.data.databaseInfo, event.data.value);
            self.postMessage({ type: 'putValueResult', success: putValueResult });
            break;
        case 'putValues':
            const putValuesResult = await putValues(event.data.databaseInfo, event.data.values);
            self.postMessage({ type: 'putValuesResult', success: putValuesResult });
            break;
        default:
            console.error('Neznámý typ zprávy:', event.data.type);
    }
};
//# sourceMappingURL=worker.js.map