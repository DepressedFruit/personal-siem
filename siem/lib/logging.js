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
const INFO = console.info;
const DEBUG = console.debug;
const WARN = console.warn;
const ERROR = console.error;
function default_1(mode, prefix = null) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const LOG_DIR = (0, path_1.join)(__dirname, '../', '../', 'logs');
            const LOG_FILE = (0, path_1.join)(__dirname, '../', '../', 'logs', `${mode}.log`);
            if (!(0, fs_1.existsSync)(LOG_DIR))
                (0, fs_1.mkdirSync)(LOG_DIR);
            if (!(0, fs_1.existsSync)(LOG_FILE))
                (0, fs_1.writeFile)(LOG_FILE, 'LOG FILE CREATED', { flag: 'wx' }, () => { });
            function appendToLog(type, log) {
                return __awaiter(this, void 0, void 0, function* () {
                    const currentDateTime = (0, dayjs_1.default)();
                    let fullLog = `${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [${type.toUpperCase()}]`;
                    if (prefix)
                        fullLog += ` [${prefix}]`;
                    fullLog += ` ${log}`;
                    yield (0, promises_1.appendFile)(LOG_FILE, `\n${fullLog}`);
                    return fullLog;
                });
            }
            return {
                info: (log) => {
                    appendToLog('info', log).then(fullLog => INFO(fullLog));
                },
                debug: (log) => {
                    appendToLog('debug', log).then(fullLog => DEBUG(fullLog));
                },
                warn: (log) => {
                    appendToLog('warning', log).then(fullLog => WARN(fullLog));
                },
                error: (log) => {
                    appendToLog('error', log).then(fullLog => ERROR(fullLog));
                },
            };
        }
        catch (err) {
            const currentDateTime = (0, dayjs_1.default)();
            ERROR(`${err}`);
            return {
                info: (log) => INFO(`${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [INFO] ${log}`),
                debug: (log) => DEBUG(`${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [DEBUG] ${log}`),
                warn: (log) => WARN(`${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [WARNING] ${log}`),
                error: (log) => ERROR(`${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [ERROR] ${log}`),
            };
        }
    });
}
exports.default = default_1;
