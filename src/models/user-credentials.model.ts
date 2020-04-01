// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property} from '@loopback/repository';

@model()
export class UserCredentials extends Entity {
    @property({
        type: 'string',
        id: true
    })
    id: string;

    @property({
        type: 'string',
        required: true,
    })
    password: string;

    @property({
        type: 'string',
        required: true,
        mongodb: {dataType: 'ObjectID'},
    })
    userId: string;

    constructor(data?: Partial<UserCredentials>) {
        super(data);
    }
}

export interface UserCredentialsRelations {
    // describe navigational properties here
}

export type UserCredentialsWithRelations = UserCredentials &
    UserCredentialsRelations;
