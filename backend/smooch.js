let jwt = require('jsonwebtoken');
let SmoochCore =  require('smooch-core');

require('dotenv').config()

// let token = jwt.sign({scope: 'account'}, SECRET, {header: {kid: KEY_ID}});

let APP_TOKEN = 'drfzc4jghvnj9kica9sfwfbgy';
// Initializing Smooch Core with an app scoped token
let smoochApp = new SmoochCore({
  appToken: APP_TOKEN
});


// Initializing Smooch Core with an account scoped key
let smooch = new SmoochCore({
  keyId: process.env.TWILIO_ACC_KEY,
  secret: process.env.TWILIO_ACC_SECRET,
  scope: 'account'
});

// var smooch = new SmoochCore({
//   jwt: token
// });

//create app
// smooch.apps.create({
//   name: 'test2'
// }).then((response) => {
//   // async code
// });

//get barear
// console.log(smooch)


// app list
// smooch.apps.list().then((response) => {
//   console.log(response)
// });

//add integration
// let appId = '58ff1a117215734b0039fc43';
//
// smooch.integrations.create(appId, {
//   type: 'twilio',
//   accountSid: 'AC61bd4abb0e64ed4c8f35b9df4e7738c3',
//   authToken: 'bd18b2fd3b1583438ecd9b22e3fa28be',
//   phoneNumberSid: 'PN444b87bb07332d142125ab117dffaac1'
// }).then((response) => {
//   console.log(response)
// }).catch((err) => {
//   console.log(err)
// });

//create user
// smoochApp.appUsers.init({
//   device: {
//     id: 'sfdsdfdsfsfsd',
//     platform: 'android',
//     appVersion: '1.0'
//   },
//   userId: 'zhenya@example.com'
// }).then((response) => {
//   console.log(response)
// });

//get user
// smoochApp.appUsers.get('f90b6f7a5c7c5f1daec0277a').then((response) => {
//   console.log(response)
// });

//link channel
// smoochApp.appUsers.linkChannel('mike@example.com', {
//   type: 'twilio',
//   phoneNumber: '+15145555555'
// }).then((response) => {
//   // async code
// }).catch((err) => {
//   console.log(err)
// });

// send message
// let userId = 'b0e7711936f9e0f44d3b5b41';
// smoochApp.appUsers.sendMessage(userId, {
//   text: 'Just put some vinegar on it',
//   role: 'appUser',
//   type: 'text'
// }).then((response) => {
//   console.log(response)
// });

