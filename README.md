##Backend - Expressjs apps (REST API)
### Local Setup

Install [Node.js](https://nodejs.org/) stable release. This will also include the node package manager (npm).
Install [imagemagick](http://www.imagemagick.org/) on the server.

#### Change directory:
```sh
cd backend/
```

#### Install node modules
```sh
npm install
```

#### Create .env file (for example .example-env)

#### Run migration
```sh
sequelize db:migrate
```

#### Run REST API (localhost:8181)
```sh
npm run api
```
Now browse to the app at [`localhost:8181`].


##Frontend - AngularJS apps
### Local Setup

#### Change directory:
```sh
cd frontend/angular-seed/
```

#### Install node modules:
```sh
npm install
```

#### Setup REST API url

Create new file like frontend/angular-seed/app/config.js, use for example config.example.js and set the local url (http://localhost:8181) to actual domain instead


#### Run the Application

We have preconfigured the project with a simple development web server. The simplest way to start this server is:

```
npm start
```

Now browse to the app at [`localhost:8000`].

#### How to pass parameters to an application
Example: http://localhost:8000/#/main?userName=Mick&email=email@google.com&phone=123456789

## Troubleshooting:

1. You may need to install sequelize globally:
```bash
$ npm install -g sequelize-cli
```




