import {environment} from "../../environments/environment";
import Mail from "nodemailer/lib/mailer";
import {SentMessageInfo} from "nodemailer";

const nodemailer = require('nodemailer');

export interface MailClient<T = string> {
    send(subject: string, template: string, ...to: string[]): Promise<SentMessageInfo>;
}

export class MailService implements MailClient {

    private transporter: Mail;
    private info: void;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: environment.MAIL_HOST,
            port: environment.MAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: environment.MAIL_USERNAME, // generated ethereal user
                pass: environment.MAIL_PASSWORD // generated ethereal password
            }
        });
    }

    /**
     * @param subject string
     * @param template string
     * @param to string[]
     */
    async send(subject: string, template: string, ...to: string[]): Promise<SentMessageInfo> {

        try {
            //TODO: Refactor. This only for test
            const email = require('./emails/' + template);

            // return console.log(email.HTML);

            this.info = await this.transporter.sendMail({
                from: `"${environment.MAIL_FROM_NAME}" <${environment.MAIL_FROM_ADDRESS}>`, // sender address
                to: to.toString(), // list of receivers
                subject: subject, // Subject line
                html: email.HTML // html body
            });

            return this.info;

        } catch (e) {
            throw new Error(`HTML TS template not exist in src/services/nodemailer/emails/${template}.ts`)
        }
    }

}
