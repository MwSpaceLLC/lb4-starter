// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property} from '@loopback/repository';

@model()
export class UserTokens extends Entity {
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
    hash: string;

    @property({
        type: 'string',
    })
    userId?: string;

    constructor(data?: Partial<UserTokens>) {
        super(data);
    }
}

export interface UserTokensRelations {
    // describe navigational properties here
}

export type UserTokensWithRelations = UserTokens & UserTokensRelations;
