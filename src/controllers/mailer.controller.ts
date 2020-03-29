import {HttpErrors, get} from "@loopback/rest";
import {model, repository} from "@loopback/repository";
import {OPERATION_SECURITY_SPEC} from "../utils/security-spec";
import {authenticate} from "@loopback/authentication";
import {inject} from "@loopback/core";
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {UserRepository} from "../repositories";
import {MailServiceBindings, TwilioServiceBindings} from "../keys";
import {MailerResponseSchema} from "./specs/mailer-controller.specs";
import {MailClient} from "../services/nodemailer/mail-service";
import {SentMessageInfo} from "nodemailer";
import {environment} from "../environments/environment";

import uniqid from "uniqid";
import {url} from "inspector";

@model()
export class MailerController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(MailServiceBindings.MAIL_CLIENT)
        public mailClient: MailClient,
    ) {
    }

    /**
     |--------------------------------------------------------------------------
     | Node Mailer Management
     |--------------------------------------------------------------------------
     |
     | Here is where you can Register Node Mailer for your application.
     |
     */
    @get('/email/verification', {
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '200': {
                description: 'Mail Confirmation',
                content: {
                    'application/json': {
                        schema: MailerResponseSchema,
                    },
                },
            },
        },
    })
    @authenticate('jwt')
    async sendConfirmation(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile
    ): Promise<SentMessageInfo> {

        const user = await this.userRepository.findById(
            currentUserProfile[securityId]
        );

        if (!user.email)
            throw new HttpErrors.UnprocessableEntity(
                `User.email is required`,
            );

        // Send email (TEMPLATE LOCATE IN (src/services/nodemailer/emails/*) WITHOUT .TS)
        // return this.mailClient.send(
        //     '✔ Confirm e-mail address | ' + environment.appName,
        //     'confirm',
        //     [{
        //         link: uniqid('mail-token')
        //     }],
        //     user.email,
        // )

        return this.mailClient.prepare(
            '✔ Confirm e-mail address',
            'confirm',
            [
                {link: url() + uniqid('mail-token')}
            ]
        ).send(user.email, user.email, user.email)

    }

}
