// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {DefaultCrudRepository} from '@loopback/repository';
import {UserTokens, UserTokensRelations} from '../../models';
import {MongoDataSource} from '../../datasources';
import {inject} from '@loopback/core';

export class UserTokensRepository extends DefaultCrudRepository<
  UserTokens,
  typeof UserTokens.prototype.id,
  UserTokensRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(UserTokens, dataSource);
  }
}
