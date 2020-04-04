// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const sendMsgProperty = {
    "accountSid": {type: 'string'},
    "apiVersion": {type: 'string'},
    "body": {type: 'string'},
    "dateCreated": {type: 'string'},
    "dateUpdated": {type: 'string'},
    "dateSent": {type: 'string'},
    "direction": {type: 'string'},
    "errorCode": {type: 'string'},
    "errorMessage": {type: 'string'},
    "from": {type: 'string'},
    "messagingServiceSid": {type: 'string'},
    "numMedia": {type: 'integer'},
    "numSegments": {type: 'integer'},
    "price": {type: 'string'},
    "priceUnit": {type: 'string'},
    "sid": {type: 'string'},
    "status": {type: 'string'},
    "subresourceUris": {
        type: 'object',
        properties: {
            "media": {type: 'string'}
        }
    },
    "to": {type: 'string'},
    "uri": {type: 'string'}
};

export const TwilioResponseSchema = {
    description: 'Twilio Response Schema',
    type: 'object',
    properties: sendMsgProperty
};

export const PhoneRegistrationSchema = {
    description: 'Phone Registration Schema',
    type: 'object',
    properties: {
        oauth: sendMsgProperty,
        userProfile: {
            type: 'object',
            properties: {
                "id": {type: 'string'},
                "email": {type: 'string'},
                "emailVerified": {type: 'string'},
                "name": {type: 'string'},
                "agreement": {type: 'boolean'},
                "phoneCode": {type: 'string'},
                "phone": {type: 'string'},
                "phoneVerified": {type: 'string'},
                "status": {type: 'string'},
            }
        }
    },
};

const PhoneRegisterSchema = {
    description: 'Phone Register Schema',
    type: 'object',
    required: ['phoneCode', 'phone'],
    properties: {
        phone: {type: 'string'},
        phoneCode: {type: 'string'},
    },
};

export const PhoneRegisterRequestBody = {
    description: 'Phone Register Request Body',
    content: {
        'application/json': {schema: PhoneRegisterSchema},
    },
};


// TODO: complete this
export const PhoneCodeConfirmSchema = {
    description: 'Phone Code Confirm Schema',
    type: 'object',
    properties: {
        find: {},
        userProfile: {
            type: 'object',
            properties: {
                "id": {type: 'string'},
                "email": {type: 'string'},
                "emailVerified": {type: 'string'},
                "name": {type: 'string'},
                "agreement": {type: 'boolean'},
                "phoneCode": {type: 'string'},
                "phone": {type: 'string'},
                "phoneVerified": {type: 'string'},
                "status": {type: 'string'},
            }
        }
    },
};
