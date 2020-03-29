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
    description: 'Credentials Schema',
    type: 'object',
    properties: {},
};
