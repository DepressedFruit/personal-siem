"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readConfig = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
function readConfig(config) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const CHUNK_SIZE = 10000000;
        const stream = (0, fs_1.createReadStream)((0, path_1.join)(__dirname, '../', '../', 'configs', `${config}.json`), {
            highWaterMark: CHUNK_SIZE,
        });
        let configString = [];
        try {
            for (var stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), !stream_1_1.done;) {
                const data = stream_1_1.value;
                // CONFIG_BUFFER.push(data);
                configString = [
                    ...configString,
                    data.toString(),
                ];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (stream_1_1 && !stream_1_1.done && (_a = stream_1.return)) yield _a.call(stream_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // const str: string = new Uint8Array(CONFIG_BUFFER).
        const parsed_config = JSON.parse(configString.join());
        switch (config) {
            case 'watchers':
                return parsed_config;
                break;
            default:
            case 'settings':
                return parsed_config;
                break;
        }
    });
}
exports.readConfig = readConfig;
