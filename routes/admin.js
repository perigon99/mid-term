const express = require('express');

const router = express.Router();
const {smsSender} = require('../api/twilio');

module.exports = (db) => {
  router.post('/', (req, res) => {
    let telephone = Object.keys(req.body)
    let twilionumber = "+1";
    twilionumber += telephone
    if(req.params) {
      smsSender(`Your order is ready for pickup`, twilionumber, 1000, 1, true)
    }
    })
  return router;
  };
