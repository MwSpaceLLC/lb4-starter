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

        const token =
            uniqid('email-') +
            uniqid('') +
            uniqid('') +
            uniqid('') +
            uniqid('');

        // TODO: Change with your server or perform your action
        const link = `http://${environment.endpoint}:${environment.endpointPort}/confirm/email/${token}`;

        // TODO: U also update or change this for perform.
        // For us, This is fasted method to check also 1 code
        // And bypass other many Errors in sql schema Relation
        // Delete all Codes in User Repository Relation
        await this.userRepository.userTokens(currentUserProfile[securityId]).delete();

        await this.userRepository.userTokens(
            currentUserProfile[securityId]
        ).create({
            hash: token
        });

        return this.mailClient.prepare(
            '✔ Confirm e-mail address',
            'confirm',
            [{link: link}]
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
        @param.path.string('token') token: string,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile
    ): Promise<object> {

        const find = await this.userRepository.userTokens(
            currentUserProfile[securityId]
        ).find({where: {hash: token}});

        if (!find.length) {
            return {token: false}
        }

        // Update user model with email verified
        await this.userRepository.updateById(
            currentUserProfile[securityId],
            {
                emailVerified: new Date()
            }
        );

        // Email token confirm has valid
        return {
            token: true,
            hash: find
        }

    }

}
