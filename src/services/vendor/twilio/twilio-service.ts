import {environment} from "../../../environments/environment";
import {Twilio} from "twilio";

export interface TwilioClientInterface<T = string> {

    from(from: string): TwilioServices;

    to(to: string): TwilioServices;

    content(to: string): TwilioServices;

    send(): Promise<void | object>;

    randCode(): string;
}

export class TwilioServices implements TwilioClientInterface {

    private client: Twilio;

    private fromPhones: string;
    private toPhones: string;
    private contentString: string;

    constructor() {
        this.client = new Twilio(
            environment.twilio.accountSid,
            environment.twilio.authToken
        );
    }

    /**
     * @param from
     */
    from(from: string): TwilioServices {
        this.fromPhones = from;
        return this
    }

    /**
     * @param to
     */
    to(to: string): TwilioServices {
        this.toPhones = to;
        return this
    }

    /**
     * @param content
     */
    content(content: string): TwilioServices {
        this.contentString = content;
        return this
    }

    async send(): Promise<void | object> {

        if (!this.toPhones) {
            throw new Error('to is required before send()')
        }

        return this.client.messages.create({
            body: this.contentString ? this.contentString : 'Hello from lb4-starter',
            to: this.toPhones.toString(),
            from: this.fromPhones ? this.fromPhones : environment.twilio.sender
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
