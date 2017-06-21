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
let conversationHistory = processMessages.conversationHistory

let to = '+12033496336';

let phoneNumber = faker.phone.phoneNumber();
let name        = faker.name.findName();
let address     = faker.address.country() + ' ' + faker.address.state() + ' ' + faker.address.city() + ' ' + faker.address.streetName() + ' ' + faker.address.streetAddress() + ' ' + faker.address.zipCode();
let email       = faker.internet.email();

let stopWord    = 'help';

let invoiceId           = faker.internet.password();
let invoiceJsonString   = JSON.stringify({"id": invoiceId});
let invoiceBase64String = new Buffer(invoiceJsonString).toString('base64');
let invoiceLink         = process.env.PAYMENT_HOST_LINK + '/#/invoice/' + invoiceBase64String;

let userJsonString   = JSON.stringify({"userName": name, "phone": phoneNumber, "email": email, "address": address});
let userBase64String = new Buffer(userJsonString).toString('base64');
let link             = process.env.PAYMENT_HOST_LINK + '/#/main/' + userBase64String;

describe('Class processMessage', () =>
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
                        text : 'PiYo is America\'s bestselling in home fitness DVD program created by me, Chalene Johnson! What’s your first and last name?',
                        delay: 2
                    })
                })
            });

        it('Should be rejected on step 3 because wait user action', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, null, true)).to.be.rejected;
        });

    });

    describe('Step 3', () =>
    {

        it('Should be rejected on step 3 because isPaused = true', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, stopWord, true)).to.be.rejected;
        });

        it('Should be rejected on step 3 because isPaused = true', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, stopWord)).to.be.rejected;
        });

        it('Should be rejected on step 3 because isPaused = true', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber)).to.be.rejected;
        });

        it('Must not change last_phrase_id field on conversation table in DB', () =>
        {

            return db.select('*')
                .from(conversationsTable)
                .where({sender: phoneNumber})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(2, conversation.last_phrase_id);
                })
        });

        it('Should write to the table conversation_history new row ', () =>
        {

            return db.select('*')
                .from(conversationHistory)
                .where({user_id: phoneNumber, text: stopWord})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(stopWord, conversation.text);
                })
        });

    });

    describe('Step 4', () =>
    {

        it('Should be rejected on step 4 because isPaused = true', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber)).to.be.rejected;
        });

        it('Should be rejected on step 4 because isPaused = true', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, null, true)).to.be.rejected;
        });

        it('Should be rejected on step 3 because isPaused = true', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, 'Step 4')).to.be.rejected;
        });

        it('Must not change last_phrase_id field on conversation table in DB', () =>
        {

            return db.select('*')
                .from(conversationsTable)
                .where({sender: phoneNumber})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(2, conversation.last_phrase_id);
                })
        });

        it('Should write to the table conversation_history new row ', () =>
        {

            return db.select('*')
                .from(conversationHistory)
                .where({user_id: phoneNumber, text: 'Step 4'})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal('Step 4', conversation.text);
                })
        });
    });

    describe('Step 5', () =>
    {

        it('Should be rejected on step 5 because wait callback', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber)).to.be.rejected;
        });

        it('Should be rejected on step 5 because isPaused = true',
            () =>
            {
                return expect(processMessages.processMessage(to, phoneNumber, null, true)).to.be.rejected;
            });

        it('Should be rejected on step 3 because isPaused = true', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, 'Step 5')).to.be.rejected;
        });

        it('Must not change last_phrase_id field on conversation table in DB', () =>
        {

            return db.select('*')
                .from(conversationsTable)
                .where({sender: phoneNumber})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(2, conversation.last_phrase_id);
                })
        });

        it('Should write to the table conversation_history new row ', () =>
        {

            return db.select('*')
                .from(conversationHistory)
                .where({user_id: phoneNumber, text: 'Step 5'})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal('Step 5', conversation.text);
                })
        });
    });

    describe('Step 6', () =>
    {

        it('Should be rejected on step 6 because wait user action', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, address, true)).to.be.rejected;
        });

        it('Should be rejected on step 6 because isPaused = true', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, address)).to.be.rejected;
        });


        it('Must not change last_phrase_id field on conversation table in DB', () =>
        {

            return db.select('*')
                .from(conversationsTable)
                .where({sender: phoneNumber})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(2, conversation.last_phrase_id);
                })
        });

        it('Should write to the table conversation_history new row ', () =>
        {

            return db.select('*')
                .from(conversationHistory)
                .where({user_id: phoneNumber, text: address})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(address, conversation.text);
                })
        });

    });

    describe('Step 7', () =>
    {

        it('Should be rejected on step 7 because wait user action', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, email, true)).to.be.rejected;
        });

        it('Should be rejected on step 7 because isPaused = true',
            () =>
            {
                return expect(processMessages.processMessage(to, phoneNumber, email)).to.be.rejected;
            });

        it('Must not change last_phrase_id field on conversation table in DB', () =>
        {

            return db.select('*')
                .from(conversationsTable)
                .where({sender: phoneNumber})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(2, conversation.last_phrase_id);
                })
        });

        it('Should write to the table conversation_history new row ', () =>
        {

            return db.select('*')
                .from(conversationHistory)
                .where({user_id: phoneNumber, text: email})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(email, conversation.text);
                })
        });
    });

    describe('Step 8', () =>
    {

        it('Should be rejected on step 8 because wait callback', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber)).to.be.rejected;
        });

        it('Should be rejected on step 8 because isPaused = true', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, null, true)).to.be.rejected;
        });

        it('Should be rejected on step 8 because isPaused = true', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, 'Step 8')).to.be.rejected;
        });

        it('Must not change last_phrase_id field on conversation table in DB', () =>
        {

            return db.select('*')
                .from(conversationsTable)
                .where({sender: phoneNumber})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(2, conversation.last_phrase_id);
                })
        });

        it('Should write to the table conversation_history new row ', () =>
        {

            return db.select('*')
                .from(conversationHistory)
                .where({user_id: phoneNumber, text: 'Step 8'})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal('Step 8', conversation.text);
                })
        });
    });

    describe('Step 9', () =>
    {

        it('Should be rejected on step 9 because wait user action', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, null, true)).to.be.rejected;
        });

        it('Should be rejected on step 9 because isPaused = true',
            () =>
            {
                return expect(processMessages.processMessage(to, phoneNumber, 'Step 9')).to.be.rejected;
            });

        it('Must not change last_phrase_id field on conversation table in DB', () =>
        {

            return db.select('*')
                .from(conversationsTable)
                .where({sender: phoneNumber})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(2, conversation.last_phrase_id);
                })
        });

        it('Should write to the table conversation_history new row ', () =>
        {

            return db.select('*')
                .from(conversationHistory)
                .where({user_id: phoneNumber, text: 'Step 9'})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal('Step 9', conversation.text);
                })
        });

    });

    describe('Step 10', () =>
    {

        it('Should be rejected on step 10 because wait user action', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, null, true)).to.be.rejected;
        });

        it('Should be rejected on step 10 because isPaused = true',
            () =>
            {
                return expect(processMessages.processMessage(to, phoneNumber, 'Step 10')).to.be.rejected;
            });

        it('Must not change last_phrase_id field on conversation table in DB', () =>
        {

            return db.select('*')
                .from(conversationsTable)
                .where({sender: phoneNumber})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(2, conversation.last_phrase_id);
                })
        });

        it('Should write to the table conversation_history new row ', () =>
        {

            return db.select('*')
                .from(conversationHistory)
                .where({user_id: phoneNumber, text: 'Step 10'})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal('Step 10', conversation.text);
                })
        });

    });

    describe('Step 11', () =>
    {

        it('Should be rejected on step 11 because wait callback', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber)).to.be.rejected;
        });

        it('Should be rejected on step 11 because wait callback', () =>
        {
            return expect(processMessages.processMessage(to, phoneNumber, null, true)).to.be.rejected;
        });

        it('Should be rejected on step 11 because isPaused = true',
            () =>
            {
                return expect(processMessages.processMessage(to, phoneNumber, null, true, true, invoiceId)).to.be.rejected;
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

        it('Should be rejected on step 11 because isPaused = true',
            () =>
            {
                return expect(processMessages.processMessage(to, phoneNumber, 'Step 11')).to.be.rejected;
            });

        it('Must not change last_phrase_id field on conversation table in DB', () =>
        {

            return db.select('*')
                .from(conversationsTable)
                .where({sender: phoneNumber})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal(2, conversation.last_phrase_id);
                })
        });

        it('Should write to the table conversation_history new row ', () =>
        {

            return db.select('*')
                .from(conversationHistory)
                .where({user_id: phoneNumber, text: 'Step 11'})
                .limit(1)
                .then(function (conversation)
                {
                    assert.equal('Step 11', conversation.text);
                })
        });
    });

})
