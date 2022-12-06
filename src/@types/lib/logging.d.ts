export type LoggingType = 'info' | 'debug' | 'warning' | 'error';

export interface LoggingFunction {
    info: (string) => void,
    debug: (string) => void,
    warn: (string) => void,
    error: (string) => void,
};