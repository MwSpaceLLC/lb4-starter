export const TwilioResponseSchema = {
    description: 'Twilio Response Schema',
    type: 'object',
    properties: {
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
    }
};
