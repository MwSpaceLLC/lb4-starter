// import {inject} from '@loopback/context';

import {getModelSchemaRef, HttpErrors, post, get, requestBody, put, param} from "@loopback/rest";
import {validateCredentials} from "../../services/validator";
import _ from "lodash";
import {NewUserRequest} from "../user.controller";
import {model} from "@loopback/repository";
import {OPERATION_SECURITY_SPEC} from "../../utils/security-spec";
import {User} from "../../models";
import {authenticate} from "@loopback/authentication";
import {authorize} from "@loopback/authorization";
import {basicAuthorization} from "../../services/basic.authorizor";
import {inject} from "@loopback/core";
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';

@model()
export class TwilioController {
    constructor() {
    }

    /**
     |--------------------------------------------------------------------------
     | Twilio Management
     |--------------------------------------------------------------------------
     |
     | Here is where you can Register web users for your application.
     |
     */

    @post('/twilio/test/msg', {
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '200': {
                description: 'Twilio AUTHMSG',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                token: {
                                    sid: 'string',
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    @authenticate('jwt')
    async sendAuthMsg(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
        @requestBody(
            {
                description: 'Send AUTHMSG to User.phoneNumber',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                numberPhone: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            }
        ) numberPhone: string,
    ): Promise<any> {

        console.log(currentUserProfile);
        console.log(numberPhone);

        return {
            sid: 'ciao'
        }
    }

}
