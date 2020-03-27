import {environment} from "../../environments/environment";

const twilio = require('twilio');

export class TwilioServices {

    private client: any;
    private sender: any;

    constructor(SENDER = null) {

        this.client = new twilio(
            environment.twilio.accountSid,
            environment.twilio.authToken
        );

        this.sender = SENDER
    }

    /**
     * @param to
     * @param body
     */
    sendMessage(to: string, body: string) {
        this.client.messages.create({
            body: body,
            to: to,
            from: this.sender ? this.sender : environment.twilio.sender
        })
            .then((message: object) => {

                console.log(message);
                return true;

            }, (error: object) => {

                console.log(error);
                return false;

            });
    }

}
