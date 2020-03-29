import {ServerWalletItApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {environment} from "./environments/environment";
import moment from 'moment-timezone';

export {ServerWalletItApplication};

export async function main(options: ApplicationConfig = {}) {

    if (environment.production) {
        console.log('ENV IN PROD')
    }

    options.rest.host = environment.host || undefined;
    options.rest.port = environment.port || 3000;
    options.rest.openApiSpec.disabled = !environment.openApiSpec;

    moment().tz(environment.TIME_ZONE).format();
    moment.locale(environment.LOCALE);
    moment().format(environment.DATE_FORMAT);

    const app = new ServerWalletItApplication(options);
    await app.boot();
    await app.start();

    const url = app.restServer.url;

    console.log(`©2020 IBM ~ All rights reserved | ${environment.appName} lb4 => serve at ${url}`);

    return app;
}
