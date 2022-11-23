import { existsSync, writeFile, mkdirSync } from 'fs';
import { appendFile } from 'fs/promises';
import { join } from 'path';

import dayjs, { Dayjs } from 'dayjs';

import { ConfigMode } from '../@types/lib/config';
import { LoggingFunction, LoggingType } from '../@types/lib/logging';

const INFO = console.info;
const DEBUG = console.debug;
const WARN = console.warn;
const ERROR = console.error;

export default async function(
    mode: string,
    prefix: string | null = null,
): Promise<LoggingFunction> {
    try {
        const LOG_DIR = join(
            __dirname,
            '../',
            '../',
            'logs',
        );

        const LOG_FILE = join(
            __dirname,
            '../',
            '../',
            'logs',
            `${mode}.log`,
        );

        if(!existsSync(LOG_DIR)) mkdirSync(LOG_DIR);

        if(!existsSync(LOG_FILE)) writeFile(LOG_FILE, 'LOG FILE CREATED', { flag: 'wx' }, () => {});

        async function appendToLog(type: LoggingType, log: string): Promise<string> {
            const currentDateTime: Dayjs = dayjs();

            let fullLog: string = `${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [${type.toUpperCase()}]`;
            if(prefix) fullLog += ` [${prefix}]`;
            fullLog += ` ${log}`;

            await appendFile(LOG_FILE, `\n${fullLog}`);
            return fullLog;
        }

        return {
            info: (log: string): void => {
                appendToLog('info', log).then(fullLog => INFO(fullLog));
            },
            debug: (log: string): void => {
                appendToLog('debug', log).then(fullLog => DEBUG(fullLog));
            },
            warn: (log: string): void => {
                appendToLog('warning', log).then(fullLog => WARN(fullLog));
            },
            error: (log: string): void => {
                appendToLog('error', log).then(fullLog => ERROR(fullLog));
            },
        };
    } catch(err) {
        const currentDateTime: Dayjs = dayjs();
        ERROR(`${err}`);
        return {
            info: (log: string): void => INFO(`${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [INFO] ${log}`),
            debug: (log: string): void => DEBUG(`${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [DEBUG] ${log}`),
            warn: (log: string): void => WARN(`${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [WARNING] ${log}`),
            error: (log: string): void => ERROR(`${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [ERROR] ${log}`),
        };
    }
}