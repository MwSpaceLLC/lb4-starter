// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export function env(status: string) {

    require('dotenv').config({
        path: `${__dirname}/../environments/${status ? '.env.' + status : '.env'}`
    });
}
