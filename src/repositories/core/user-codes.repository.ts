// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {DefaultCrudRepository} from '@loopback/repository';
import {UserCodes, UserCodesRelations} from '../../models';
import {MongoDataSource} from '../../datasources';
import {inject} from '@loopback/core';

export class UserCodesRepository extends DefaultCrudRepository<
  UserCodes,
  typeof UserCodes.prototype.id,
  UserCodesRelations
> {
  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource,
  ) {
    super(UserCodes, dataSource);
  }
}
