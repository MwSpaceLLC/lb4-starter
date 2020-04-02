import {HttpErrors, get, param, post, requestBody} from "@loopback/rest";
import {model, repository} from "@loopback/repository";
import {OPERATION_SECURITY_SPEC} from "../utils/security-spec";
import {authenticate} from "@loopback/authentication";
import {inject} from "@loopback/core";
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {UserRepository} from "../repositories";
import {TwilioClient} from "../services/twilio/client-service";
import {TwilioServiceBindings} from "../keys";
import {
    PhoneCodeConfirmSchema,
    PhoneRegisterRequestBody,
    PhoneRegistrationSchema,
    TwilioResponseSchema
} from "./specs/twilio-controller.specs";
import {PhoneRegister} from "./interfaces/phone.interface";

@model()
// TODO: Refactor many function in this class (clear code)
export class PhoneController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(TwilioServiceBindings.TWILIO_CLIENT)
        public twilioClient: TwilioClient,
    ) {
    }

    /**
     |--------------------------------------------------------------------------
     | Phone Registration // TODO: complete this
     |--------------------------------------------------------------------------
     |
     | Here is where you can Register Phone Registration for your application.
     |
     */
    @post('/phone/register', {
        // 'x-visibility': 'undocumented',
        security: OPERATION_SECURITY_SPEC,
        responses: {
            '200': {
                description: 'Register Phone to User',
                content: {
                    'application/json': {
                        schema: PhoneRegistrationSchema,
                    },
                },
            },
        },
    })
    @authenticate('jwt')
    async userPhoneRegister(
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile,
        @requestBody(PhoneRegisterRequestBody) phoneRegister: PhoneRegister,
    ): Promise<void | object> {

        // Select User ID from Auth => Json Web Token
        const uid = currentUserProfile[securityId];

        // Random code for the User
        const rndCode = this.twilioClient.randCode();

        // Select User Repository
        const user = this.userRepository;

        // Update User Repository
        await user.updateById(uid,
            phoneRegister
        );

        // Select User Repository
        const userSelect = await user.findById(uid);

        // TODO: U also update or change this for perform.
        // For us, This is fasted method to check also 1 code
        // And bypass other many Errors in sql schema Relation
        // Delete all Codes in User Repository Relation
        await this.userRepository.userCodes(uid).delete();

        // Add Code To User Repository Relation
        await this.userRepository.userCodes(uid)
            .create({
                random: rndCode
            });

        // Send Code To User Phone
        const sendAuthMsg = await this.twilioClient.sendAuthCode(
            userSelect.phoneCode + userSelect.phone,
            rndCode
        );

        return {
            oauth: sendAuthMsg,
            userProfile: userSelect
        };

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
                `Il numero di telefono dell'utente è richiesto`,
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

        // Send Code To User Phone
        const sendAuthMsg = await this.twilioClient.sendAuthCode(
            userSelect.phoneCode + userSelect.phone,
            rndCode
        );

        return sendAuthMsg;
    }

    /**
     |--------------------------------------------------------------------------
     | Phone Confirmation TODO: vrite phone confirmation
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
    async userPhoneConfirmation(
        @param.path.string('code') code: string,
        @inject(SecurityBindings.USER)
            currentUserProfile: UserProfile
    ): Promise<object> {

        console.log(code);

        // Select User ID from Auth => Json Web Token
        const uid = currentUserProfile[securityId];

        // Random code for the User
        const rndCode = this.twilioClient.randCode();

        // Select User Repository
        const userSelect = await this.userRepository.findById(uid);

        if (!userSelect.phone)
            throw new HttpErrors.UnprocessableEntity(
                `Il numero di telefono dell'utente è richiesto`,
            );

        // Find Phone Codes User Code Repository
        const codeVerify = await this.userRepository.userCodes(uid)
            .find({
                where: {
                    random: code.replace(/\s+/g, '')
                }
            });

        if (!codeVerify) {
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

            // Re-Send Code To User Phone
            await this.twilioClient.sendAuthCode(
                userSelect.phoneCode + userSelect.phone,
                rndCode
            );

            throw new HttpErrors.UnprocessableEntity(
                `Il codice di verifica non è corretto`,
            );

        }

        // Update User Repository Phone Verified
        await this.userRepository.updateById(uid,
            {
                phoneVerified: new Date()
            }
        );


        // Email token confirm has valid
        return {
            userProfile: userSelect,
            code: codeVerify
        }

    }

}
