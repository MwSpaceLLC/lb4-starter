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
    UserServiceBindings,
} from '../keys';
import _ from 'lodash';

import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {environment} from "../environments/environment";
import moment from 'moment';
import {NewUserRequest, UserTokenResponse} from "./interfaces/user.interface";

import uniqid from "uniqid";

export class UserController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasher,
        @inject(TokenServiceBindings.TOKEN_SERVICE)
        public jwtService: TokenService,
        @inject(UserServiceBindings.USER_SERVICE)
        public userService: UserService<User, Credentials>,
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
                throw new HttpErrors.Conflict('Indirizzo email presente nel sistema');
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
        const user = await this.userService.verifyCredentials(credentials);

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

        return this.userRepository.findById(
            currentUserProfile[securityId]
        );
    }

    /**
     |--------------------------------------------------------------------------
     | findById User ID
     |--------------------------------------------------------------------------
     |
     | Here is where you can findById web users for your application.
     |
     */
    // @get('/users/{userId}', {
    //     'x-visibility': 'undocumented',
    //     security: OPERATION_SECURITY_SPEC,
    //     responses: {
    //         '200': {
    //             description: 'User',
    //             content: {
    //                 'application/json': {
    //                     schema: UserProfileSchema,
    //                 },
    //             },
    //         },
    //     },
    // })
    // @authenticate('jwt')
    // @authorize({
    //     allowedRoles: ['admin', 'support', 'customer'],
    //     voters: [basicAuthorization],
    // })
    // async findById(@param.path.string('userId') userId: string): Promise<User> {
    //     return this.userRepository.findById(userId);
    // }

    /**
     |--------------------------------------------------------------------------
     | updateById User ID
     |--------------------------------------------------------------------------
     |
     | Here is where you can updateById web users for your application.
     |
     */
    // @put('/users/{userId}', {
    //     'x-visibility': 'undocumented',
    //     security: OPERATION_SECURITY_SPEC,
    //     responses: {
    //         '200': {
    //             description: 'User',
    //             content: {
    //                 'application/json': {
    //                     schema: {
    //                         'x-ts-type': User,
    //                     },
    //                 },
    //             },
    //         },
    //     },
    // })
    // @authenticate('jwt')
    // async set(
    //     @inject(SecurityBindings.USER)
    //         currentUserProfile: UserProfile,
    //     @param.path.string('userId') userId: string,
    //     @requestBody({description: 'update user'}) user: User,
    // ): Promise<void> {
    //     try {
    //
    //         // Only admin can assign roles
    //         if (!currentUserProfile.roles.includes('admin')) {
    //             delete user.roles;
    //         }
    //
    //         return await this.userRepository.updateById(userId, user);
    //     } catch (e) {
    //         return e;
    //     }
    // }


}
