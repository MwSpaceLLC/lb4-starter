## lb4-starter ~ <img src="https://loopback.io/images/branding/powered-by-loopback/blue/powered-by-loopback-sm.png" width="115"> | *ALPHA* | [aws DEMO](http://lb4-starter.eu-central-1.elasticbeanstalk.com) | [heroku DEMO](https://lb4-starter.herokuapp.com)

<img syle="border-radius:15px" src="https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/swagger-starter.png" width="100%">

## Why use this package? 😎 
This development is the basis of the new server for our startup. So we thought to share the basic project for other developers who start with this framework without having to develop from scratch authentication Email Sending and other futures 

## Start with this package 🥳

###### Have you installed Node.js?

Before you install LoopBack, make sure to download and install Node.js (version 8.9.x or higher), a JavaScript runtime.

###### Install LoopBack 4 CLI

The LoopBack 4 CLI is a command-line interface that can scaffold a project or extension. The CLI provides the fastest way to get started with a LoopBack 4 project that adheres to best practices.

###### Clone lb4-starter

    git clone https://github.com/MwSpaceLLC/lb4-starter.git && cd lb4-starter

###### Install package and vendor:
    
    npm install && npm run dev
    
Fine! Please before start read official [Loopback Documentation](https://loopback.io/doc/en/lb4/Inside-LoopBack-Application.html)
 
## Package Futures Included 🥶

- auth https://github.com/strongloop
- role https://github.com/strongloop

* sms [message] https://github.com/twilio/twilio-node 🎇 | [DEMO](https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/IMG_0581_AUTHMSG.jpg)

##### @inject(TwilioServiceBindings.TWILIO_CLIENT)
    
```javascript
const sms =
    this.twilioClient
        .from('ln4-starter')
        .to('+1 39 55 66 44 22')
        .content('✔ Confirm phone number');

return await sms.send();
```

* mail [template management] https://github.com/nodemailer/nodemailer 🎇 | [DEMO](https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/mail-template-function.png)

##### @inject(MailServiceBindings.MAIL_CLIENT)

```javascript
const mail =
    this.mailClient
        .to('email@timnet.com')
        .subject('✔ Confirm e-mail address')
        .view('confirm')
        .with({link: link});

return mail.send();
```
    
- stripe https://github.com/stripe/stripe-node
```
under construction
```
