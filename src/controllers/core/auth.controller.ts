// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {repository} from '@loopback/repository';
import {validateCredentials} from '../../services/core/validator';

import {
    post,
    HttpErrors,
    requestBody,
} from '@loopback/rest';

import {User} from '../../models';
import {UserRepository} from '../../repositories';

import {inject} from '@loopback/core';
import {TokenService} from '@loopback/authentication';

import {LoginRequestBody, RegisterRequestBody, UserTokenResponseSchema} from '../specs/user-controller.specs';

import {Credentials} from '../../repositories';
import {PasswordHasher} from '../../services/core/hash.password.bcryptjs';

import {
    TokenServiceBindings,
    PasswordHasherBindings,
    UserServiceBindings,
} from '../../utils/keys';

import {LoginUserRequest, CreateUserRequest, UserTokenResponse} from "./interfaces/user.interface";
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
        //TODO: Open request for force this param also in post data
        @requestBody(RegisterRequestBody)
            createUserRequest: CreateUserRequest,
        // @param.path.string('name', {required: true}) name: string,
        // @param.query.string('email', {required: true}) email: string,
        // @param.query.string('password', {required: true}) password: string,
        // @param.query.boolean('agreement', {required: true}) agreement: boolean,
    ): Promise<UserTokenResponse> {

        // ensure a valid email value and password value
        validateCredentials({
            email: createUserRequest.email,
            password: createUserRequest.password
        });

        try {

            // create the new user
            const user = await this.userRepository.create({
                email: createUserRequest.email,
                name: createUserRequest.name,
                agreement: createUserRequest.agreement,
                status: 'pending',
                roles: ['customer']
            });

            // set the password HASHING
            await this.userRepository
                .userCredentials(user.id)
                .create({
                    password: await this.passwordHasher.hashPassword(
                        createUserRequest.password,
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
        @requestBody(LoginRequestBody)
            loginUserRequest: LoginUserRequest,
    ): Promise<UserTokenResponse> {

        // ensure the user exists, and the password is correct
        const user = await this.userService.verifyCredentials({
            email: loginUserRequest.email,
            password: loginUserRequest.password
        });

        // TODO: perform action
        if (loginUserRequest.remember) {
            // Do staff
        }

        // A new response minimal object
        return _.assign({
            token: await this.jwtService.generateToken(
                this.userService.convertToUserProfile(user)
            )
        }, user)

    }

}
