import {
    inject,
    lifeCycleObserver,
    LifeCycleObserver,
    ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';
import config from './mongo.datasource.config.json';

@lifeCycleObserver('datasource')
export class MongoDataSource extends juggler.DataSource
    implements LifeCycleObserver {
    static dataSourceName = 'mongo';

    constructor(
        @inject('datasources.config.mongo', {optional: true})
            dsConfig: object = config,
    ) {

        //Database set from URI
        if (process.env.DB_URL !== undefined) {
            super({
                "name": process.env.DB_NAME,
                "connector": process.env.DB_CONNECTOR,
                "url": process.env.DB_URL,
                "useNewUrlParser": true
            });

            //Database set from heroku https://www.mlab.com/databases
        } else if (process.env.MONGODB_URI !== undefined) {
            super({
                "name": process.env.DB_NAME,
                "connector": process.env.DB_CONNECTOR,
                "url": process.env.MONGODB_URI,
                "useNewUrlParser": true
            });

            //Database not set by Uri
        } else {
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
