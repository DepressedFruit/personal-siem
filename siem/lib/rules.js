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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDateParse = exports.checkRules = exports.getRules = void 0;
const path_1 = require("path");
const file_1 = require("./file");
function getRules() {
    return __awaiter(this, void 0, void 0, function* () {
        const rulesDirectory = (0, path_1.join)(__dirname, '../', '../', 'configs', 'rules');
        const ruleGroups = yield (0, file_1.listDirectory)(rulesDirectory);
        let allRules = [];
        for (let i = 0; i < ruleGroups.length; i++) {
            const groupFileDirectory = (0, path_1.join)(rulesDirectory, ruleGroups[i]);
            const groupFileString = yield (0, file_1.read)(groupFileDirectory);
            const parsedGroup = JSON.parse(groupFileString);
            allRules = [
                ...allRules,
                parsedGroup,
            ];
            // allRules = allRules.concat(parsedGroup);
        }
        // Sort by ID in ascending order.
        const sortedRules = allRules.sort((a, b) => a.id - b.id);
        // return allRules;
        return sortedRules;
    });
}
exports.getRules = getRules;
function checkRules(group, log) {
    let parsed = [];
    const { decoders } = group;
    decoders.forEach((decoder) => {
        const { regex: decoderRegex, variables } = decoder.decoder;
        const allVariables = variables === null || variables === void 0 ? void 0 : variables.split(',');
        const regex = new RegExp(decoderRegex);
        const parseRegex = regex.exec(log);
        if (parseRegex) {
            const variableAssociates = {
                id: decoder.id,
                name: decoder.name,
                description: decoder.description,
                level: decoder.level,
                decoded: {},
            };
            allVariables === null || allVariables === void 0 ? void 0 : allVariables.forEach((variable, index) => {
                variableAssociates.decoded[variable] = parseRegex[index + 1];
                variableAssociates.description = variableAssociates.description.replace(`%${variable}%`, parseRegex[index + 1]);
            });
            parsed = [
                ...parsed,
                variableAssociates,
            ];
        }
    });
    return parsed;
}
exports.checkRules = checkRules;
/*
 * Parse Timestamps.
 * OLD:
 * Example: 10/12/2022 22:34:24 [INFO] WAZZUP
 *                              ^Group 8----^
 *
 * NEW:
 * Oct 20 17:56:52 jt-VirtualBox systemd[1]: Activating swap /swapfile...
 * ^Group 1------^ ^Group 2---------------------------------------------^
 * 10/12/2022 22:34:24 [ERROR] Watcher not found.
 * ^Group 1----------^ ^Group 2-----------------^
 */
function defaultDateParse(log) {
    // const LOG_REGEX = /(\w+[\d: ]+.*\d{2}:\d{2}:\d{2})|([0]\d|[1][0-2]\/[0-2]\d|[3][0-1]\/[2][01]|[1][6-9]\d{2}\s[0-1]\d|[2][0-3]\:[0-5]\d{1,2})/g;
    const LOG_REGEX = /(\w+[\d: ]+.*\d{2}:\d{2}:\d{2})[ ](.*)|([0]\d|[1][0-2]\/[0-2]\d|[3][0-1]\/[2][01]|[1][6-9]\d{2}\s[0-1]\d|[2][0-3]\:[0-5]\d{1,2})[ ](.*)/;
    return LOG_REGEX.exec(log);
}
exports.defaultDateParse = defaultDateParse;
