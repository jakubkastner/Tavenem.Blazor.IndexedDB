const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
export async function clear(databaseInfo) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'clear', databaseInfo });
        worker.onmessage = (event) => {
            if (event.data.type === 'clearResult') {
                resolve(event.data.success);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
export async function count(databaseInfo) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'count', databaseInfo });
        worker.onmessage = (event) => {
            if (event.data.type === 'countResult') {
                resolve(event.data.count);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
export async function deleteDatabase(name) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'deleteDatabase', name });
        worker.onmessage = (event) => {
            if (event.data.type === 'deleteDatabaseResult') {
                resolve(event.data.success);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
export async function deleteValue(databaseInfo, key) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'deleteValue', databaseInfo, key });
        worker.onmessage = (event) => {
            if (event.data.type === 'deleteValueResult') {
                resolve(event.data.success);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
export async function getAll(databaseInfo) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getAll', databaseInfo });
        worker.onmessage = (event) => {
            if (event.data.type === 'getAllResult') {
                resolve(event.data.items);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
export async function getAllStrings(databaseInfo) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getAllStrings', databaseInfo });
        worker.onmessage = (event) => {
            if (event.data.type === 'getAllStringsResult') {
                resolve(event.data.items);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
export async function getBatch(databaseInfo, reset) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getBatch', databaseInfo, reset });
        worker.onmessage = (event) => {
            if (event.data.type === 'getBatchResult') {
                resolve(event.data.items);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
export async function getBatchStrings(databaseInfo, reset) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getBatchStrings', databaseInfo, reset });
        worker.onmessage = (event) => {
            if (event.data.type === 'getBatchStringsResult') {
                resolve(event.data.items);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
export async function getValue(databaseInfo, key) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getValue', databaseInfo, key });
        worker.onmessage = (event) => {
            if (event.data.type === 'getValueResult') {
                resolve(event.data.value);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
export async function getValueString(databaseInfo, key) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'getValueString', databaseInfo, key });
        worker.onmessage = (event) => {
            if (event.data.type === 'getValueStringResult') {
                resolve(event.data.value);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
export async function putValue(databaseInfo, value) {
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'putValue', databaseInfo, value });
        worker.onmessage = (event) => {
            if (event.data.type === 'putValueResult') {
                resolve(event.data.success);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
export async function putValues(databaseInfo, values) {
    console.log('Odesílám zprávu workeru...');
    return new Promise((resolve, reject) => {
        worker.postMessage({ type: 'putValues', databaseInfo, values });
        worker.onmessage = (event) => {
            if (event.data.type === 'putValuesResult') {
                console.log('Zpráva přijata zpět:', event.data.success);
                resolve(event.data.success);
            }
            else {
                reject('Neznámý typ zprávy');
            }
        };
    });
}
//# sourceMappingURL=tavenem-indexeddb.js.map