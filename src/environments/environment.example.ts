export const environment = {
    appName: 'lb4-starter',
    production: false,
    version: '0.9.0-alpha',
    twilio: {
        accountSid: '',
        authToken: '',
        sender: ''
    },
    stripe: {
        publicKey: '',
        privateKey: '',
    },

    //Other Configurations
    TIME_ZONE: 'Europe/Rome',
    LOCALE: 'it',
    LANG: 'it',
    FAIL_LANG: 'en',
    DATE_FORMAT: 'DD/MM/YYYY',

    // JWT Configuration
    TOKEN_SECRET: 'myjwts3cr3t',
    TOKEN_EXPIRES: '3600',
};
