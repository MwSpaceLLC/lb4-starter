// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
    inject,
    lifeCycleObserver,
    LifeCycleObserver,
    ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';

// import config from './mongo.datasource.config.json';

@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource
    implements LifeCycleObserver {
    static dataSourceName = 'mongo';

    constructor(
        // @inject('datasources.config.mongo', {optional: true})
        // dsConfig: object = config,
    ) {
        super({
            "name": process.env.DB_NAME,
            "connector": process.env.DB_CONNECTOR,
            "url": process.env.DB_URL,
            "host": process.env.DB_HOST,
            "port": process.env.DB_PORT,
            "user": process.env.DB_USERNAME,
            "password": process.env.DB_PASSWORD,
            "database": process.env.DB_DATABASE,
            "useNewUrlParser": true
        });
    }

    /**
     * Start the datasource when application is started
     */
    start(): ValueOrPromise<void> {
        // Add your logic here to be invoked when the application is started
    }

    /**
     * Disconnect the datasource when application is stopped. This allows the
     * application to be shut down gracefully.
     */
    stop(): ValueOrPromise<void> {
        return super.disconnect();
    }
}
