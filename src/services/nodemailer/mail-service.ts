import {environment} from "../../environments/environment";
import Mail from "nodemailer/lib/mailer";
import {SentMessageInfo} from "nodemailer";
import nodemailer from "nodemailer";
import ejs from "ejs";
import fs from "fs";

export interface MailClient<T = string> {

    to(...to: Array<string>): MailService;

    subject(subject: string): MailService;

    view(view: string): MailService;

    with(params: object): MailService;

    // TODO: Markdown check
    markdown(markdown: string): MailClient;

    send(): Promise<SentMessageInfo>;
}

export class MailService implements MailClient {

    private transporter: Mail;

    private html: string;
    private viewHtml: string;
    private markdownHtml: string;
    private toMail: Array<string>;
    private parameters: object = {};
    private subjectMail: string;

    private views: string;
    private markdowns: string;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: environment.MAIL_HOST,
            port: environment.MAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: environment.MAIL_USERNAME, // ethereal user
                pass: environment.MAIL_PASSWORD // ethereal password
            }
        });

        this.views = `${__dirname}/../../emails/ejs`;
        this.markdowns = `${__dirname}/../../emails/markdown`;

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
     * @param template
     */
    public view(template: string): MailService {
        this.viewHtml = template;

        return this;
    }

    /**
     * @param markdown
     */
    public markdown(markdown: string): MailService {
        this.markdownHtml = markdown;

        return this;
    }

    /**
     * Send mail -_-'
     */
    async send(): Promise<SentMessageInfo> {

        if (!this.toMail) {
            throw new Error('to is required before send()')
        }

        try {

            if (this.viewHtml && !this.markdownHtml) {

                // Assign Email Template
                this.html = ejs
                    .render(
                        fs.readFileSync(
                            `${this.views}/${this.viewHtml}.ejs`, 'utf8'),
                        Object.assign(this.parameters, {
                            appName: environment.appName
                        }));
            }

            if (!this.viewHtml && this.markdownHtml) {
                // Assign Email Template
                this.html = this.replaceKeyFromMdFile();
            }

            // Send email and try compile Node Mailer
            return await this.transporter.sendMail({
                from: `"${environment.MAIL_FROM_NAME}" <${environment.MAIL_FROM_ADDRESS}>`, // sender address
                to: this.toMail.toString(), // list of receivers
                subject: this.subjectMail ? this.subjectMail : 'Mail from lb4-starter', // Subject line
                html: this.html ? this.html : '<b>Hello by lb4-starter!</b> ' // html body
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
        const main = fs.readFileSync(`${this.markdowns}/layouts/main.html`, 'utf8');

        // Try to read first md file
        const md = fs.readFileSync(`${this.markdowns}/${this.markdownHtml}.md`, 'utf8');

        // Try to replace content and place new md
        const complete = main.replace(new RegExp(`{{MD_TEMPLATE_CONTENT}}`, 'g'), mit.render(md));

        // Try to replace content and place new md
        const global = complete.replace(new RegExp(`{{APP_NAME}}`, 'g'), environment.appName);

        // Try to replace vars in markdown and main
        Object.entries(this.parameters).forEach(([key, value]) => {

            this.html = global.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });

        return this.html;

    }

}
