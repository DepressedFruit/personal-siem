import { Dayjs } from 'dayjs';

import { loggingFunction } from './logging';
import { Group } from './group';

export interface DecoderNextProps {
    watcher: string,
    description: string,
    data: Object | string,
}
export interface DecoderRules {
    group: Group,
    rules: Rule[],
};

export interface Rule {
    id: number,
    name: string,
    description: string,
    level: number,
    decoder: {
        regex: string,
        variables?: string | null | undefined,
    },
};

export interface Decoded {
    id: number,
    date?: Dayjs | null | undefined,
    name: string,
    description: string,
    level: number,
    decoded: Object,
};

export interface DecodedGroup {
    group: number,
    name: string,
    decoded: Decoded[],
    date?: Dayjs | null | undefined,
};