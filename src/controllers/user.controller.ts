// Copyright IBM Corp. 2019,2020. All Rights Reserved.

import {repository} from '@loopback/repository';

import {
    get,
    HttpErrors,
} from '@loopback/rest';

import {User} from '../models';
import {UserRepository} from '../repositories';

import {inject} from '@loopback/core';
import {
    authenticate,
    TokenService,
    UserService,
} from '@loopback/authentication';

import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {UserProfileSchema} from './specs/user-controller.specs';

import {Credentials} from '../repositories';
import {PasswordHasher} from '../services/core/hash.password.bcryptjs';

import {
    TokenServiceBindings,
    PasswordHasherBindings,
    UserServiceBindings, TwilioServiceBindings,
} from '../utils/keys';

import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {TwilioClientInterface} from "../services/vendor/twilio/twilio-service";

export class UserController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasher,
        @inject(TokenServiceBindings.TOKEN_SERVICE)
        public jwtService: TokenService,
        @inject(UserServiceBindings.USER_SERVICE)
        public userService: UserService<User, Credentials>,
        @inject(TwilioServiceBindings.TWILIO_CLIENT)
        public twilioClient: TwilioClientInterface,
    ) {
    }

    /**
     |--------------------------------------------------------------------------
     | Fetch User Logged In
     |--------------------------------------------------------------------------
     |
     | Here is where you can findById web users for your application.
     |
     */
    @get('/users/me', {
        // 'x-visibility': 'undocumented',
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '200': {
                description: 'The current user profile',
                content: {
                    'application/json': {
                        schema: UserProfileSchema,
                    },
                },
            },
        },
    })
    @authenticate('jwt')
    async printCurrentUser(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
    ): Promise<User> {

        try {

            return await this.userRepository.findById(
                currentUserProfile[securityId]
            );

        } catch (e) {
            throw new HttpErrors.Unauthorized(
                `User Not found in the system`,
            );

        }
    }

}
