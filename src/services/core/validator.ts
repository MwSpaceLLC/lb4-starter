// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Credentials} from '../../repositories';
import isemail from 'isemail';
import {HttpErrors} from '@loopback/rest';

export function validateCredentials(credentials: Credentials) {
    // Validate Email
    if (!isemail.validate(credentials.email)) {
        throw new HttpErrors.UnprocessableEntity('invalid email');
    }

    // Validate Password Length
    if (!credentials.password || credentials.password.length < 8) {
        throw new HttpErrors.UnprocessableEntity(
            'The password must be at least 8 characters long',
        );
    }

    // Validate (MINIMAL) Phone Number
    if (credentials.phone) {
        if (credentials.phone.match('[\\\\!@#$%^&*(),.?":«»[\\]{}A-Za-z|<> -]')) {
            throw new HttpErrors.UnprocessableEntity('The phone must be a valid number');
        }
        if (!credentials.phone.includes('+')) {
            throw new HttpErrors.UnprocessableEntity('The phone require iso code: +1 817 569 8900');
        }
    }

}
