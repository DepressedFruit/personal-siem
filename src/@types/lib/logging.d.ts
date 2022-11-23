export type LoggingType = 'info' | 'debug' | 'warning' | 'error';

export interface LoggingFunction {
    info: Function,
    debug: Function,
    warn: Function,
    error: Function,
};