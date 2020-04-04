// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Mail from "nodemailer/lib/mailer";
import nodemailer, {SentMessageInfo} from "nodemailer";
import fs from "fs";
import uniqid from "uniqid";

export interface MailClient<T = string> {

    to(...to: Array<string>): MailService;

    subject(subject: string): MailService;

    view(view: string): MailService;

    with(params: object): MailService;

    send(): Promise<SentMessageInfo>;

    token(prefix?: string): string;
}

export class MailService implements MailClient {

    private readonly transporter: Mail;

    private html: string;
    private markdown: string;
    private toMail: Array<string>;
    private parameters: Object;
    private subjectMail: string;

    private readonly views: string;

    constructor() {

        if (process.env.MAIL_TRANSPORT === 'sendmail') {
            this.transporter = nodemailer.createTransport({
                sendmail: true,

                // TODO: Test if nodemailer retrive auto path
                // newline: 'unix',
                // path: '/usr/sbin/sendmail'
            });
        } else {
            this.transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: parseInt(process.env.MAIL_PORT ?? '2525'),
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.MAIL_USERNAME, // ethereal user
                    pass: process.env.MAIL_PASSWORD // ethereal password
                }
            });
        }


        this.views = `${__dirname}/../../../emails`;
    }

    /**
     * @param subject
     */
    subject(subject: string): MailService {
        this.subjectMail = subject;

        return this;
    }

    /**
     * @param to
     */
    to(...to: string[]): MailService {
        this.toMail = to;

        return this;
    }

    with(params: object): MailService {
        this.parameters = params;

        return this;
    };

    /**
     * @param markdown string
     */
    public view(markdown: string): MailService {
        this.markdown = markdown;

        return this;
    }

    /**
     * Send mail -_-'
     */
    async send(): Promise<SentMessageInfo> {

        if (!this.toMail) {
            throw new Error('to is required before send()')
        }

        this.html = this.replaceKeyFromMdFile();

        try {

            // Send email and try compile Node Mailer
            return await this.transporter.sendMail({
                from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`, // sender address
                to: this.toMail.toString(), // list of receivers
                subject: this.subjectMail ? this.subjectMail : 'Mail from lb4-starter', // Subject line
                html: this.html ? this.replaceKeyFromMdFile() : '<b>Hello by lb4-starter!</b> ' // html body
            });

        } catch (e) {

            throw new Error(e.message)
        }
    }

    /**
     * TODO: Test md Implement
     * Replace Native element in template
     */
    private replaceKeyFromMdFile(): string {

        // commonmark mode
        const mit = require('markdown-it')('commonmark');

        // Try to read main html content for md
        const main = fs.readFileSync(`${this.views}/layouts/main.html`, 'utf8');

        // Try to read first md file
        let md = fs.readFileSync(`${this.views}/${this.markdown}.md`, 'utf8');

        // Try to replace vars in markdown and main
        Object.entries(this.parameters).forEach(([key, value]) => {

            md = md.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });

        // Try to replace content and place new md
        const complete = main.replace(new RegExp(`{{MD_TEMPLATE_CONTENT}}`, 'g'), mit.render(md));

        // Try to replace content and place new md
        return complete.replace(new RegExp(`{{APP_NAME}}`, 'g'), process.env.APP_NAME ?? 'lb4-starter');

    }

    token(prefix?: string): string {
        return uniqid(prefix) +
            uniqid('') +
            uniqid('') +
            uniqid('') +
            uniqid('');
    }

}
