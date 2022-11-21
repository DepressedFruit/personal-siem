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
exports.initDecoder = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const rules_1 = require("./rules");
let RULES = [];
function decode(description) {
    return __awaiter(this, void 0, void 0, function* () {
        let parses = [];
        RULES.forEach((ruleGroup) => {
            let date = (0, dayjs_1.default)();
            let parsedLog = null;
            let logWithoutDate = description;
            /*
             * Prematch dates.
             */
            if (ruleGroup.group.dateMatch) {
                const dateRegex = new RegExp(ruleGroup.group.dateMatch);
                parsedLog = dateRegex.exec(description);
                const dateGroupId = ruleGroup.group.dateGroupId || 1; // Get group index for date.
                if (parsedLog) {
                    date = (0, dayjs_1.default)(parsedLog[dateGroupId]);
                    const [, splitLog] = logWithoutDate.split(parsedLog[0]);
                    logWithoutDate = splitLog.trim();
                }
            }
            if (!parsedLog) {
                parsedLog = (0, rules_1.defaultDateParse)(description);
                if (parsedLog) {
                    date = (0, dayjs_1.default)(parsedLog[1]); // Date string will always be in group 1.
                    const [, splitLog] = description.split(parsedLog[1]);
                    logWithoutDate = splitLog.trim();
                }
            }
            const checks = (0, rules_1.checkRules)(ruleGroup, logWithoutDate);
            if (checks.length > 0) {
                parses = [
                    ...parses,
                    {
                        group: ruleGroup.group.id,
                        name: ruleGroup.group.name,
                        date,
                        decoded: checks,
                    },
                ];
            }
        });
        return parses;
    });
}
function initDecoder(logger) {
    return __awaiter(this, void 0, void 0, function* () {
        RULES = yield (0, rules_1.getRules)();
        return {
            decode,
        };
    });
}
exports.initDecoder = initDecoder;
