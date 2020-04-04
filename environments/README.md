## Configuration for environment 🤩

###### Simple $vars .env:

```dotenv
#-- APP CONFIG --
APP_ENV=local
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
REST_CONNECTION=http
REST_HOST=127.0.0.1
REST_PORT=3000
REST_API_SPEC=true
REST_EXPLORER=true
REST_SELF_HOSTED=true
REST_EXPLORER_PATH=/graph

#-- DEFAULT DB CONFIG --
DB_NAME=mongo
DB_CONNECTOR=mongodb
DB_URL=
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

###### If u want run for example another production in aws:

1) Create one file in **/environments/.env.aws**
2) Go to **/src/index.ts** and set as follow:

```ecmascript 6
// Bootstrap Env Config
env('aws'); // local, prod ?? set env.local or env.prod
```
