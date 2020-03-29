import {environment} from "../../environments/environment";
import Mail from "nodemailer/lib/mailer";
import {SentMessageInfo} from "nodemailer";
import nodemailer from "nodemailer";

export interface MailClient<T = string> {
    prepare(subject: string, template: string, params: Array<object>): MailClient;

    send(...to: string[]): Promise<SentMessageInfo>;
}

export class MailService implements MailClient {

    private transporter: Mail;

    private html: string;
    private subject: string;

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
    }

    /**
     * @param subject
     * @param template
     * @param params
     */
    public prepare(subject: string, template: string, params: Array<object>): MailClient {
        try {
            const email = require('./emails/' + template);

            this.subject = subject;

            //TODO: Refactor. Only for test (key val replace)
            this.replaceTemplateKeys(email.HTML, params);

            return this;

        } catch (e) {

            throw new Error(e.message)
        }
    }

    /**
     * @param to
     */
    async send(...to: string[]): Promise<SentMessageInfo> {

        if (!this.subject) {
            throw new Error('subject mail transport is required')
        }
        if (!this.html) {
            throw new Error('prepare function() is required before send()')
        }

        try {

            return await this.transporter.sendMail({
                from: `"${environment.MAIL_FROM_NAME}" <${environment.MAIL_FROM_ADDRESS}>`, // sender address
                to: to.toString(), // list of receivers
                subject: this.subject, // Subject line
                html: this.html // html body
            });

        } catch (e) {

            throw new Error(e.message)
        }
    }

    /**
     * Replace Native element in template
     * @param template
     * @param params
     */
    private replaceTemplateKeys(template: string, params: Array<object>): void {
        params.forEach((element: object) => {
            for (const [key, value] of Object.entries(element)) {

                if (!template.includes(`{{${key}}}`)) {
                    throw new Error(`Email ts template not include a local var named: {{${key}}}`)
                }

                this.html = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
            }
        });
    }

}
