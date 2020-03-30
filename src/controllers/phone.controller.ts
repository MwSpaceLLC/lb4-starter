import {HttpErrors, get, param} from "@loopback/rest";
import {model, repository} from "@loopback/repository";
import {OPERATION_SECURITY_SPEC} from "../utils/security-spec";
import {authenticate} from "@loopback/authentication";
import {inject} from "@loopback/core";
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {UserRepository} from "../repositories";
import {TwilioClient} from "../services/twilio/client-service";
import {TwilioServiceBindings} from "../keys";
import {PhoneCodeConfirmSchema, TwilioResponseSchema} from "./specs/twilio-controller.specs";

@model()
export class PhoneController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(TwilioServiceBindings.TWILIO_CLIENT)
        public twilioClient: TwilioClient,
    ) {
    }

    /**
     |--------------------------------------------------------------------------
     | Phone Verification // TODO: complete this
     |--------------------------------------------------------------------------
     |
     | Here is where you can Register Phone Verification for your application.
     |
     */
    @get('/phone/verification', {
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '200': {
                description: 'SMS AUTHMSG',
                content: {
                    'application/json': {
                        schema: TwilioResponseSchema,
                    },
                },
            },
        },
    })
    @authenticate('jwt')
    async sendAuthMsg(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile
    ): Promise<void | object> {

        const user = await this.userRepository.findById(
            currentUserProfile[securityId]
        );

        if (!user.phone)
            throw new HttpErrors.UnprocessableEntity(
                `User.phone number is required`,
            );

        return this.twilioClient.sendAuthCode(user.phone)

        // return this.twilioClient.send(user.phone, '✔ Confirm Node Sms', 'lb4-starter')
    }

    /**
     |--------------------------------------------------------------------------
     | Phone Confirmation TODO: write this also model, repo and relation
     |--------------------------------------------------------------------------
     |
     | Here is where you can Register Phone Confirmation for your application.
     |
     */
    @get('/phone/confirmation/{code}', {
        // 'x-visibility': 'undocumented',
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '200': {
                description: 'User Confirmation Phone Token',
                content: {
                    'application/json': {
                        schema: PhoneCodeConfirmSchema,
                    },
                },
            },
        },
    })
    @authenticate('jwt')
    async emailConfirmation(
        @param.path.string('code') code: string,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile
    ): Promise<object> {


        // Phone token confirm has valid
        return {
            code: false,
            // hash: find
        }

    }

}
