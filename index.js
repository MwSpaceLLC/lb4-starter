// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// Server must init whit APP_ENV
const fs = require('fs')
const application = require('./dist');

module.exports = application;

if (!process.env.NODE_ENV) {
    if (!fs.existsSync(`/.env`)) {
        process.env.NODE_ENV = 'local';
    }
}

if (require.main === module) {

    // Config the application
    const config = {
        rest: {
            port: +(process.env.PORT || 8080),
            host: process.env.HOST,
            // The `gracePeriodForClose` provides a graceful close for http/https
            // servers with keep-alive clients. The default value is `Infinity`
            // (don't force-close). If you want to immediately destroy all sockets
            // upon stop, set its value to `0`.
            // See https://www.npmjs.com/package/stoppable
            gracePeriodForClose: 5000, // 5 seconds
            openApiSpec: {
                // useful when used with OpenAPI-to-GraphQL to locate your application
                setServersFromRequest: true,
            },
        },
    };

    // Run the application
    application.main(config).catch(err => {
        console.error('Cannot start the application.', err);
        process.exit(1);
    });
}
