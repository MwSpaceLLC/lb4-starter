export const TwilioResponseSchema = {
    type: 'object',
    properties: {
        "accountSid": {type: 'string'},
        "apiVersion": {type: 'string'},
        "body": {type: 'string'},
        "dateCreated": {type: 'string'},
        "dateUpdated": {type: 'string'},
        "dateSent": null,
        "direction": {type: 'string'},
        "errorCode": null,
        "errorMessage": null,
        "from": {type: 'string'},
        "messagingServiceSid": null,
        "numMedia": "0",
        "numSegments": "1",
        "price": null,
        "priceUnit": {type: 'string'},
        "sid": {type: 'string'},
        "status": {type: 'string'},
        "subresourceUris": {
            "media": {type: 'string'}
        },
        "to": {type: 'string'},
        "uri": {type: 'string'}
    }
};
