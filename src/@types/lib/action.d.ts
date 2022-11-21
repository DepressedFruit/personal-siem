import { Dayjs } from 'dayjs';

import { LoggingFunction, loggingFunction } from './logging';
import { Decoded, DecodedGroup } from './decoder';

export interface Action {
    name: string,
    action: string,
    enabled: boolean,
    level?: number,
    options?: Object<Record<string, any>> | null | undefined,
};

export interface ActionObj {
    action: Action,
    call: Function,
}
export interface ActionProps {
    hostname: string,
    full_log: string,
    origin: Object | string
    groups: DecodedGroups[]
    logger: LoggingFunction,
};

export interface ProcessActionProps {
    action: ActionObj,
    hostname: string,
    full_log,
    origin: Object | string,
    group: DecodedGroup,
    logger: LoggingFunction,
}

export interface ActionPluginProps extends ProcessActionProps {
    action: Action,
    group: {
        id: number,
        name: string,
    },
    decoded: Decoded,
}