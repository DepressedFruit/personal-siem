import { Dayjs } from 'dayjs';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import SMTP from './smtp';

import { EmailAction, EmailActionOptions, EmailActionPluginProps, EmailActionSupportedVariables } from '../../@types/actions/email';

export default async function({
    hostname,
    action,
    decoded,
    group,
    logger,
}: EmailActionPluginProps): Promise<void> {
    const {
        smtp,
        subject,
        from,
        to,
    }: EmailActionOptions = action.options;
    const variables: Map<EmailActionSupportedVariables, any> = converObjectToVariables(hostname, decoded);
    const newSubject: string = replaceVariables(variables, subject);

    const client = SMTP(smtp);
    const mailOptions: Mail.Options = {
        from,
        to,
        subject: newSubject,
        text: `
        Personal SIEM Alert\n
        Hostname: ${hostname}\n
        Rule ID: ${decoded.id}\n
        Rule Name: ${decoded.name}\n
        Rule Level: ${decoded.level}\n
        Rule Description: ${decoded.description}\n
        ${JSON.stringify(decoded.decoded, null, 4)}
        `,
    };

    client.sendMail(mailOptions, (err, info: SMTPTransport.SentMessageInfo) => {
        if(err) logger.error(`${err}`);
    });
}

function converObjectToVariables(
    hostname: string,
    decoded: EmailActionPluginProps['decoded']
): Map<EmailActionSupportedVariables, any> {
    const {
        id,
        date,
        name,
        description,
        level,
    } = decoded;

    const mappedVariables = new Map<EmailActionSupportedVariables, any>();
    mappedVariables.set(EmailActionSupportedVariables.HOSTNAME, hostname);
    mappedVariables.set(EmailActionSupportedVariables.ID, id);
    mappedVariables.set(EmailActionSupportedVariables.NAME, name);
    mappedVariables.set(EmailActionSupportedVariables.DESCRIPTION, description);
    mappedVariables.set(EmailActionSupportedVariables.DATE, date);
    mappedVariables.set(EmailActionSupportedVariables.LEVEL, level);

    return mappedVariables;
}

function replaceVariables(
    variables: Map<EmailActionSupportedVariables, any>,
    subject: string,
): string {
    const regex: RegExp = new RegExp(Array.from(variables.keys()).join('|'), 'gi');
    return subject.replace(regex, (match) => variables.get(match as EmailActionSupportedVariables));
}

