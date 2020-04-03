import {HttpErrors, get, param} from "@loopback/rest";
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

import {environment} from "../../environments/environment";

@model()
// TODO: Refactor many function in this class (clear code)
export class PhoneController {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @inject(TwilioServiceBindings.TWILIO_CLIENT)
        public twilioClient: TwilioClientInterface,
    ) {
    }

    // /**
    //  |--------------------------------------------------------------------------
    //  | Phone Registration // TODO: complete this
    //  |--------------------------------------------------------------------------
    //  |
    //  | Here is where you can Register Phone Registration for your application.
    //  |
    //  */
    // @post('/phone/register', {
    //     // 'x-visibility': 'undocumented',
    //     security: OPERATION_SECURITY_SPEC,
    //     responses: {
    //         '200': {
    //             description: 'Register Phone to User',
    //             content: {
    //                 'application/json': {
    //                     schema: PhoneRegistrationSchema,
    //                 },
    //             },
    //         },
    //     },
    // })
    // @authenticate('jwt')
    // async userPhoneRegister(
    //     @inject(SecurityBindings.USER)
    //         currentUserProfile: UserProfile,
    //     @requestBody(PhoneRegisterRequestBody) phoneRegister: PhoneRegister,
    // ): Promise<void | object> {
    //
    //     // Select User ID from Auth => Json Web Token
    //     const uid = currentUserProfile[securityId];
    //
    //     // Random code for the User
    //     const rndCode = this.twilioClient.randCode();
    //
    //     // Select User Repository
    //     const user = this.userRepository;
    //
    //     const find = await user.findById(uid);
    //
    //     // Compare user Phone if Exist
    //     if (find.phone === phoneRegister.phone) {
    //         throw new HttpErrors.Conflict('Numero di telefono già in uso nel sistema');
    //     }
    //
    //     try {
    //
    //         // Update User Repository
    //         await user.updateById(uid,
    //             phoneRegister
    //         );
    //
    //         // Select User Repository
    //         const userSelect = await user.findById(uid);
    //
    //         //  TODO: Perform Twilio Sender Number Verification
    //         // Send Code To User Phone
    //         const sendAuthMsg = await this.twilioClient
    //             .from('AUTHMSG')
    //             .to(userSelect.phone)
    //             .content(`${rndCode} is your confirmation code for ${environment.appName}`)
    //             .send();
    //
    //         // TODO: U also update or change this for perform.
    //         // For us, This is fasted method to check also 1 code
    //         // And bypass other many Errors in sql schema Relation
    //         // Delete all Codes in User Repository Relation
    //         await this.userRepository.userCodes(uid).delete();
    //
    //         // Add Code To User Repository Relation
    //         await this.userRepository.userCodes(uid)
    //             .create({
    //                 random: rndCode
    //             });
    //
    //         return {
    //             oauth: sendAuthMsg,
    //             userProfile: userSelect
    //         };
    //
    //     } catch (error) {
    //
    //         // MongoError duplicate key error
    //         if (error.code === 11000 && error.errmsg.includes('index: uniquePhone')) {
    //             throw new HttpErrors.Conflict('Numero di telefono già in uso nel sistema');
    //
    //             // Twilio catch number verification
    //         } else if (error.code === 21211) {
    //
    //             throw new HttpErrors.UnprocessableEntity(
    //                 `Il numero di telefono non è valido`,
    //             );
    //         } else {
    //             throw error;
    //         }
    //     }
    //
    // }

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

        try {

            // New Construct sms
            const sms =
                this.twilioClient
                    .from('AUTHMSG')
                    .to(userSelect.phone)
                    .content(`${rndCode} is your confirmation code for ${environment.appName}`);

            return await sms.send();


        } catch (error) {
            // Twilio catch number verification
            if (error.code === 21211) {

                throw new HttpErrors.UnprocessableEntity(
                    `Il numero di telefono non è valido`,
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

        if (!codeVerify.length) {
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
            await this.twilioClient
                .from('AUTHMSG')
                .to(userSelect.phone)
                .content(`${rndCode} is your confirmation code for ${environment.appName}`)
                .send();

            throw new HttpErrors.UnprocessableEntity(
                `Il codice di verifica non è corretto`,
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
