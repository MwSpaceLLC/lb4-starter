// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/context';
import {PasswordHasher} from './services/hash.password.bcryptjs';
import {TokenService, UserService} from '@loopback/authentication';
import {User} from './models';
import {Credentials} from './repositories';
import {TwilioClientInterface} from "./services/twilio/twilio-service";
import {environment} from "./environments/environment";
import {MailClient} from "./services/nodemailer/mail-service";

export namespace TokenServiceConstants {
    export const TOKEN_SECRET_VALUE = environment.TOKEN_SECRET;
    export const TOKEN_EXPIRES_IN_VALUE = environment.TOKEN_EXPIRES;
}

export namespace TokenServiceBindings {
    export const TOKEN_SECRET = BindingKey.create<string>(
        'authentication.jwt.secret',
    );
    export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
        'authentication.jwt.expires.in.seconds',
    );
    export const TOKEN_SERVICE = BindingKey.create<TokenService>(
        'services.authentication.jwt.tokenservice',
    );
}

export namespace PasswordHasherBindings {
    export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
        'services.hasher',
    );
    export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace UserServiceBindings {
    export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
        'services.user.service',
    );
}


/**
 |--------------------------------------------------------------------------
 | Sdk binding
 |--------------------------------------------------------------------------
 | Here is where you can Register all bindings in app services
 */
export namespace TwilioServiceBindings {
    export const TWILIO_CLIENT = BindingKey.create<TwilioClientInterface>(
        'services.twilio.client',
    );
}

export namespace MailServiceBindings {
    export const MAIL_CLIENT = BindingKey.create<MailClient>(
        'services.nodemailer.client',
    );
}
