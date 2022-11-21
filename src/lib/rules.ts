import { join } from 'path';
import dayjs, { Dayjs } from 'dayjs';

import { listDirectory, read } from './file';

import { Decoded, Decoder, DecoderRules } from '../@types/lib/decoder';

export async function getRules(): Promise<DecoderRules[]> {
    const rulesDirectory: string = join(
        __dirname,
        '../',
        '../',
        'configs',
        'rules',
    );

    const ruleGroups: string[] = await listDirectory(rulesDirectory);
    let allRules: any = [];
    for(let i = 0; i < ruleGroups.length; i++) {
        const groupFileDirectory: string = join(
            rulesDirectory,
            ruleGroups[i],
        );

        const groupFileString: string = await read(groupFileDirectory);
        const parsedGroup: DecoderRules[] = JSON.parse(groupFileString);
        allRules = [
            ...allRules,
            parsedGroup,
        ];
        // allRules = allRules.concat(parsedGroup);
    }

    // Sort by ID in ascending order.
    const sortedRules = allRules.sort((a: any, b: any) => a.id - b.id);

    // return allRules;
    return sortedRules;
}

export function checkRules(group: DecoderRules, log: string): Decoded[] {
    let parsed: Decoded[] = [];
    const { decoders } = group;

    decoders.forEach((decoder: Decoder) => {
        const { regex:decoderRegex, variables } = decoder.decoder;
        const allVariables = variables?.split(',');

        const regex: RegExp = new RegExp(decoderRegex);
        const parseRegex: RegExpExecArray | null = regex.exec(log);
        if(parseRegex) {
            const variableAssociates: any = {
                id: decoder.id,
                name: decoder.name,
                description: decoder.description,
                level: decoder.level,
                decoded: {},
            };

            allVariables?.forEach((variable: string, index: number) => {
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
export function defaultDateParse(log: string): RegExpExecArray | null {
    // const LOG_REGEX = /(\w+[\d: ]+.*\d{2}:\d{2}:\d{2})|([0]\d|[1][0-2]\/[0-2]\d|[3][0-1]\/[2][01]|[1][6-9]\d{2}\s[0-1]\d|[2][0-3]\:[0-5]\d{1,2})/g;
    const LOG_REGEX = /(\w+[\d: ]+.*\d{2}:\d{2}:\d{2})[ ](.*)|([0]\d|[1][0-2]\/[0-2]\d|[3][0-1]\/[2][01]|[1][6-9]\d{2}\s[0-1]\d|[2][0-3]\:[0-5]\d{1,2})[ ](.*)/;
    return LOG_REGEX.exec(log);
}