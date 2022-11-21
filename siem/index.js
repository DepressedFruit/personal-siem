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
const config_1 = require("./lib/config");
const agent_1 = __importDefault(require("./mode/agent"));
function main(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const SETTINGS_CONFIG = yield (0, config_1.readConfig)('settings');
        switch (SETTINGS_CONFIG.mode) {
            case 'manager':
                // For the future.
                console.log('Manager mode.');
                break;
            case 'pooler':
                // For the future.
                console.log('Pooler mode.');
                break;
            default:
            case 'agent':
                (0, agent_1.default)();
                break;
        }
    });
}
if (require.main === module) {
    const args = process.argv.slice(2);
    main(args);
}
