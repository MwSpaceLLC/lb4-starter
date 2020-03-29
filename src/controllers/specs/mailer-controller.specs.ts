export const MailerResponseSchema = {
    type: 'object',
    properties: {
        "accepted": {type: 'object'},
        "rejected": {type: 'object'},
        "envelopeTime": {type: 'number'},
        "messageTime": {type: 'number'},
        "messageSize": {type: 'number'},
        "response": {type: 'string'},
        "envelope": {
            "from": {type: 'string'},
            "to": {type: 'object'}
        },
        "messageId": {type: 'string'}
    }
};
