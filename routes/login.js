const express = require('express');
const router = express.Router();
const { getNameWithEmail } = require('../server/database');

module.exports = (db) => {
  router.post("/", (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    console.log(req.body);
    return getNameWithEmail(email)
      .then(user => {
        if (user.password === password) {
          res.cookie(user.name, user.is_admin);
          res.json({name: user.name});
        } else {
          res.json({result:false});
        }
      })
      .catch(err => console.log('error', err.stack))
  });
  return router;
};
