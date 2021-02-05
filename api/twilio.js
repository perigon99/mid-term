var twilio = require('twilio');
//later we should put the accountSid and authToken inside the .env file so we can call it from there
//and my number probably idk
//probably means we have to download dotenv to use.
var accountSid = 'ACf8852a65ccb9ae8c38a4ed4968f60178';
var authToken = 'fdba5bd0a14c0ccab84814a91c42c824'

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);
var twilioNumber = '+12247013494'

const sendText = function(msg, number, timeToSend, orderId) {
  if (timeToSend) {
    setTimeout(function() {
      return client.messages.create({
        body: `${msg} : ${orderId}`,
        to: '+16475153366',  // Text this number
        from: number // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
    //then we can update the order status after
    }, timeToSend)
  }
}
//comment this out once we start using it in other files
sendText('This is order', twilioNumber, 1000, 2)
exports.sendText = sendText;
