import {ServerWalletItApplication} from './application';
import {ApplicationConfig} from '@loopback/core';
import {environment} from "./environments/environment";

export {ServerWalletItApplication};

export async function main(options: ApplicationConfig = {}) {

    if (environment.production) {
        console.log('ENV IN PROD')
    }

    const app = new ServerWalletItApplication(options);
    await app.boot();
    await app.start();

    const url = app.restServer.url;

    console.log(`©2020 IBM ~ All rights reserved | ${environment.app_name} lb4 => serve at ${url}`);

    return app;
}
