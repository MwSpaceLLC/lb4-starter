## lb4-starter ~ <img src="https://loopback.io/images/branding/powered-by-loopback/blue/powered-by-loopback-sm.png" width="115"> | *ALPHA* | MongoDB

<img syle="border-radius:15px" src="https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/swagger-starter-info.png" width="100%">

## Start with this package 😎 

###### Have you installed Node.js?

Before you install LoopBack, make sure to download and install Node.js (version 8.9.x or higher), a JavaScript runtime.

###### Install LoopBack 4 CLI

The LoopBack 4 CLI is a command-line interface that can scaffold a project or extension. The CLI provides the fastest way to get started with a LoopBack 4 project that adheres to best practices.

###### Clone lb4-starter

    git clone https://github.com/MwSpaceLLC/lb4-starter.git && cd lb4-starter

###### Configure your environment $vars:

    mv src/environments/environment.example.ts src/environments/environment.ts

```javascript
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
```

###### Install package and vendor:
    
    npm install && npm run pretest && npm start
    
Fine! Please before start read official [Loopback Documentation](https://loopback.io/doc/en/lb4/Inside-LoopBack-Application.html)
 
## Package Futures Included 🥶

- auth https://github.com/strongloop
- role https://github.com/strongloop

* sms [message] https://github.com/twilio/twilio-node 🎇 | [DEMO](https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/IMG_0581_AUTHMSG.jpg)

##### @inject(TwilioServiceBindings.TWILIO_CLIENT)
    
```javascript
twilioClient.send(
    user.phone,
     '✔ Welcome Message | AUTHMSG',
      'lb4-starter'
  )
```

* mail [template management] https://github.com/nodemailer/nodemailer 🎇 | | [DEMO](https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/mail-template-function.png)

##### @inject(MailServiceBindings.MAIL_CLIENT)

```javascript
mailClient.prepare(
    '✔ Confirm e-mail address', // SUBJECT
    'confirm', // HTML TEMPLATE src/services/nodemailer/emails/confirm.ts
   [{link: uniqid('mail-token')}]  // HTML PARAM {{link}}
)
    .send(user.email,'another@mail.com','another@mail.it')
```
    
- stripe https://github.com/stripe/stripe-node
