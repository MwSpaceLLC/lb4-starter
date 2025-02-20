// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: lb4-starter | MwSpace LLC
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export const MailerResponseSchema = {
    description: 'Mailer Response Schema',
    type: 'object',
    properties: {
        "accepted": {type: 'array', items: []},
        "rejected": {type: 'array', items: []},
        "envelopeTime": {type: 'number'},
        "messageTime": {type: 'number'},
        "messageSize": {type: 'number'},
        "response": {type: 'string'},
        "envelope": {
            type: 'object',
            properties: {
                "from": {type: 'string'},
                "to": {type: 'array', items: []}
            }
        },
        "messageId": {type: 'string'}
    }
};

export const EmailTokenConfirmSchema = {
    description: 'Email Token Confirm Schema Schema',
    type: 'object',
    properties: {
        "token": true,
        "hash": {
            type: 'array',
            items: [
                {
                    type: 'object',
                    properties: {
                        "id": {type: 'string'},
                        "hash": {type: 'string'},
                        "userId": {type: 'string'}
                    }
                }
            ]
        }
    },
};
