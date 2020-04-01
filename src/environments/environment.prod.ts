export const environment = {
    appName: 'lb4-starter',
    production: false,
    version: '0.9.0-alpha',

    //Rest Server Configuration
    host: '127.0.0.1',
    port: 3030,
    openApiSpec: true,

    //Rest Server Configuration
    apiExplorer: true,
    apiSelfHostedSpec: true,
    apiExplorerPath: '/explorer',

    //Application Front End Configuration
    endpoint: 'localhost',
    endpointPort: 4200,

    //Sdk Configuration
    twilio: {
        accountSid: '',
        authToken: '',
        sender: ''
    },
    stripe: {
        publicKey: '',
        privateKey: '',
    },

    //Mail Configuration
    MAIL_MAILER: 'smtp',
    MAIL_HOST: 'smtp.mailtrap.io',
    MAIL_PORT: 2525,
    MAIL_USERNAME: '',
    MAIL_PASSWORD: '',
    MAIL_ENCRYPTION: null,
    MAIL_FROM_ADDRESS: 'no-reply@lb4-starter.git',
    MAIL_FROM_NAME: 'lb4-starter',

    //Other Configurations
    TIME_ZONE: 'Europe/Rome',
    LOCALE: 'it',
    LANG: 'it',
    FAIL_LANG: 'en',
    DATE_FORMAT: 'DD/MM/YYYY',

    // JWT Configuration
    TOKEN_SECRET: 'mySecretLabel',
    TOKEN_EXPIRES: '14400',
};
