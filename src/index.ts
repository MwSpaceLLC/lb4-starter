// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ServerWalletItApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

import moment from 'moment-timezone';

import {env} from "./utils/environment";

export {ServerWalletItApplication};

export async function main(options: ApplicationConfig = {}) {

    // Bootstrap Env Config
    env(''); // local, prod ?? set env.local or env.prod

    options.rest.host = process.env.REST_HOST ?? undefined;
    options.rest.port = process.env.REST_PORT ?? 3000;
    options.rest.openApiSpec.disabled = process.env.REST_API_SPEC !== 'true';

    moment().tz(process.env.APP_TIME_ZONE ?? 'Europe/Rome').format();
    moment.locale(process.env.APP_LANG);
    moment().format(process.env.APP_DATE_FORMAT);

    const app = new ServerWalletItApplication(options);
    await app.boot();
    await app.start();

    const url = app.restServer.url;

    console.log(`©2020 IBM ~ All rights reserved | ${process.env.APP_NAME} lb4 => serve at ${url}`);

    return app;
}
