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
    call: (ActionPluginProps) => Promise<void>,
}
export interface ActionProps {
    hostname: string,
    full_log: string,
    origin: Object | string
    groups: DecodedGroups[],
};

export interface ProcessActionProps {
    action: ActionObj,
    hostname: string,
    full_log: string,
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