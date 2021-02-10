require('dotenv').config();

//need to make these tokens and numbers private
//later we should put the accountSid and authToken inside the .env file so we can call it from there
//and my number probably idk
//probably means we have to download dotenv to use.

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
var twilioNumber = '+12247013494'

//the customer will be a boolean, to check if we're sending a text to customer or restaurant
const sendText = function(msg, number, timeToSend, orderId, customer) {
  console.log("anything");
  if (customer) {
    setTimeout(function() {
      return client.messages.create({
        body: `${msg} : ${orderId}`,
        to: '+16475153366',  // Text this number
        from: number // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
    //then we can update the order status after
    }, timeToSend)
  } else {
    //sends an sms to restaurant that an order has been submitted
    setTimeout(function() {
      return client.messages.create({
        body: `${msg} : ${orderId}`,
        to: '+16475153366',  // Text this number
        from: number // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
    })
  }
}
//comment this out once we start using it in other files
// sendText('This is order', twilioNumber, 1000, 2, true)
// sendText('An order has been received: Order ', twilioNumber, 1000, 1, false)
exports.sendText = sendText;
