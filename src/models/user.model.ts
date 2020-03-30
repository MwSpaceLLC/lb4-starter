// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';

import {UserCredentials} from './user-credentials.model';
import {UserTokens} from './user-tokens.model';

@model({
    settings: {
        hiddenProperties: ['roles'],
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
        type: 'date',
        required: false,
    })
    emailVerified: Date;

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
        type: 'date',
        required: false,
    })
    phoneVerified: Date;

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

    @hasMany(() => UserTokens)
    userTokens: UserTokens[];

    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {
    // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
