## lb4-starter ~ <img src="https://loopback.io/images/branding/powered-by-loopback/blue/powered-by-loopback-sm.png" width="115"> | *ALPHA* | MongoDB

<img syle="border-radius:15px" src="https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/lb4-starter.png" width="100%">

## Start with this package 😎 

###### Have you installed Node.js?

Before you install LoopBack, make sure to download and install Node.js (version 8.9.x or higher), a JavaScript runtime.

###### Install LoopBack 4 CLI

The LoopBack 4 CLI is a command-line interface that can scaffold a project or extension. The CLI provides the fastest way to get started with a LoopBack 4 project that adheres to best practices.

###### Clone lb4-starter

    git clone https://github.com/MwSpaceLLC/lb4-starter.git && cd lb4-starter

###### Configure your environment $vars:

    mv src/environments/environment.example.ts src/environments/environment.ts

###### Install package and vendor:
    
    npm install && npm run pretest && npm start
    
Fine! Please read official Doc at https://loopback.io/doc/en/lb4/    

###### Disable Spec and Explorer (only rest server)
    
    openApiSpec: false,
    apiExplorer: false,

## Package Futures Compiled 🥶

- auth https://github.com/strongloop
- role https://github.com/strongloop

###### sms [message] https://github.com/twilio/twilio-node 🎇

<img syle="border-radius:15px" src="https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/IMG_0581_AUTHMSG.jpg" width="35%">

##### @inject(TwilioServiceBindings.TWILIO_CLIENT)
    
        twilioClient.send(
            user.phone,
             '✔ Welcome Message | AUTHMSG',
              'lb4-starter'
          )

###### mail [template] https://github.com/nodemailer/nodemailer 🎇

<img syle="border-radius:15px" src="https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/mail-template-function.png" width="50%">

##### @inject(MailServiceBindings.MAIL_CLIENT)
    
        mailClient.send(
            '✔ Confirm Node Mail | lb4-starter',
             'confirm',
              user.email
          )

- stripe https://github.com/stripe/stripe-node

        // in dev
