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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const dayjs_1 = __importDefault(require("dayjs"));
function default_1(mode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const LOG_DIR = (0, path_1.join)(__dirname, '../', '../', 'logs');
            const LOG_FILE = (0, path_1.join)(__dirname, '../', '../', 'logs', `${mode}.log`);
            if (!(0, fs_1.existsSync)(LOG_DIR)) {
                (0, fs_1.mkdirSync)(LOG_DIR);
            }
            if (!(0, fs_1.existsSync)(LOG_FILE)) {
                // Create file.
                (0, fs_1.writeFile)(LOG_FILE, 'LOG FILE CREATED\n', { flag: 'wx' }, () => { });
            }
            function appendToLog(type, log) {
                return __awaiter(this, void 0, void 0, function* () {
                    const currentDateTime = (0, dayjs_1.default)();
                    const fullLog = `${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [${type.toUpperCase()}] ${log}`;
                    yield (0, promises_1.appendFile)(LOG_FILE, `${fullLog}\n`);
                    console.log(fullLog);
                });
            }
            return {
                info: (log) => {
                    appendToLog('info', log).then(() => { });
                },
                debug: (log) => {
                    appendToLog('debug', log).then(() => { });
                },
                warning: (log) => {
                    appendToLog('warning', log).then(() => { });
                },
                error: (log) => {
                    appendToLog('error', log).then(() => { });
                },
            };
        }
        catch (err) {
            console.error(`${err}`);
            return {
                info: (log) => { },
                debug: (log) => { },
                warning: (log) => { },
                error: (log) => { },
            };
        }
    });
}
exports.default = default_1;
