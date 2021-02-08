const express = require('express');
const { getNameWithEmail } = require('../public/scripts/database');
const router = express.Router();
const userAuth = require('../public/scripts/database')



module.exports = (db) => {

  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.post("/login", (req, res) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    console.log(req.body);
    return getNameWithEmail(email)
      .then(user => {
        if (user.password === password) {
          req.session.id = user.id;
          res.json({result: true});
        } else {
          res.json({result:false});
        }
      })
      .catch(err => console.log('error', err.stack))
  });
  return router;
};
