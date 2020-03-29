import {HttpErrors, get, param} from "@loopback/rest";
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
import {EmailTokenConfirmSchema} from './specs/mailer-controller.specs'
import uniqid from "uniqid";

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
        // 'x-visibility': 'undocumented',
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


        const token = uniqid('token') + uniqid('') + uniqid('') + uniqid('') + uniqid('')

        return this.mailClient.prepare(
            '✔ Confirm e-mail address',
            'confirm',
            [
                {link: `${environment.host}/email/confirmation/${token}`}
            ]
        ).send(user.email)

    }

    /**
     |--------------------------------------------------------------------------
     | Email Confirmation
     |--------------------------------------------------------------------------
     |
     | Here is where you can Register Confirmation for your application.
     |
     */
    @get('/email/confirmation/{token}', {
        // 'x-visibility': 'undocumented',
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '200': {
                description: 'User Confirmation Email Token',
                content: {
                    'application/json': {
                        schema: EmailTokenConfirmSchema,
                    },
                },
            },
        },
    })
    @authenticate('jwt')
    async emailConfirmation(
        @param.path.string('token') userId: string,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile
    ): Promise<object> {

        const user = await this.userRepository.findById(
            currentUserProfile[securityId]
        );

        console.log(user);

        return {
            success: true
        }

    }

}
