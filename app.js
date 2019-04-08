'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
var AWS = require('aws-sdk');

const app = new App();

app.use(
    new GoogleAssistant(),
    new JovoDebugger(),
    new FileDb()
  );

AWS.config.update({region: 'us-east-1'});
// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    LAUNCH() {
        return this.toIntent('HelloWorldIntent');
    },

    HelloWorldIntent() {
        this.ask('Hello, welcome to Bennett University. How may I help you?');
    },

    BreakfastIntent() {
        this.tell("Today's breakfast is pav bhaji, bread and butter, corn flakes, as well as tea and coffee. Have a great day!");
    },

    LunchIntent() {
        this.tell("Lunch today is rice, aloo gravy, curd and butter roti. There's probably a queue, so better hurry!");
    },

    DinnerIntent(){
        this.tell("For dinner today there's rice, white sauce pasta, butter roti, curd, as well as ice cream. Enjoy!")
    },

    NextClass(){
      this.tell("Your next class is Java by Prof Rishav Singh, at 9:30 AM, Ground Floor Lecture Hall.")
    },

  RoomClean(){

        var params = {
        Message: 'Cleaning requested in room '+ this.$inputs.number.value + '.',
        TopicArn: 'arn:aws:sns:us-east-1:902127749216:Bennett_Buddy'
      };
      var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
      this.tell("I've let housekeeping know. They'll be at room "+ this.$inputs.number.value+" soon.")
    },

    Fallback(){
      var errorUtterance = this.$request.queryResult.queryText
      var params = {
      Message: "Fallback deployed for: "+ errorUtterance,
      TopicArn: 'arn:aws:sns:us-east-1:902127749216:BennettSkillError'
    };
    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
    this.ask("Sorry champ, I didn't understand that. How may I help you?")
    },

    End(){
      this.tell("Talk to you later, champ.")
    },
    Assistance(){
      this.followUpState('Assist').ask("Where are you right now?")
    },
    Assist: {
      AssistLocation(){
        var assistUtt = this.$request.queryResult.queryText
        var params = {
        Message: 'Urgent medical assistance requested at '+assistUtt+ '.',
        TopicArn: 'arn:aws:sns:us-east-1:902127749216:Bennett_Buddy'
      };
      var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
      this.tell("Hang on, a medical team is on the way.")
      },
    },



});

module.exports.app = app;
