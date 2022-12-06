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
const child_process_1 = require("child_process");
const dayjs_1 = __importDefault(require("dayjs"));
/*
 * Problem with this method:
 * A Powershell window will be called out everytime the interval is up.
 *
 * Need:
 * A better method to actually parse the Event Viewer files.
 */
function default_1({ logger, options, next, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { interval, application } = options;
        setInterval(() => {
            const currentTime = (0, dayjs_1.default)();
            const threeSecondsAgo = currentTime.subtract(interval, 'second');
            const timeFormat = 'MM/DD/YYYY HH:mm:ss';
            const powershellCommand = [
                'Get-EventLog',
                '-Before',
                `'${currentTime.format(timeFormat)}'`,
                '-after',
                `'${threeSecondsAgo.format(timeFormat)}'`,
                '-LogName',
                `'${application}'`,
                '|',
                'ConvertTo-Json',
            ];
            // const command: string = `powershell.exe -WindowStyle hidden -command \"Get-EventLog -Before '${currentTime.format(timeFormat)}' -after '${threeSecondsAgo.format(timeFormat)}' -LogName '${application}' | ConvertTo-Json\"`;
            (0, child_process_1.exec)(powershellCommand.join(' '), { 'shell': 'powershell.exe' }, (error, stdout, stderr) => {
                var _a, _b;
                if (error) {
                    logger.error(`exec error: ${error}`);
                    return;
                }
                if (stderr) {
                    logger.error(`exec stderr: ${stderr}`);
                    return;
                }
                if (stdout
                    && stdout !== null) {
                    const cmdOutput = JSON.parse(stdout);
                    next({
                        watcher: 'windows-event-logger',
                        description: (_b = (_a = cmdOutput.data) === null || _a === void 0 ? void 0 : _a.Message) === null || _b === void 0 ? void 0 : _b.toString(),
                        data: JSON.parse(stdout),
                    });
                    return;
                }
            });
        }, interval * 1000);
    });
}
exports.default = default_1;
;
