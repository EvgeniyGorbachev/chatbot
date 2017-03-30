##Backend - Expressjs apps (REST API)
### Local Setup

Install [Node.js](https://nodejs.org/) stable release. This will also include the node package manager (npm).

1.) Change directory:
```sh
cd backend/
```

2.) Install node modules
```sh
npm install
```

3.) Create .env file (for example .example-env)

4.) Run migration
```sh
sequelize db:migrate
```

5.) Run REST API (localhost:8181)
```sh
npm run api
```
Now browse to the app at [`localhost:8000`].


##Frontend - AngularJS apps
### Local Setup

Change directory:
```sh
cd frontend/angular-seed/
```

Install node modules:
```sh
npm install
```

### Setup REST API url

Open file frontend/angular-seed/app/app.js and set your url instead: http://localhost:8181


### Run the Application

We have preconfigured the project with a simple development web server. The simplest way to start
this server is:

```
npm start
```

Now browse to the app at [`localhost:8000`].

### How to pass parameters to an application
Example: http://localhost:8000/#/main?userName=Mick&email=email@google.com&phone=123456789

### Troubleshooting:

1. You may need to install sequelize globally:
```bash
$ npm install -g sequelize-cli
```




