## lb4-starter | <img src="https://loopback.io/images/branding/powered-by-loopback/blue/powered-by-loopback-sm.png" width="115"> | <img src="https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/mongo-atlas.png" width="115"> | <img src="https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/heroku.png" width="80"> | <img src="https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/app-enginge.png" width="100">

### *ALPHA* | [aws DEMO](http://lb4-starter.eu-central-1.elasticbeanstalk.com) | [heroku DEMO](https://lb4-starter.herokuapp.com) | [App Engine DEMO](https://mwspace.oa.r.appspot.com/) <a href="https://app.netlify.com/start/deploy?repository=https://github.com/MwSpaceLLC/lb4-starter"><img align="right" src="https://www.netlify.com/img/deploy/button.svg" class="deploy-button" alt="deploy to netlify"></a>

<img syle="border-radius:15px" src="https://raw.githubusercontent.com/MwSpaceLLC/lb4-starter/master/swagger-starter.png" width="100%">

## Why use this package? 😎
This development is the basis of the new server for our startup. So we thought to share the basic project for other developers who start with this framework without having to develop from scratch authentication Email Sending and other futures 

## Start with this package [![Netlify Status](https://api.netlify.com/api/v1/badges/475798bc-57c4-4e78-86f2-57ec03b4847a/deploy-status)](https://app.netlify.com/sites/lb4-starter/deploys) [![Heroku](https://heroku-badge.herokuapp.com/?app=heroku-badge)]

###### Have you installed Node.js?

Before you install LoopBack, make sure to download and install Node.js (version 8.9.x or higher), a JavaScript runtime.

###### Install LoopBack 4 CLI

The LoopBack 4 CLI is a command-line interface that can scaffold a project or extension. The CLI provides the fastest way to get started with a LoopBack 4 project that adheres to best practices.

###### Clone lb4-starter

    git clone https://github.com/MwSpaceLLC/lb4-starter.git && cd lb4-starter

###### Install package and vendor:
    
    npm install

###### Configure your environments:
    
```dotenv
#-- APP CONFIG --
APP_NAME=lb4-starter
APP_VERSION=0.9.0-alpha
APP_DEBUG=true

#-- APP LOCAL CONFIG --
APP_TIME_ZONE=Europe/Rome
APP_LANG=it
APP_FALLBACK_LANG=en
APP_DATE_FORMAT=DD/MM/YYYY
APP_URL=${REST_CONNECTION}://${REST_HOST}:${REST_PORT}

#-- TOKEN JWT CONFIG --
TOKEN_SECRET=MyAwesomeSecret
TOKEN_EXPIRES=14400

#-- REST SRV CONFIG --
PORT=8080
HOST=localhost
REST_CONNECTION=http
REST_API_SPEC=true
REST_EXPLORER=true
REST_SELF_HOSTED=true
REST_EXPLORER_PATH=/graph

#-- DEFAULT DB CONFIG --
DB_NAME=mongo
DB_CONNECTOR=mongodb
#DB_URL=
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=lb4-starter
DB_USERNAME=
DB_PASSWORD=

#-- MAIL NODE CONFIG --
MAIL_TRANSPORT=smtp #sendmail
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=no-reply@lb4-starter.git
MAIL_FROM_NAME="${APP_NAME}"

#-- SMS TWILIO CONFIG --
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_SENDER=
```

###### Install package and vendor:
    
    npm run pretest && npm start
    
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
