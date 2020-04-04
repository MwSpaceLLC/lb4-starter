// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {HttpErrors, get, param, post} from "@loopback/rest";
import {model, repository} from "@loopback/repository";
import {OPERATION_SECURITY_SPEC} from "../../utils/security-spec";
import {authenticate} from "@loopback/authentication";
import {inject} from "@loopback/core";
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {UserRepository} from "../../repositories";
import {TwilioClientInterface} from "../../services/vendor/twilio/twilio-service";
import {TwilioServiceBindings} from "../../utils/keys";

import {
    PhoneCodeConfirmSchema,
    TwilioResponseSchema
} from "../specs/twilio-controller.specs";


@model()
// TODO: Refactor many function in this class (clear code)
export class PhoneController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(TwilioServiceBindings.TWILIO_CLIENT)
        public twilioClient: TwilioClientInterface,
    ) {
    }

    /**
     |--------------------------------------------------------------------------
     | Phone Verification // TODO: complete this??
     |--------------------------------------------------------------------------
     |
     | Here is where you can Register Phone Verification for your application.
     |
     */
    @get('/phone/verification', {
        // 'x-visibility': 'undocumented',
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
    async userPhoneVerification(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile
    ): Promise<void | object> {

        // Select User ID from Auth => Json Web Token
        const uid = currentUserProfile[securityId];

        // Random code for the User
        const rndCode = this.twilioClient.randCode();

        // Select User Repository
        const userSelect = await this.userRepository.findById(uid);

        if (!userSelect.phone)
            throw new HttpErrors.UnprocessableEntity(
                `User phone number is required`,
            );

        // TODO: U also update or change this for perform.
        // For us, This is fasted method to check also 1 code
        // And bypass other many Errors in sql schema Relation
        // Delete all Codes in User Repository Relation
        await this.userRepository.userCodes(uid).delete();

        // Add Code To User Repository Relation
        await this.userRepository.userCodes(uid)
            .create({
                random: rndCode.replace(/\s+/g, '')
            });

        try {

            // New Construct sms
            const sms =
                this.twilioClient
                    .from('AUTHMSG')
                    .to(userSelect.phone)
                    .content(`${rndCode} is your confirmation code for ${process.env.APP_NAME}`);

            return await sms.send();


        } catch (error) {
            // Twilio catch number verification
            if (error.code === 21211) {

                throw new HttpErrors.UnprocessableEntity(
                    `The phone number is not valid`,
                );
            } else {
                throw error;
            }

        }


    }

    /**
     |--------------------------------------------------------------------------
     | Phone Confirmation TODO: vrite phone confirmation
     |--------------------------------------------------------------------------
     |
     | Here is where you can Register Phone Confirmation for your application.
     |
     */
    @post('/phone/confirmation', {
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
    async userPhoneConfirmation(
        @param.query.string('code', {required: true}) code: string,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile
    ): Promise<object> {

        // Select User ID from Auth => Json Web Token
        const uid = currentUserProfile[securityId];

        // Select User Repository
        const userSelect = await this.userRepository.findById(uid);

        if (!userSelect.phone)
            throw new HttpErrors.UnprocessableEntity(
                `User phone number is required`,
            );

        // Find Phone Codes User Code Repository
        const codeVerify = await this.userRepository.userCodes(uid)
            .find({
                where: {
                    random: code.replace(/\s+/g, '')
                }
            });

        // verification phone code is incorrect
        if (!codeVerify.length) {

            throw new HttpErrors.UnprocessableEntity(
                `The verification phone code is incorrect`,
            );
        }

        // Update User Repository Phone Verified+status
        await this.userRepository.updateById(uid,
            {
                status: 'enable',
                phoneVerified: new Date()
            }
        );

        // Phone code confirm has valid
        return {
            userProfile: userSelect,
            code: codeVerify
        }

    }

}
