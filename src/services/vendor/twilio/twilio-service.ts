// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Twilio} from "twilio";
import {HttpErrors, RestBindings} from "@loopback/rest";

/**
 * @important load .env vars for environment status (local,prod,alpha,etc...) */
require('dotenv').config({
    path: `${__dirname}/../../../../${process.env.APP_ENV ? '.env.' + process.env.APP_ENV : '.env'}`
});

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
        try {

            this.client = new Twilio(
                process.env.TWILIO_SID ?? '',
                process.env.TWILIO_TOKEN ?? ''
            );
        } catch (e) {

            throw new HttpErrors.Unauthorized(e);
        }
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

        try {
            return await this.client.messages.create({
                body: this.contentString ? this.contentString : 'Hello from lb4-starter',
                to: this.toPhones.toString(),
                from: this.fromPhones ? this.fromPhones : process.env.TWILIO_SENDER
            });
        } catch (e) {
            throw new HttpErrors.Unauthorized(e);
        }


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
