const express = require('express');
const router = express.Router();
const userAuth = require('../scripts/public/scripts/databaseQueries')

module.exports = (db) => {
  router.get("/login", (req, res) => {
    res.render("login");
  })
}
// app.get("/menu", (req, res) => {
//   console.log("This page exists");
//   res.send(getUsers)
// })

module.exports = (db) => {
  router.post("/login", (req, res) => {
    console.log(req.body);
    userAuth(req.body.email.toLowerCase, req.body.password)
  })
}

app.post('/login', (req, res) => {
  console.log(req.body);
  pool.query(
    `
  SELECT id, name
  FROM users WHERE email = $1 AND password = $2`, [req.body.email.toLowerCase(), req.body.password]
  )
  .then((result)=>{
    if (result.rows[0]) {
      res.json({result: true});
    } else {
      res.json({result: false})
    }
  })
  .catch(err => console.log('error', err.stack))
});
