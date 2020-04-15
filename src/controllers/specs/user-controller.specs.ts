// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export const UserProfileSchema = {
    description: 'User Profile Schema',
    type: 'object',
    required: ['id'],
    properties: {
        "id": {type: 'string'},
        "email": {type: 'string'},
        "emailVerified": {type: 'string'},
        "name": {type: 'string'},
        "agreement": {type: 'boolean'},
        "phoneCode": {type: 'string'},
        "phone": {type: 'string'},
        "phoneVerified": {type: 'string'},
        "status": {type: 'string'},
        // "roles": {type: 'array', items: []}
    },
};

const LoginSchema = {
    description: 'Login Schema',
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
        remember: {
            type: 'boolean',
        },
    },
};

export const LoginRequestBody = {
    description: 'Login RequestBody Request Body',
    required: true,
    content: {
        'application/json': {schema: LoginSchema},
    },
};

const RegisterSchema = {
    type: 'object',
    required: ['email', 'password'],
    properties: {
        name: {
            type: 'string',
        },
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
        },
    },
};

export const RegisterRequestBody = {
    description: 'The input of login function',
    required: true,
    content: {
        'application/json': {schema: RegisterSchema},
    },
};

export const UserTokenResponseSchema = {
    description: 'User Token Response Schema',
    type: 'object',
    properties: {
        "token": {type: 'string'},
        "id": {type: 'string'},
        "email": {type: 'string'},
        "name": {type: 'string'},
        "agreement": {type: 'boolean'},
        "phone": {type: 'string'},
        "status": {type: 'string'},
        "roles": {type: 'array', items: []}
    },
};
