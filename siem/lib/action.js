"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.action = void 0;
const path_1 = require("path");
const file_1 = require("./file");
const logging_1 = __importDefault(require("./logging"));
let actions = [];
function getActions() {
    return __awaiter(this, void 0, void 0, function* () {
        const actionsFile = (0, path_1.join)(__dirname, '../', '../', 'configs', 'actions.json');
        const actionsFileString = yield (0, file_1.read)(actionsFile);
        let parsedActions = JSON.parse(actionsFileString);
        parsedActions = parsedActions.filter(action => action.enabled);
        let allActions = [];
        for (let i = 0; i < parsedActions.length; i++) {
            const actionPlugin = yield Promise.resolve().then(() => __importStar(require(`../actions/${parsedActions[i].action}`)));
            allActions = [
                ...allActions,
                {
                    action: parsedActions[i],
                    call: actionPlugin.default,
                }
            ];
        }
        return allActions;
    });
}
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        actions = yield getActions();
        return (actionProps) => __awaiter(this, void 0, void 0, function* () {
            const { hostname, full_log, origin, groups, } = actionProps;
            actions.forEach((actionObj) => __awaiter(this, void 0, void 0, function* () {
                const ACTION_LOGGER = yield (0, logging_1.default)('actions', `Action: ${actionObj.action.name}`);
                groups.forEach((group) => __awaiter(this, void 0, void 0, function* () {
                    const processActionProps = {
                        action: actionObj,
                        hostname,
                        full_log,
                        origin,
                        logger: ACTION_LOGGER,
                        group,
                    };
                    yield processAction(processActionProps);
                }));
            }));
        });
    });
}
exports.action = action;
;
function processAction(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const { action: actionObj, hostname, full_log, origin, logger, group, } = props;
        group.decoded.forEach((decode) => __awaiter(this, void 0, void 0, function* () {
            const minimumLevel = (actionObj.action.level) ? actionObj.action.level : 1;
            if (decode.level >= minimumLevel) {
                const ACTION_MAIN = actionObj.call;
                const pluginProps = {
                    action: actionObj.action,
                    logger,
                    hostname,
                    full_log,
                    origin,
                    group: {
                        id: group.group,
                        name: group.name,
                    },
                    decoded: decode,
                };
                yield ACTION_MAIN(pluginProps);
            }
        }));
    });
}
