// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property, hasOne} from '@loopback/repository';

import {UserCredentials} from './user-credentials.model';

@model({
    settings: {
        indexes: {
            uniqueEmail: {
                keys: {
                    email: 1,
                },
                options: {
                    unique: true,
                },
            },
        },
    },
})
export class User extends Entity {
    @property({
        type: 'string',
        id: true,
        mongodb: {dataType: 'ObjectID'},
    })
    id: string;

    @property({
        type: 'string',
        required: true,
    })
    email: string;

    @property({
        type: 'string',
        required: true,
    })
    name: string;

    @property({
        type: 'boolean',
        required: true,
    })
    agreement?: boolean;

    @property({
        type: 'date',
        required: false,
    })
    email_verified: string;

    @property({
        type: 'string',
        required: false,
    })
    phoneCode: string;

    @property({
        type: 'string',
        required: false,
    })
    phone: string;

    @property({
        type: 'string',
        required: false,
    })
    gate: string;

    @property({
        type: 'string',
        required: false,
    })
    status: string;

    @hasOne(() => UserCredentials)
    userCredentials: UserCredentials;

    @property({
        type: 'array',
        itemType: 'string',
    })
    roles?: string[];

    constructor(data?: Partial<User>) {
        super(data);
    }
}
