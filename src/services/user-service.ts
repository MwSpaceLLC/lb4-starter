// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {HttpErrors} from '@loopback/rest';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {User} from '../models/user.model';
import {UserService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {repository} from '@loopback/repository';
import {PasswordHasher} from './hash.password.bcryptjs';
import {PasswordHasherBindings} from '../keys';
import {inject} from '@loopback/context';

export class MyUserService implements UserService<User, Credentials> {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasher,
    ) {
    }

    async verifyCredentials(credentials: Credentials): Promise<User> {

        const invalidCredentialsError = 'Autenticazione non valida';

        // console.info('');
        // console.info('credentials: ');
        // console.log(credentials)

        const foundUser = await this.userRepository.findOne({
            where: {email: credentials.email},
        });

        if (!foundUser) {
            throw new HttpErrors.Unauthorized(invalidCredentialsError);
        }

        // console.info('');
        // console.info('foundUser: ');
        // console.log(foundUser)

        const credentialsFound = await this.userRepository.findCredentials(
            foundUser.id,
        );

        // console.info('');
        // console.log('credentialsFound: ');
        // console.log(credentialsFound)

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

    convertToUserProfile(user: User): UserProfile {
        return {
            [securityId]: user.id,
            name: user.name,
            id: user.id,
            roles: user.roles,
        };
    }

    uniqueId(min: number, max: number) {
        return Math.floor(
            Math.random() * (max - min) + min
        )
    }
}
