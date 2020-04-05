// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {HttpErrors} from '@loopback/rest';
import {Credentials, UserRepository} from '../../repositories';
import {User} from '../../models';
import {UserService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {repository} from '@loopback/repository';
import {PasswordHasher} from './hash.password.bcryptjs';
import {MailServiceBindings, PasswordHasherBindings} from '../../utils/keys';
import {inject} from '@loopback/context';
import {MailClient} from "../vendor/nodemailer/mail-service";
import {SentMessageInfo} from "nodemailer";

export interface CustomUserService<U, C> extends UserService<User, Credentials> {
    sendVerificationMail(user: U): Promise<SentMessageInfo>;
}

export class MyUserService implements CustomUserService<User, Credentials> {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasher,
        @inject(MailServiceBindings.MAIL_CLIENT)
        public mailClient: MailClient,
    ) {
    }

    /**
     * @param credentials
     */
    async verifyCredentials(credentials: Credentials): Promise<User> {

        const invalidCredentialsError = 'Invalid authentication';

        const foundUser = await this.userRepository.findOne({
            where: {email: credentials.email},
        });

        if (!foundUser) {
            throw new HttpErrors.Unauthorized(invalidCredentialsError);
        }

        const credentialsFound = await this.userRepository.findCredentials(
            foundUser.id,
        );

        if (!credentialsFound) {
            throw new HttpErrors.Unauthorized(invalidCredentialsError);
        }

        const passwordMatched = await this.passwordHasher.comparePassword(
            credentials.password,
            credentialsFound.password,
        );

        if (!passwordMatched) {
            throw new HttpErrors.Unauthorized(invalidCredentialsError);
        }

        return foundUser;
    }

    /**
     * @param user
     */
    convertToUserProfile(user: User): UserProfile {
        return {
            [securityId]: user.id,
            name: user.name,
            id: user.id,
            roles: user.roles,
        };
    }

    /**
     * @param user
     * @param link
     */
    async sendVerificationMail(user: User, link?: string): Promise<SentMessageInfo> {

        const token = this.mailClient.token();

        // TODO: Change with your server or perform your action
        link = link ? link : `${process.env.FRONTEND_URL}/email/confirm/${token}`;

        // TODO: U also update or change this for perform.
        // For us, This is fasted method to check also 1 code
        // And bypass other many Errors in sql schema Relation
        // Delete all Codes in User Repository Relation
        await this.userRepository.userTokens(user.id).delete();

        await this.userRepository.userTokens(user.id).create({
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
                    name: user.name
                });

        return mail.send();
    }
}
