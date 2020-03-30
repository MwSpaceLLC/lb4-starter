// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Getter, inject} from '@loopback/core';
import {MongoDataSource} from '../datasources';
import {
    DefaultCrudRepository,
    HasOneRepositoryFactory,
    repository,
    HasManyRepositoryFactory
} from '@loopback/repository';

import {User, UserCredentials, UserTokens} from '../models';

import {UserCredentialsRepository} from './user-credentials.repository';
import {UserTokensRepository} from './user-tokens.repository';

export type Credentials = {
    email: string;
    password: string;
};

export type RegisterCredentials = {
    email: string;
    password: string;
    agreement?: boolean;
};

export class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id> {

    public readonly userCredentials: HasOneRepositoryFactory<UserCredentials, typeof User.prototype.id>;

    public readonly userTokens: HasManyRepositoryFactory<UserTokens, typeof User.prototype.id>;

    constructor(
        @inject('datasources.mongo') dataSource: MongoDataSource,
        @repository.getter('UserCredentialsRepository')
        protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
        @repository.getter('UserTokensRepository')
        protected userTokensRepositoryGetter: Getter<UserTokensRepository>,
    ) {
        super(User, dataSource);

        this.userTokens = this.createHasManyRepositoryFactoryFor('userTokens', userTokensRepositoryGetter);
        this.registerInclusionResolver('userTokens', this.userTokens.inclusionResolver);

        this.userCredentials = this.createHasOneRepositoryFactoryFor('userCredentials', userCredentialsRepositoryGetter);
        this.registerInclusionResolver('userCredentials', this.userCredentials.inclusionResolver);
    }

    async findCredentials(
        userId: typeof User.prototype.id,
    ): Promise<UserCredentials | undefined> {
        try {

            return await this.userCredentials(userId).get();
        } catch (err) {
            if (err.code === 'ENTITY_NOT_FOUND') {
                return undefined;
            }
            throw err;
        }
    }

}
