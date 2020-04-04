// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Entity, model, property} from '@loopback/repository';

@model()
export class UserCodes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  random: string;

  @property({
    type: 'string',
  })
  userId?: string;

  constructor(data?: Partial<UserCodes>) {
    super(data);
  }
}

export interface UserCodesRelations {
  // describe navigational properties here
}

export type UserCodesWithRelations = UserCodes & UserCodesRelations;
