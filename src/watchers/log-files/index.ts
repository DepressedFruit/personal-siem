import { exec } from 'child_process';
import { createReadStream, fstat, watch, existsSync } from 'fs';
// import { watch } from 'fs/promises';
import readline from 'readline';

import dayjs, { Dayjs } from 'dayjs';

import { LogFilePluginProps } from '../../@types/watchers/log-files/configOptions';

const DEBOUNCE_COUNTDOWN: number = 50; // In miliseconds.

/*
 * Credit: https://stackoverflow.com/questions/12453057/node-js-count-the-number-of-lines-in-a-file
 */
async function countFileLines(file: string): Promise<number> {
    return new Promise((resolve, reject) => {
        let count: number = 0;
        let i: number;

        createReadStream(file).on('data', (chunk: Buffer) => {
            for(i = 0; i < chunk.length; i++) {
                if('\n'.charCodeAt(0) === chunk[i]) count++;
            }
        }).on('end', () => resolve(count));
    });
}

/*
 * Could be better. Would appreciate if some help.
 */
export default async function({
    logger,
    options,
    next,
}: LogFilePluginProps): Promise<void> {
    const { file } = options;
    try {
        if(!existsSync(file)) throw new Error(`${file} does not exist.`);

        let currentLines: number = await countFileLines(file);
        let timeoutDebounce: ReturnType<typeof setTimeout> | null;
        watch(file, (event): void => {
            if(!timeoutDebounce) {
                /*
                 * Time out (50ms) so that the watcher does not report a double event.
                 * Happens on: Windows
                 */
                timeoutDebounce = setTimeout((): void => {

                    const fileInterface = readline.createInterface({
                        input: createReadStream(file),
                    });

                    let lineNo: number = 0;
                    fileInterface.on('line', (line: string) => {
                        lineNo++;
                        if(lineNo > currentLines) {
                            currentLines = lineNo;
                            // console.log(line);
                            next({
                                watcher: 'log-files',
                                description: line,
                                data: {},
                            });
                        }
                    });

                    timeoutDebounce = null

                }, DEBOUNCE_COUNTDOWN);
            }
        });
    } catch(err) {
        logger.error(`${err}`);
    }
};