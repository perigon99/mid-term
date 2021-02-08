const express = require('express');
const { getNameWithEmail } = require('../public/scripts/databaseQueries');
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
    const email = req.body.email.toLowerCase()
    const password = req.body.password
    console.log(req.body);
    userAuth(email, password)
    return getNameWithEmail(email)
      .then(user => {
        if (user.password === password) {
          req.session.id = user.id
          res.json({result: true});
        } else {
          res.json({result:false});
        }
      })
      .catch(err => console.log('error', err.stack))
  })
}

// app.post('/login', (req, res) => {
//   pool.query(
//     `
//   SELECT id, name
//   FROM users WHERE email = $1 AND password = $2
//   `, [req.body.email.toLowerCase(), req.body.password]
//   )
//   .then((result)=>{
//     if (result.rows[0]) {
//       console.log(result.rows[0])
//       res.session.id =
//       res.json({result: true});
//     } else {
//       res.json({result: false})
//     }
//   })
//   .catch(err => console.log('error', err.stack))
// });
