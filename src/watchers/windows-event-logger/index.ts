import { exec, ExecException } from 'child_process';
import dayjs, { Dayjs } from 'dayjs';

import { WindowsEventLoggerProps } from '../../@types/watchers/windows-event-logger/configOptions';

/*
 * Problem with this method:
 * A Powershell window will be called out everytime the interval is up.
 * 
 * Need:
 * A better method to actually parse the Event Viewer files.
 */
export default async function({
    logger,
    options,
    next,
}: WindowsEventLoggerProps): Promise<void> {

    const { interval, application } = options;

    setInterval((): void => {
        const currentTime: Dayjs = dayjs();
        const threeSecondsAgo: Dayjs = currentTime.subtract(interval, 'second');
        const timeFormat: string = 'MM/DD/YYYY HH:mm:ss';

        const powershellCommand: string[] = [
            'Get-EventLog',
            '-Before',
            `'${currentTime.format(timeFormat)}'`,
            '-after',
            `'${threeSecondsAgo.format(timeFormat)}'`,
            '-LogName',
            `'${application}'`,
            '|',
            'ConvertTo-Json',
        ];
        // const command: string = `powershell.exe -WindowStyle hidden -command \"Get-EventLog -Before '${currentTime.format(timeFormat)}' -after '${threeSecondsAgo.format(timeFormat)}' -LogName '${application}' | ConvertTo-Json\"`;
        exec(
            powershellCommand.join(' '),
            {'shell': 'powershell.exe'},
            (
                error: ExecException | null,
                stdout: string | null,
                stderr: string | null
            ) => {
                if(error) {
                    logger.error(`exec error: ${error}`);
                    return;
                }

                if(stderr) {
                    logger.error(`exec stderr: ${stderr}`);
                    return;
                }

                if(
                    stdout
                    && stdout !== null
                ) {
                    const cmdOutput = JSON.parse(stdout);

                    next({
                        watcher: 'windows-event-logger',
                        description: cmdOutput.data?.Message?.toString(),
                        data: JSON.parse(stdout),
                    });
                    return;
                }
            },
        );
    }, interval * 1000);
};