import {environment} from "../../environments/environment";

const twilio = require('twilio');

export class TwilioServices {

    private client: any;
    private sender: any;

    constructor(SENDER = null) {

        this.client = new twilio(
            environment.twilio.account_sid,
            environment.twilio.auth_token
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
            from: this.sender ? this.sender : environment.twilio.semder
        })
            .then((message: any) => {

                console.log(message.sid);
                return true;

            }, (error: any) => {

                console.log(error);
                return false;

            });
    }

}
