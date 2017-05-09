require('dotenv').config()

let jwt = require('jsonwebtoken');
let SmoochCore =  require('smooch-core');

// var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// client.availablePhoneNumbers("US").local.list({
//   number: "+12035804010"
// }, function(err, data) {
//   var number = data.availablePhoneNumbers[0];
// console.log(22222, data)
// console.log(number)
//   // client.incomingPhoneNumbers.create({
//   //   phoneNumber: number.phone_number
//   // }, function(err, purchasedNumber) {
//   //   console.log(purchasedNumber.sid);
//   // });
// });

// client.accounts(process.env.TWILIO_ACCOUNT_SID).get(function(err, account) {
//   console.log(account);
// });


// let token = jwt.sign({scope: 'account'}, SECRET, {header: {kid: KEY_ID}});

let APP_TOKEN = '7bq6xywnz8h8gvbfxfyrvxlgy';
// Initializing Smooch Core with an app scoped token
let smoochApp = new SmoochCore({
  appToken: APP_TOKEN
});


// Initializing Smooch Core with an account scoped key
// let smooch = new SmoochCore({
//   keyId: 'app_5900775907f297390007cbdd',
//   secret: '2QjybI1GExoAA4Qr5MQICw5Q',
//   scope: 'app'
// });


// Initializing Smooch Core with an account scoped key
let smooch = new SmoochCore({
  keyId: process.env.SMOOCH_ACC_KEY,
  secret: process.env.SMOOCH_ACC_SECRET,
  scope: 'account'
});

//get barear
// console.log(smooch.authHeaders.Authorization)


// var smooch = new SmoochCore({
//   jwt: token
// });

//create app
// smooch.apps.create({
//   name: 'test5'
// }).then((response) => {
//   // console.log(111111, response.appToken)
//   console.log(111111, response.app['appToken'])
//   console.log(111111, response.app['_id'])
// });

//create app key
// smooch.apps.keys.create('59009f0befc9e41201a33ca9', {
//   name: 'key',
// }).then((response) => {
//   console.log(response)
// }).catch((err) => {
//   console.log(err)
// });



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
// smoochApp.appUsers.get('b6c1efdff3764c97afa38043').then((response) => {
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

// smooch.integrations.delete('5900c71834853e33008fa2ab', 'eak4jis0yglxcd9gqv86483fh').then((response) => {
//   console.log(response)
// });


smooch.integrations.list('5900c71834853e33008fa2ab').then((response) => {
  console.log(response)
});
