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
const smtp_1 = __importDefault(require("./smtp"));
const email_1 = require("../../@types/actions/email");
function default_1({ hostname, action, decoded, group, logger, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { smtp, subject, from, to, } = action.options;
        const variables = converObjectToVariables(hostname, decoded);
        const newSubject = replaceVariables(variables, subject);
        const client = (0, smtp_1.default)(smtp);
        const mailOptions = {
            from,
            to,
            subject: newSubject,
            text: `
        Personal SIEM Alert\n
        Hostname: ${hostname}\n
        Rule ID: ${decoded.id}\n
        Rule Name: ${decoded.name}\n
        Rule Level: ${decoded.level}\n
        Rule Description: ${decoded.description}\n
        ${JSON.stringify(decoded.decoded, null, 4)}
        `,
        };
        client.sendMail(mailOptions, (err, info) => {
            if (err)
                logger.error(`${err}`);
        });
    });
}
exports.default = default_1;
function converObjectToVariables(hostname, decoded) {
    const { id, date, name, description, level, } = decoded;
    const mappedVariables = new Map();
    mappedVariables.set(email_1.EmailActionSupportedVariables.HOSTNAME, hostname);
    mappedVariables.set(email_1.EmailActionSupportedVariables.ID, id);
    mappedVariables.set(email_1.EmailActionSupportedVariables.NAME, name);
    mappedVariables.set(email_1.EmailActionSupportedVariables.DESCRIPTION, description);
    mappedVariables.set(email_1.EmailActionSupportedVariables.DATE, date);
    mappedVariables.set(email_1.EmailActionSupportedVariables.LEVEL, level);
    return mappedVariables;
}
function replaceVariables(variables, subject) {
    const regex = new RegExp(Array.from(variables.keys()).join('|'), 'gi');
    return subject.replace(regex, (match) => variables.get(match));
}
