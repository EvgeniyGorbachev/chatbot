'use strict';

require('dotenv').config();
let chai           = require("chai");
let chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
let expect             = chai.expect;
let assert             = chai.assert;
const faker            = require('faker')
let processMessages    = require('../chat/index')
let db                 = processMessages.db
let conversationsTable = processMessages.conversationsTable

let to = '+12033496336';

let phoneNumber = faker.phone.phoneNumber();
let name        = faker.name.findName();
let address     = faker.address.country() + ' ' + faker.address.state() + ' ' + faker.address.city() + ' ' + faker.address.streetName() + ' ' + faker.address.streetAddress() + ' ' + faker.address.zipCode();
let email       = faker.internet.email();

let invoiceId           = faker.internet.password();
let invoiceJsonString   = JSON.stringify({"id": invoiceId});
let invoiceBase64String = new Buffer(invoiceJsonString).toString('base64')
let invoiceLink         = process.env.PAYMENT_HOST_LINK + '/#/invoice/' + invoiceBase64String;

let userJsonString   = JSON.stringify({"userName": name, "phone": phoneNumber, "email": email, "address": address});
let userBase64String = new Buffer(userJsonString).toString('base64');
let link             = process.env.PAYMENT_HOST_LINK + '/#/main/' + userBase64String;

describe('Class processMessage Second Flow', () =>
{

    describe('Step 1', () =>
    {

        it('Should return: "Hey! Thank you for your interest in PiYo."', () =>
        {

            return processMessages.processMessage(to, phoneNumber).then((data) =>
            {
                expect(data).to.deep.equal({id: 1, text: 'Hey! Thank you for your interest in PiYo.', delay: 2})
            })
        });
    });

    describe('Step 2', () =>
    {

        it('Should be rejected on step 2 because wait callback', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber)).to.be.rejected;
        });

        it('Should return: "PiYo is America\'s bestselling in home fitness DVD program created by me, Chalene Johnson! What’s your first and last name?"',
            () =>
            {

                return processMessages.processMessage(to, phoneNumber, null, true).then((data) =>
                {
                    expect(data).to.deep.equal({
                        id   : 2,
                        text: 'PiYo is America\'s bestselling in home fitness DVD program created by me, Chalene Johnson! What’s your first and last name?',
                        delay: 2
                    })
                })
            });
    });

    describe('Step 3', () =>
    {

        it('Should be rejected on step 3 because wait user action', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, name, true)).to.be.rejected;
        });

        it('Should return: "Hi ' + name + ', it’s nice to meet you. With PiYo you’re getting a 30-day MBG."', () =>
        {
            return processMessages.processMessage(to, phoneNumber, name).then((data) =>
            {
                expect(data).to.deep.equal({
                    id  : 3,
                    text: 'Hi ' + name + ', it’s nice to meet you. With PiYo you’re getting a 30-day MBG.', delay: 2
                })
            })
        });
    });

    describe('Step 4', () =>
    {

        it('Should be rejected on step 4 because wait callback', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber)).to.be.rejected;
        });

        it('Should return: "This is how confident I am about the results you’ll see with PiYo."', () =>
        {

            return processMessages.processMessage(to, phoneNumber, null, true).then((data) =>
            {
                expect(data).to.deep.equal(
                    {id: 4, text: 'This is how confident I am about the results you’ll see with PiYo.', delay: 2})
            })
        });
    });

    describe('Step 5', () =>
    {

        it('Should be rejected on step 5 because wait callback', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber)).to.be.rejected;
        });

        it('Should return: "You have absolutely nothing to lose but those unwanted pounds. What’s your complete mailing address?',
            () =>
            {

                return processMessages.processMessage(to, phoneNumber, null, true).then((data) =>
                {
                    expect(data).to.deep.equal({
                        id: 5,
                        text: 'You have absolutely nothing to lose but those unwanted pounds. What’s your complete mailing address?',
                        delay: 2
                    })
                })
            });
    });

    describe('Step 6', () =>
    {

        it('Should be rejected on step 6 because wait user action', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, address, true)).to.be.rejected;
        });

        it('Should return: "Thanks, ' + name + '! What’s your email address?"', () =>
        {
            return processMessages.processMessage(to, phoneNumber, address).then((data) =>
            {
                expect(data).to.deep.equal({id: 6, text: 'Thanks, ' + name + '! What’s your email address?', delay: 2})
            })
        });
    });

    describe('Step 7', () =>
    {

        it('Should be rejected on step 7 because wait user action', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, email, true)).to.be.rejected;
        });

        it('Should return: "Awesome! Many clients ask me, “how can I get better results”. Click below to see what I tell them. http://youtu.be/LnuurRvsCx8"',
            () =>
            {
                return processMessages.processMessage(to, phoneNumber, email).then((data) =>
                {
                    expect(data).to.deep.equal({
                        id: 7,
                        text: 'Awesome! Many clients ask me, “how can I get better results”. Click below to see what I tell them. http://youtu.be/LnuurRvsCx8',
                        delay: 30
                    })
                })
            });
    });

    describe('Step 8', () =>
    {

        it('Should be rejected on step 8 because wait callback', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber)).to.be.rejected;
        });

        it('Should return: "Are you ready to create your own success story? [Y/N]', () =>
        {

            return processMessages.processMessage(to, phoneNumber, null, true).then((data) =>
            {
                expect(data).to.deep.equal(
                    {id: 8, text: 'Are you ready to create your own success story? [Y/N]', delay: 2})
            })
        });
    });

    describe('Step 9', () =>
    {

        it('Should be rejected on step 9 because wait user action', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, null, true)).to.be.rejected;
        });

        it('Should return: "You’re all set ' + name + '. Thank you for choosing my revolutionary program, PiYo, to help transform your body. Please click here to pay ' + link,
            () =>
            {

                return processMessages.processMessage(to, phoneNumber, 'N').then((data) =>
                {
                    expect(data).to.deep.equal({
                        id: 10,
                        text: 'You’re all set ' + name + '. Thank you for choosing my revolutionary program, PiYo, to help transform your body. Please click here to pay ' + link,
                        delay: 2
                    })
                })
            });
    });

    describe('Step 10', () =>
    {

        it('Should be rejected on step 10 because wait callback', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber)).to.be.rejected;
        });

        it('Should be rejected on step 10 because wait callback', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, null, true)).to.be.rejected;
        });

        it('Should return: "Welcome to my exclusive club. The work starts now! Here is your receipt ' + invoiceLink + '. Don’t forget to follow me on social media at @CJPiYo',
            () =>
            {

                return processMessages.processMessage(to, phoneNumber, null, true, true, invoiceId).then((data) =>
                {
                    expect(data).to.deep.equal({
                        id: 11,
                        text: 'Welcome to my exclusive club. The work starts now! Here is your receipt ' + invoiceLink + '. Don’t forget to follow me on social media at @CJPiYo',
                        delay: 2
                    })
                })
            });

        it('Should delete current conversation in DB', () =>
        {

            return db.select('*')
                .from(conversationsTable)
                .where({sender: phoneNumber})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(0, conversation.length);
                })
        });

        it('Should be rejected on step 11 because wait for user action', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, null, true)).to.be.rejected;
        });
    });

})
