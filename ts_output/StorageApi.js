"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _StorageApi_key;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageApi = void 0;
class StorageApi {
    store(value) {
        window.localStorage.setItem(__classPrivateFieldGet(StorageApi, _a, "f", _StorageApi_key), JSON.stringify(value, null, 2));
    }
    // TODO: use zod or some other popular lib and validate value's shape here
    load() {
        const maybeValue = window.localStorage.getItem(__classPrivateFieldGet(StorageApi, _a, "f", _StorageApi_key));
        return maybeValue ? JSON.parse(maybeValue) : null;
    }
    clear() {
        window.localStorage.removeItem(__classPrivateFieldGet(StorageApi, _a, "f", _StorageApi_key));
    }
}
_a = StorageApi;
_StorageApi_key = { value: "game_stored_state" };
exports.StorageApi = StorageApi;
