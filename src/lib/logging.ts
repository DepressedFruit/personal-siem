import { existsSync, writeFile, mkdirSync } from 'fs';
import { appendFile } from 'fs/promises';
import { join } from 'path';

import dayjs, { Dayjs } from 'dayjs';

import { ConfigMode } from '../@types/lib/config';
import { LoggingFunction, LoggingType } from '../@types/lib/logging';

export default async function(mode: ConfigMode): Promise<LoggingFunction> {
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

        if(!existsSync(LOG_DIR)) {
            mkdirSync(LOG_DIR);
        }

        if(!existsSync(LOG_FILE)) {
            // Create file.
            writeFile(LOG_FILE, 'LOG FILE CREATED\n', { flag: 'wx' }, () => {});
        }

        async function appendToLog(type: LoggingType, log: string): Promise<void> {
            const currentDateTime: Dayjs = dayjs();
            const fullLog: string = `${currentDateTime.format('MM/DD/YYYY HH:mm:ss')} [${type.toUpperCase()}] ${log}`;
            await appendFile(LOG_FILE, `${fullLog}\n`);
            console.log(fullLog);
        }

        return {
            info: (log: string): void => {
                appendToLog('info', log).then(() => {});
            },
            debug: (log: string): void => {
                appendToLog('debug', log).then(() => {});
            },
            warning: (log: string): void => {
                appendToLog('warning', log).then(() => {});
            },
            error: (log: string): void => {
                appendToLog('error', log).then(() => {});
            },
        };
    } catch(err) {
        console.error(`${err}`);
        return {
            info: (log: string): void => {},
            debug: (log: string): void => {},
            warning: (log: string): void => {},
            error: (log: string): void => {},
        };
    }
}