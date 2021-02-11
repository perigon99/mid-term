const express = require('express');
const router = express.Router()
const {getUserFromCookie, NewOrderId, addItemToContent} = require('../server/database');
const {sendText} = require('../api/twilio')
var twilioNumber = '+12247013494'


module.exports = (db) => {
router.post('/', (req, res) => {

  getUserFromCookie(req.session.id)
   .then (result => {
     NewOrderId(result.id)
     .then (result => {
       for (item of req.body) {
         addItemToContent(result.id, item.id)
           .then(function (result) {
           })
           .catch(function (err) {
             console.log(err);
           })
       }
       sendText('This is order', twilioNumber, 1000, 2, true)
       sendText('An order has been received: Order ', twilioNumber, 1000, 1, false)
     })
   })
}
)
return router;
};
