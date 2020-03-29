// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// TODO(jannyHou): This should be moved to @loopback/authentication
import {User} from "../../models";

export const UserProfileSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {type: 'string'},
        name: {type: 'string'},
        email: {type: 'string'},
    },
};

// TODO(jannyHou): This is a workaround to manually
// describe the request body of 'Users/login'.
// We should either create a Credential model, or
// infer the spec from User model

const CredentialsSchema = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string',
            format: 'email',
        },
        password: {
            type: 'string',
            minLength: 8,
        },
    },
};

export const CredentialsRequestBody = {
    description: 'The input of login function',
    required: true,
    content: {
        'application/json': {schema: CredentialsSchema},
    },
};

const RegisterSchema = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        email: {
            type: 'string',
            format: 'email',
        },
        password: {
            type: 'string',
            minLength: 8,
        },
        agreement: {
            type: 'boolean',
            default: true,
        },
    },
};

export const RegisterRequestBody = {
    description: 'The input of register function',
    content: {
        'application/json': {schema: RegisterSchema},
    },
};

export const UserTokenResponseSchema = {
    type: 'object',
    properties: {
        'userProfile': {type: 'object'},
        'token': {
            type: 'object',
            properties: {
                'value': {type: 'string'},
                'expiredAt': {type: 'string'}
            }
        }
    }
};
