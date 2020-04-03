import {environment} from "../../environments/environment";
import Mail from "nodemailer/lib/mailer";
import {SentMessageInfo} from "nodemailer";
import nodemailer from "nodemailer";
import ejs from "ejs";

export interface MailClient<T = string> {

    to(...to: Array<string>): MailService;

    subject(subject: string): MailService;

    view(view: string): MailService;

    with(params: object): MailService;

    // TODO: Markdown
    // markdown(view: string): MailClient;

    // prepare(subject: string, template: string, params: object): MailClient;

    send(): Promise<SentMessageInfo>;
}

export class MailService implements MailClient {

    private transporter: Mail;

    private html: string;
    private toMail: Array<string>;
    private paramsHtml: object = {};
    private subjectMail: string;

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

        this.paramsHtml = params

        return this;
    };

    /**
     * @param template
     */
    public view(template: string): MailService {

        try {
            //
            // // Assign subject at Email
            // this.subject = subject;

            // Assign Email Template
            this.html = ejs.renderFile(`${__dirname}/../../emails/views/${template}.ejs`, this.paramsHtml, {}, function (err, html) {

                if (err) {
                    console.log(err);
                    throw new Error(err.message);
                }

                return html;
            });

            return this;

        } catch (e) {

            throw new Error(e.message)
        }
    }

    /**
     * Send mail -_-'
     */
    async send(): Promise<SentMessageInfo> {

        if (!this.toMail) {
            throw new Error('toMail is required before send()')
        }

        try {

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
     * TODO: Test new ejs Implement
     * Replace Native element in template
     * @param template
     * @param params
     */
    // private replaceTemplateKeys(template: string, params: object): void {
    //     // params.forEach((element: object) => {
    //     //     for (const [key, value] of Object.entries(element)) {
    //     //
    //     //         if (!template.includes(`{{${key}}}`)) {
    //     //             throw new Error(`Email ts template not include a local var named: {{${key}}}`)
    //     //         }
    //     //
    //     //         this.html = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
    //     //     }
    //     // });
    // }

}
