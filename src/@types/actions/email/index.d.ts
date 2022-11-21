import { Dayjs } from 'dayjs';
import { Action, ActionPluginProps } from '../../lib/action';

export interface EmailAction extends Action {
    options: EmailActionOptions,
}

export interface EmailActionPluginProps extends ActionPluginProps {
    action: EmailAction,
}

export interface EmailActionOptions {
    smtp: {
        user: string,
        password: string,
        host: string,
        port?: number,
        use_tls: boolean,
    },
    subject: string,
    from: string,
    to: string,
}

export enum EmailActionSupportedVariables {
    HOSTNAME = '%hostname%',
    ID = '%rule_id%',
    DATE = '%rule_date%',
    NAME = '%rule_name%',
    DESCRIPTION = '%rule_description%',
    LEVEL = '%rule_level%',
}