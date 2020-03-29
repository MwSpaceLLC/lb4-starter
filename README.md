## lb4-starter ~ <img src="https://loopback.io/images/branding/powered-by-loopback/blue/powered-by-loopback-sm.png" width="115"> | *ALPHA*

<img syle="border-radius:15px" src="https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/lb4-starter-mw.png" width="100%">

### Start with this package

Rename environment $vars:

    src/environment/environment.example.ts => environment.ts

Install package and vendor:
    
    npm install && npm pretest && npm build:watch && npm start

#### Package Futures (DB=> MondoDB)

- auth https://github.com/strongloop
- role https://github.com/strongloop
- sms https://github.com/twilio/twilio-node

mail [template] https://github.com/nodemailer/nodemailer

<img syle="border-radius:15px" src="https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/mail-template-function.png" width="100%">

* @inject(MailServiceBindings.MAIL_CLIENT)
    
            mailClient.send(
                '✔ Confirm Node Mail | lb4-starter',
                 'confirm',
                  user.email
              )

- stripe https://github.com/stripe/stripe-node
