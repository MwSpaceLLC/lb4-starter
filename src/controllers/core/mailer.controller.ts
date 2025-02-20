// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {HttpErrors, get, param, post} from "@loopback/rest";
import {model, repository} from "@loopback/repository";
import {OPERATION_SECURITY_SPEC} from "../../utils/security-spec";
import {authenticate} from "@loopback/authentication";
import {inject} from "@loopback/core";
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {UserRepository} from "../../repositories";
import {MailServiceBindings, TwilioServiceBindings} from "../../utils/keys";
import {MailerResponseSchema} from "../specs/mailer-controller.specs";
import {MailClient} from "../../services/vendor/nodemailer/mail-service";
import {SentMessageInfo} from "nodemailer";

import {EmailTokenConfirmSchema} from '../specs/mailer-controller.specs'

@model()
export class MailerController {
    constructor(
        @repository(UserRepository)
        public userRepository: UserRepository,
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

        const token = this.mailClient.token();

        // TODO: Change with your server or perform your action
        const link = `http://localhost/confirm/email/${token}`;

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

        // New Construct mail
        const mail =
            this.mailClient
                .to(user.email)
                .subject('✔ Confirm e-mail address')
                .view('confirm')
                .with({
                    link: link,
                    user: user.email
                });

        return mail.send();

    }

    /**
     |--------------------------------------------------------------------------
     | Email Confirmation
     |--------------------------------------------------------------------------
     |
     | Here is where you can Register Confirmation for your application.
     |
     */
    @post('/email/confirmation', {
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
        @param.query.string('token', {required: true}) token: string,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile
    ): Promise<object> {

        const find = await this.userRepository.userTokens(
            currentUserProfile[securityId]
        ).find({where: {hash: token}});

        if (!find.length) {
            throw new HttpErrors.UnprocessableEntity(
                `Token invalid or expired`,
            );
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
