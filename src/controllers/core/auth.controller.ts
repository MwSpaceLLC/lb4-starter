// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {repository} from '@loopback/repository';
import {validateCredentials} from '../../services/core/validator';

import {
    post,
    HttpErrors, param,
} from '@loopback/rest';

import {User} from '../../models';
import {UserRepository} from '../../repositories';

import {inject} from '@loopback/core';
import {TokenService} from '@loopback/authentication';

import {UserTokenResponseSchema} from '../specs/user-controller.specs';

import {Credentials} from '../../repositories';
import {PasswordHasher} from '../../services/core/hash.password.bcryptjs';

import {
    TokenServiceBindings,
    PasswordHasherBindings,
    UserServiceBindings,
} from '../../utils/keys';

import {UserTokenResponse} from "./interfaces/user.interface";
import {CustomUserService} from "../../services/core/user-service";
import _ from 'lodash'

export class AuthController {
    constructor(
        @repository(UserRepository)
        public userRepository: UserRepository,
        @inject(PasswordHasherBindings.PASSWORD_HASHER)
        public passwordHasher: PasswordHasher,
        @inject(TokenServiceBindings.TOKEN_SERVICE)
        public jwtService: TokenService,
        @inject(UserServiceBindings.USER_SERVICE)
        public userService: CustomUserService<User, Credentials>,
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
    @post('/auth/signup', {
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
        @param.query.string('name', {required: true}) name: string,
        @param.query.string('email', {required: true}) email: string,
        @param.query.string('password', {required: true}) password: string,
        @param.query.string('phone', {required: true}) phone: string,
        @param.query.boolean('agreement', {required: true}) agreement: boolean,
        @param.query.string('plan') plan: string,
    ): Promise<UserTokenResponse> {

        // ensure a valid email value and password value
        validateCredentials({
            email: email,
            password: password,
            phone: phone
        });

        try {

            // create the new user
            const user = await this.userRepository.create({
                email: email,
                name: name,
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

            // TODO: perform your action | Send verification
            await this.userService.sendVerificationMail(user);

            // A new response minimal object
            return _.assign({
                token: await this.jwtService.generateToken(
                    this.userService.convertToUserProfile(user)
                )
            }, user)

        } catch (error) {
            // MongoError 11000 duplicate key
            if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
                throw new HttpErrors.Conflict('Email address already taken');
            } else if (error.code === 11000 && error.errmsg.includes('index: uniquePhone')) {
                throw new HttpErrors.Conflict('Phone number already taken');
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
        const user = await this.userService.verifyCredentials({
            email: email,
            password: password
        });

        // A new response minimal object
        return _.assign({
            token: await this.jwtService.generateToken(
                this.userService.convertToUserProfile(user)
            )
        }, user)

    }

}
