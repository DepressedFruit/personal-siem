import { hostname } from 'os';
import { join } from 'path';
import dayjs, { Dayjs } from 'dayjs';

import { getRules, checkRules, defaultDateParse } from './rules';

import { LoggingFunction } from '../@types/lib/logging';
import { Decoded, DecodedGroup, DecoderRules } from '../@types/lib/decoder';

let RULES: DecoderRules[] = [];

async function decode(description: string): Promise<DecodedGroup[]> {
    let parses: DecodedGroup[] = [];
    RULES.forEach((ruleGroup: DecoderRules) => {

        let date: Dayjs = dayjs();
        let parsedLog: RegExpExecArray | null = null;
        let logWithoutDate: string = description;
        /*
         * Prematch dates.
         */
        if(ruleGroup.group.dateMatch) {
            const dateRegex: RegExp = new RegExp(ruleGroup.group.dateMatch);
            parsedLog = dateRegex.exec(description);

            const dateGroupId: number = ruleGroup.group.dateGroupId || 1; // Get group index for date.
            if(parsedLog) {
                date = dayjs(parsedLog[dateGroupId]);

                const [,splitLog] = logWithoutDate.split(parsedLog[0]);
                logWithoutDate = splitLog.trim();
            }
        }

        if(!parsedLog) {
            parsedLog = defaultDateParse(description);
            if(parsedLog) {
                date = dayjs(parsedLog[1]); // Date string will always be in group 1.
                const [,splitLog] = description.split(parsedLog[1]);
                logWithoutDate = splitLog.trim();
            }
        }

        const checks: Decoded[] = checkRules(ruleGroup, logWithoutDate);
        if(checks.length > 0) {
            parses = [
                ...parses,
                {
                    group: ruleGroup.group.id,
                    name: ruleGroup.group.name,
                    date,
                    decoded: checks,
                },
            ];
        }
    });

    return parses;
}

export async function initDecoder(
    logger: LoggingFunction
) {
    RULES = await getRules();

    return {
        decode,
    };
}