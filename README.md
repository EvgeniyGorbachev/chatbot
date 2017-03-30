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
Now browse to the app at [`localhost:8181`].


##Frontend - AngularJS apps
### Local Setup

Install [Node.js](https://nodejs.org/) stable release. This will also include the node package manager (npm).

Change directory:
```sh
cd frontend/angular-seed/
```

Install node modules:
```sh
npm install
```

### Run the Application

We have preconfigured the project with a simple development web server. The simplest way to start
this server is:

```
npm start
```

Now browse to the app at [`localhost:8000`].




