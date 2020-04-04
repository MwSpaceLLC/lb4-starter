// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ServerLb4Starter} from './application';
import {ApplicationConfig} from '@loopback/core';
import {application, env} from "./utils/environment";

export {ServerLb4Starter};

export function envjs() {

    /**
     |--------------------------------------------------------------------------
     | Bootstrap Env Config: TODO: Set your environments var
     |--------------------------------------------------------------------------
     | Here is where you can set your environment vars for your application.
     |
     */ env(process.env.APP_ENV ?? 'local'); // local, prod ?? set env.local or env.prod

}

/**
 * @param options
 */
export async function main(options: ApplicationConfig = {}) {

    /**
     |--------------------------------------------------------------------------
     | Start the ServerLb4Starter Application
     |--------------------------------------------------------------------------
     | Here is where you can Start ServerLb4Starter application.
     |
     */ envjs();

    return application(options);
}
