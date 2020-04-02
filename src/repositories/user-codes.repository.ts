import {DefaultCrudRepository} from '@loopback/repository';
import {UserCodes, UserCodesRelations} from '../models';
import {MongoDataSource} from '../datasources';
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
