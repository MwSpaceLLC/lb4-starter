import {environment} from "../../environments/environment";
import {HttpErrors} from "@loopback/rest";

const twilio = require('twilio');

export interface TwilioClient<T = string> {
    sendMessage(to: T, body: T, SENDER?: null): Promise<void | object>;

    sendAuthCode(to: T): Promise<void | object>;

    authCode(): string;
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
    async sendMessage(to: string, body: string, SENDER = null): Promise<void | object> {
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
     * @param to
     */
    async sendAuthCode(to: string): Promise<void | object> {
        return this.client.messages.create({
            body: this.authCode() + ' è il codice di verifica per ' + environment.appName,
            to: to,
            from: 'AUTHMSG'
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

    authCode() {
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
