'use strict'

require('dotenv').config();

const Smooch      = require('smooch-core');
var chat          = require('./chat');
const queryString = require('query-string');
let Twilio        = require('twilio');
let delayed       = require('delayed');
let Promise       = require("bluebird");

let randomString = require('random-string');


const credential = {
    sid  : process.env.TWILIO_SID,
    token: process.env.TWILIO_TOKEN
}

var twilio = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

module.exports.handleManual = function (event, context, callback)
{


    console.log('---------===========START REQUEST============---------------')
    console.log('======= EVENT START ================');
    console.log(event);
    console.log('======= EVENT END ================');
    const params = JSON.parse(event.body);

    if (params.trigger != 'message:appUser') {
        if ('delivery:success' != params.trigger) {
            console.log('NOT received and NOT delivered')
            return context.succeed({
                statusCode: '200',
                body: params.trigger,
                headers: {
                    'Content-Type': 'application/json',
                }});
            console.log('!!!!YOU SHOULD NOT SEE THAT MESSAGE!!!!')
        }
    }

    console.log('SMS STATUS: ', params.SmsStatus)

//  var destinationNumber = (params.SmsStatus != 'received') ? params.To : params.From;
//  let from = (params.SmsStatus != 'received') ? params.From : params.To;

    let from              = params.app._id;
    let destinationNumber = params.appUser._id;

    return chat.processMessage(from,
        destinationNumber,
        params.messages?params.messages[0].text:'',
        params.trigger  == 'message:appUser' ? false : true,
        params.orderCompleted ? true : false,
        params.invoiceId)
        .then((data) =>
        {

            console.log('THEN: ', params)
            console.log('DATA: ', data)

            let timer = data.delay * 1000;

//            timer = data.delay * 1000;
            setTimeout(function ()
            {
                send(data.text, destinationNumber, from, data.key, data.secret).then(values =>
                {
                    console.log('OKKK', values)
                    return context.succeed({
                        statusCode: '200',
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json',
                        }});
                }).catch(reason =>
                {
                    console.log('ERRRR', reason)
                    return context.fail();
                })
            }, timer);



        })
        .catch((err) =>
        {
            console.log('CATCH')
            console.log(err)
//            return context.fail();
            return context.succeed({
                statusCode: '200',
                body: JSON.stringify(err),
                headers: {
                    'Content-Type': 'application/json',
                }});
        })

     function send(body, to, from, key, secret) {

        return new Promise((resolve, reject) =>
        {

            const smooch = new Smooch({
                keyId : key,
                secret: secret,
                scope : 'app'
            });

            smooch.appUsers.sendMessage(to, {
                type: 'text',
                text: body,
                role: 'appMaker'
            })
                .then((response) =>
                {
                    console.log('API RESPONSE:\n', response);
                    resolve(response);
                })
                .catch((err) =>
                {
                    console.log('API ERROR:\n', err);
                    reject(err);
                });
        })
    }
}


