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
// import { watch } from 'fs/promises';
const readline_1 = __importDefault(require("readline"));
const DEBOUNCE_COUNTDOWN = 50; // In miliseconds.
/*
 * Credit: https://stackoverflow.com/questions/12453057/node-js-count-the-number-of-lines-in-a-file
 */
function countFileLines(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let count = 0;
            let i;
            (0, fs_1.createReadStream)(file).on('data', (chunk) => {
                for (i = 0; i < chunk.length; i++) {
                    if ('\n'.charCodeAt(0) === chunk[i])
                        count++;
                }
            }).on('end', () => resolve(count + 1));
        });
    });
}
/*
 * Could be better. Would appreciate if some help.
 */
function default_1({ logger, options, next, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { file } = options;
        try {
            let currentLines = yield countFileLines(file);
            let timeoutDebounce;
            (0, fs_1.watch)(file, (event) => {
                if (!timeoutDebounce) {
                    /*
                     * Time out (50ms) so that the watcher does not report a double event.
                     * Happens on: Windows
                     */
                    timeoutDebounce = setTimeout(() => {
                        const fileInterface = readline_1.default.createInterface({
                            input: (0, fs_1.createReadStream)(file),
                        });
                        let lineNo = 0;
                        fileInterface.on('line', (line) => {
                            lineNo++;
                            if (lineNo > currentLines) {
                                currentLines = lineNo;
                                // console.log(line);
                                next({
                                    watcher: 'log-files',
                                    description: line,
                                    data: {},
                                });
                            }
                        });
                        timeoutDebounce = null;
                    }, DEBOUNCE_COUNTDOWN);
                }
            });
        }
        catch (err) {
            logger.error(`log-files ${err}`);
        }
    });
}
exports.default = default_1;
;
