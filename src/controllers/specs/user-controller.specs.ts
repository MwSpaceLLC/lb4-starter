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

const CredentialsSchema = {
    description: 'Credentials Schema',
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
    description: 'Credentials Request Body',
    required: true,
    content: {
        'application/json': {schema: CredentialsSchema},
    },
};

const RegisterSchema = {
    description: 'Register Schema',
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
    description: 'Register Request Body',
    content: {
        'application/json': {schema: RegisterSchema},
    },
};

export const UserTokenResponseSchema = {
    description: 'User Token Response Schema',
    type: 'object',
    properties: {
        "userProfile": {
            type: 'object',
            properties: {
                "id": {type: 'string'},
                "email": {type: 'string'},
                "name": {type: 'string'},
                "agreement": {type: 'boolean'},
                // "roles": {type: 'array', items: []}
            },
        },
        "token": {
            type: 'object',
            properties: {
                "value": {type: 'string'},
                "expiredAt": {type: 'string'}
            }
        }
    },
};
