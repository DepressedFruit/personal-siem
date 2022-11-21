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
const os_1 = require("os");
const config_1 = require("../lib/config");
const logging_1 = __importDefault(require("../lib/logging"));
const decoder_1 = require("../lib/decoder");
const action_1 = require("../lib/action");
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        const WATCHERS_CONFIG = yield (0, config_1.readConfig)('watchers');
        const LOGGER = yield (0, logging_1.default)('agent');
        LOGGER.info(`Initializing Agent for ${(0, os_1.hostname)()}...`);
        LOGGER.info('Preparing rules...');
        const DECODER = yield (0, decoder_1.initDecoder)(LOGGER);
        LOGGER.info('Preparing Actions...');
        const ACTIONS = yield (0, action_1.action)();
        WATCHERS_CONFIG.forEach((module) => __awaiter(this, void 0, void 0, function* () {
            if (module.enabled) {
                const props = {
                    logger: LOGGER,
                    options: module.options,
                    next: (props) => __awaiter(this, void 0, void 0, function* () {
                        /* const decode: actionProps = await decoder({
                            rules: RULES,
                            logger: LOGGER,
                            ...props,
                        }); */
                        const { description, data } = props;
                        const decode = yield DECODER.decode(description);
                        if (decode.length > 0) {
                            const actionProps = {
                                hostname: `${(0, os_1.hostname)()}`,
                                full_log: description,
                                origin: data,
                                groups: decode,
                                logger: LOGGER,
                            };
                            yield ACTIONS(actionProps);
                        }
                    }),
                };
                try {
                    const WATCHER_MAIN = yield Promise.resolve().then(() => __importStar(require(`../watchers/${module.watcher}`)));
                    LOGGER.info(`Starting Watcher [${module.watcher}] for [${module.name}]`);
                    yield WATCHER_MAIN.default(props);
                }
                catch (error) {
                    LOGGER.error(`${error}`);
                }
            }
        }));
    });
}
exports.default = default_1;
