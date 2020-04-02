import {environment} from "../../environments/environment";
import {HttpErrors} from "@loopback/rest";

const twilio = require('twilio');

export interface TwilioClient<T = string> {
    send(to: T, body: T, SENDER?: string | null): Promise<void | object>;

    sendAuthCode(to: T, code?: T): Promise<void | object>;

    randCode(): string;
}

export class TwilioServices implements TwilioClient {

    private client: { messages: { create: (arg0: { body: string; to: string; from: string | null; }) => Promise<object>; }; };

    constructor() {
        this.client = new twilio(
            environment.twilio.accountSid,
            environment.twilio.authToken
        );
    }

    /**
     * @param to
     * @param body
     * @param SENDER
     */
    async send(to: string, body: string, SENDER = null): Promise<void | object> {
        return this.client.messages.create({
            body: body,
            to: to,
            from: SENDER ? SENDER : environment.twilio.sender
        })
            .then(message => {

                return message;

            }, error => {

                console.log(error);

                throw new HttpErrors.HttpError(
                    `Twilio error | status: ${error.status} | message: ${error.message}`,
                );

            });
    }


    /**
     * @param to string
     * @param code string
     */
    async sendAuthCode(to: string, code?: string): Promise<void | object> {
        return this.client.messages.create({
            body: (code ? code : this.randCode()) + ' è il codice di verifica per ' + environment.appName,
            to: to,
            from: 'AUTHMSG'
        })
            .then(message => {
                return message;
            });
    }

    randCode() {
        return Math.floor(
            Math.random() * (11 - 99) + 99
        ) + ' ' + Math.floor(
            Math.random() * (11 - 99) + 99
        ) + ' ' + Math.floor(
            Math.random() * (11 - 99) + 99
        ) + ' ' + Math.floor(
            Math.random() * (11 - 99) + 99
        );
    }

}
