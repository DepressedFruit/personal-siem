import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { EmailActionOptions } from '../../@types/actions/email';

export default function(options: EmailActionOptions['smtp']): nodemailer.Transporter<SMTPTransport.SentMessageInfo> {
    const {
        host,
        port,
        user,
        password: pass,
        use_tls: secure,
    } = options;

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
            user,
            pass,
        }
    });
}