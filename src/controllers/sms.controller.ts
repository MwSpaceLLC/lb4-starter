import {HttpErrors, get} from "@loopback/rest";
import {model, repository} from "@loopback/repository";
import {OPERATION_SECURITY_SPEC} from "../utils/security-spec";
import {authenticate} from "@loopback/authentication";
import {inject} from "@loopback/core";
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {UserRepository} from "../repositories";
import {TwilioClient} from "../services/twilio/client-service";
import {TwilioServiceBindings} from "../keys";
import {TwilioResponseSchema} from "./specs/twilio-controller.specs";

@model()
export class SmsController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(TwilioServiceBindings.TWILIO_CLIENT)
        public twilioClient: TwilioClient,
    ) {
    }

    /**
     |--------------------------------------------------------------------------
     | SMS Management
     |--------------------------------------------------------------------------
     |
     | Here is where you can Register SMS Manager for your application.
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

}
