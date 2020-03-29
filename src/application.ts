// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AuthenticationComponent} from '@loopback/authentication';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';

import {
    ApplicationConfig,
    createBindingFromClass,
} from '@loopback/core';

import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';

import {
    RestExplorerBindings,
    RestExplorerComponent,
} from '@loopback/rest-explorer';

import path from 'path';
import {ServiceMixin} from '@loopback/service-proxy';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';

import {
    MailServiceBindings,
    PasswordHasherBindings,
    TokenServiceBindings,
    TokenServiceConstants, TwilioServiceBindings,
    UserServiceBindings,
} from './keys';

import {MyAuthenticationSequence} from './sequence';
import {BcryptHasher} from './services/hash.password.bcryptjs';
import {JWTService} from './services/jwt-service';
import {MyUserService} from './services/user-service';
import {environment} from "./environments/environment";
import {TwilioServices} from "./services/twilio/client-service";
import {MailService} from "./services/nodemailer/mail-service";

export class ServerWalletItApplication extends BootMixin(
    ServiceMixin(RepositoryMixin(RestApplication)),
) {
    constructor(options: ApplicationConfig = {}) {
        super(options);

        // Set config from env file
        this.api({
            openapi: '3.0.0',
            info: {title: environment.appName, version: environment.version},
            paths: {},
            servers: [{url: '/'}]
        });

        this.setUpBindings();

        // Elementi relativi al componente di autenticazione del binding
        this.component(AuthenticationComponent);
        this.component(AuthorizationComponent);

        // autenticazione
        this.add(createBindingFromClass(JWTAuthenticationStrategy));

        this.sequence(MyAuthenticationSequence);

        // Set up default home page
        this.static('/', path.join(__dirname, '../public'));

        // Customize @loopback/rest-explorer configuration here
        if (environment.apiExplorer) {
            this.configure(RestExplorerBindings.COMPONENT).to({
                path: environment.apiExplorerPath,
                useSelfHostedSpec: true,
            });
            this.component(RestExplorerComponent);
        }

        this.projectRoot = __dirname;

        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }


    setUpBindings(): void {

        this.bind(TokenServiceBindings.TOKEN_SECRET).to(
            TokenServiceConstants.TOKEN_SECRET_VALUE,
        );

        this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
            TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
        );

        this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

        // // Bind bcrypt hash services
        this.bind(PasswordHasherBindings.ROUNDS).to(10);
        this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

        this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);

        this.customBinding();

    }

    private customBinding() {
        /**
         |--------------------------------------------------------------------------
         | Custom Binding Value
         |------------------------------------------------------------------------*/
        this.bind(TwilioServiceBindings.TWILIO_CLIENT).toClass(TwilioServices);
        this.bind(MailServiceBindings.MAIL_CLIENT).toClass(MailService);
    }

    async start() {
        // Use `databaseSeeding` flag to control if products/users should be pre
        // populated into the database. Its value is default to `true`.
        if (this.options.databaseSeeding !== false) {
            await this.migrateSchema();
        }
        return super.start();
    }
}
