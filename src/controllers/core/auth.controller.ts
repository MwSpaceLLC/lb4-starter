// Copyright IBM Corp. 2019,2020. All Rights Reserved.

import {repository} from '@loopback/repository';
import {validateCredentials} from '../../services/core/validator';

import {
    post,
    get,
    requestBody,
    HttpErrors, param,
} from '@loopback/rest';

import {User} from '../../models';
import {UserRepository} from '../../repositories';

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
} from '../specs/user-controller.specs';

import {Credentials} from '../../repositories';
import {PasswordHasher} from '../../services/core/hash.password.bcryptjs';

import {
    TokenServiceBindings,
    PasswordHasherBindings,
    UserServiceBindings, TwilioServiceBindings,
} from '../../utils/keys';
import _ from 'lodash';

import {OPERATION_SECURITY_SPEC} from '../../utils/security-spec';
import {environment} from "../../environments/environment";
import moment from 'moment';
import {NewUserRequest, UserTokenResponse} from "./interfaces/user.interface";

import uniqid from "uniqid";
import {TwilioClientInterface} from "../../services/vendor/twilio/twilio-service";

export class AuthController {
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
    @post('/auth/register', {
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
        // @requestBody(RegisterRequestBody) newUserRequest: NewUserRequest,
        @param.query.string('email', {required: true}) email: string,
        @param.query.string('password', {required: true}) password: string,
        @param.query.string('phone', {required: true}) phone: string,
        @param.query.boolean('agreement', {required: true}) agreement: boolean,
        @param.query.string('plan') plan: string,
    ): Promise<UserTokenResponse> {

        // ensure a valid email value and password value
        validateCredentials({
            email: email,
            password: password
        });

        try {

            // create the new user
            const user = await this.userRepository.create({
                email: email,
                name: uniqid('user-'),
                phone: phone,
                plan: plan,
                agreement: agreement,
                status: 'pending',
                roles: ['customer']
            });

            // set the password HASHING
            await this.userRepository
                .userCredentials(user.id)
                .create({
                    password: await this.passwordHasher.hashPassword(
                        password,
                    )
                });

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
    @post('/auth/login', {
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
        @param.query.string('email', {required: true}) email: string,
        @param.query.string('password', {required: true}) password: string,
    ): Promise<UserTokenResponse> {

        // ensure the user exists, and the password is correct
        let user = await this.userService.verifyCredentials({
            email: email,
            password: password
        });

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

    // Auth Chek User ID TODO: Must Refacto
    private async loginSendAuthMsg(uid: string) {

        const find = await this.userRepository.findById(uid);

        // User have phone register and force oauth
        if (find.phone) {

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
            await this.twilioClient
                .from('AUTHMSG')
                .to(find.phone)
                .content(`${rndCode} is your confirmation code for ${environment.appName}`)
                .send();

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
