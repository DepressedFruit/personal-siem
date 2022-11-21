"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
function default_1(options) {
    const { host, port, user, password: pass, use_tls: secure, } = options;
    return nodemailer_1.default.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        }
    });
}
exports.default = default_1;
