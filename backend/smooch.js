require('dotenv').config()
const Smooch = require('smooch-core')


const smooch = new Smooch({
    keyId: 'app_5900b9a92f588d5a016a1e8d',
    secret: 'PWUIlzOX113c2Enqj5_AzDQj',
    scope: 'app' });
console.log(smooch.authHeaders)

// smooch.integrations.list('5900b9a97651104b00b141cc').then((response) => {
//     console.log(response)
// });


//
//
// smooch.appUsers.getMessages('47e40dc095ea78066c66f8cb').then((response) => {
//     console.log(response.messages)
// });

// Send SMS
// var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//
// client.messages.create({
//     to: "+12818090012 ",
//     from: "+15756802274",
//     body: "my address from twilio"
// }, function(err, message) {
//     console.log(message.sid);
// });

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
//
// let APP_TOKEN = '7bq6xywnz8h8gvbfxfyrvxlgy';
// // Initializing Smooch Core with an app scoped token
// let smoochApp = new SmoochCore({
//   appToken: APP_TOKEN
// });


// Initializing Smooch Core with an account scoped key
// let smooch = new SmoochCore({
//   keyId: 'app_5900775907f297390007cbdd',
//   secret: '2QjybI1GExoAA4Qr5MQICw5Q',
//   scope: 'app'
// });


// Initializing Smooch Core with an account scoped key
// let smooch = new SmoochCore({
//   keyId: process.env.SMOOCH_ACC_KEY,
//   secret: process.env.SMOOCH_ACC_SECRET,
//   scope: 'account'
// });

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
// smooch.appUsers.get('bf94cfa4cdeb770f238828b7').then((response) => {
//   console.log(response.appUser.clients)
// });

//link channel
// smooch.appUsers.linkChannel('bf94cfa4cdeb770f238828b7', {
//   type: 'twilio',
//   phoneNumber: '+15756802274',
//     confirmation: {
//         type: 'immediate'
//     }
// }).then((response) => {
//     console.log(response)
// }).catch((err) => {
//   console.log(err)
// });

smooch.integrations.list('55c8d9758590aa1900b9b9f6').then((response) => {
    // async code
});

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

//

// console.log(smooch)
// smooch.appUsers.getMessages('af1975a3-622a-4777-8bc0-871c32526885').then((response) => {
//
//   console.log('1111111111', response)
//
// }).catch((err) => {
//   console.log(55555555, err)
//
// });

//
// smooch.appUsers.linkChannel('67aef89989d281e454174bd5', {
//     type: 'twilio',
//     phoneNumber: '+15756802274',
//     confirmation: {
//         type: 'immediate'
//     }
// }).then((response) => {
//     console.log('SEND MESSAGE: ', response);
//
//
// }).catch((err) => {
//     console.log(3131313131313, err)
//
// });



// "bb8b6834c5c3998d629a70951f5ab92b782c5d06@test.com"
// _id
//   :
//   "4457035d0aa999f500ce96e4"

