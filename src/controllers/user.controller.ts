// Copyright IBM Corp. 2019,2020. All Rights Reserved.

import {repository} from '@loopback/repository';
import {validateCredentials} from '../services/validator';

import {
    post,
    get,
    requestBody,
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
import {
    CredentialsRequestBody, RegisterRequestBody,
    UserProfileSchema, UserTokenResponseSchema,
} from './specs/user-controller.specs';

import {Credentials} from '../repositories';
import {PasswordHasher} from '../services/hash.password.bcryptjs';

import {
    TokenServiceBindings,
    PasswordHasherBindings,
    UserServiceBindings, TwilioServiceBindings,
} from '../keys';
import _ from 'lodash';

import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {environment} from "../environments/environment";
import moment from 'moment';
import {NewUserRequest, UserTokenResponse} from "./interfaces/user.interface";

import uniqid from "uniqid";
import {TwilioClientInterface} from "../services/twilio/twilio-service";

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
     | Register User
     |--------------------------------------------------------------------------
     |
     | Here is where you can Register web users for your application.
     |
     */
    @post('/users/register', {
        // 'x-visibility': 'undocumented',
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: UserTokenResponseSchema,
                    },
                },
            },
        },
    })
    async create(
        @requestBody(RegisterRequestBody) newUserRequest: NewUserRequest,
    ): Promise<UserTokenResponse> {

        // Assign defautl property
        newUserRequest.roles = ['customer'];

        // Create Username by default
        newUserRequest.name = uniqid('user-');

        // ensure a valid email value and password value
        validateCredentials(_.pick(newUserRequest, ['email', 'password']));

        // encrypt the password
        const password = await this.passwordHasher.hashPassword(
            newUserRequest.password,
        );

        try {
            // create the new user
            const user = await this.userRepository.create(
                _.omit(newUserRequest, 'password'),
            );

            // set the password
            await this.userRepository
                .userCredentials(user.id)
                .create({password});

            return {
                userProfile: user,
                token: {
                    value: await this.jwtService.generateToken(
                        this.userService.convertToUserProfile(user)
                    ),
                    expiredAt: moment().add(
                        environment.TOKEN_EXPIRES,
                        'seconds'
                    ).toDate()
                }
            };

        } catch (error) {
            // MongoError 11000 duplicate key
            if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
                throw new HttpErrors.Conflict('Indirizzo email già in uso nel sistema');
            } else {
                throw error;
            }
        }
    }

    /**
     |--------------------------------------------------------------------------
     | Authenticate User
     |--------------------------------------------------------------------------
     |
     | Here is where you can Login web users for your application.
     |
     */
    @post('/users/authenticate', {
        // 'x-visibility': 'undocumented',
        responses: {
            '200': {
                description: 'User Token Response',
                content: {
                    'application/json': {
                        schema: UserTokenResponseSchema,
                    },
                },
            },
        },
    })
    async login(
        @requestBody(CredentialsRequestBody) credentials: Credentials,
    ): Promise<UserTokenResponse> {
        // ensure the user exists, and the password is correct
        let user = await this.userService.verifyCredentials(credentials);

        const uid = this.userService.convertToUserProfile(user)[securityId];

        if (environment.loginAuthMsg) {
            await this.loginSendAuthMsg(uid);
            // Force to override user data
            user = await this.userRepository.findById(uid);
        }

        return {
            userProfile: user,
            token: {
                value: await this.jwtService.generateToken(
                    this.userService.convertToUserProfile(user)
                ),
                expiredAt: moment().add(
                    environment.TOKEN_EXPIRES,
                    'seconds'
                ).toDate()
            }
        };
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
            const userProfile = await this.userRepository.findById(
                currentUserProfile[securityId]
            );

            return userProfile;

        } catch (e) {
            throw new HttpErrors.Unauthorized(
                `Utente Non trovato nel sistema`,
            );

        }
    }

    /**
     |--------------------------------------------------------------------------
     | Auth Chek User ID TODO: Must Refactor
     |--------------------------------------------------------------------------
     |
     | Here is where you can Auth Chek web Login users for your application.
     |
     */
    private async loginSendAuthMsg(uid: string) {

        const find = await this.userRepository.findById(uid);

        // User have phone register and force oauth
        if (find.phone && find.phoneCode) {

            // Random code for the User
            const rndCode = this.twilioClient.randCode();

            // TODO: U also update or change this for perform.
            // For us, This is fasted method to check also 1 code
            // And bypass other many Errors in sql schema Relation
            // Delete all Codes in User Repository Relation
            await this.userRepository.userCodes(uid).delete();

            // Add Code To User Repository Relation
            await this.userRepository.userCodes(uid)
                .create({
                    random: rndCode.replace(/\s+/g, '')
                });

            // Re-Send Code To User Phone
            await this.twilioClient.sendAuthCode(
                find.phoneCode + find.phone,
                rndCode
            );

            // Update User Repository statos => OAUTH
            await this.userRepository.updateById(uid,
                {
                    status: 'oauth'
                }
            );
        }

        return find;
    }


}
