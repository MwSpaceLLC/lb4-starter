// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Credentials} from '../repositories';
import isemail from 'isemail';
import {HttpErrors} from '@loopback/rest';

export function validateCredentials(credentials: Credentials) {
    // Validate Email
    if (!isemail.validate(credentials.email)) {
        throw new HttpErrors.UnprocessableEntity('e-mail non valida');
    }

    // Validate Password Length
    if (!credentials.password || credentials.password.length < 8) {
        throw new HttpErrors.UnprocessableEntity(
            'la password deve essere di almeno 8 caratteri',
        );
    }
}
