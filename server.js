// load .env data into process.env
require('dotenv').config();
// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect((err) => {
  if (err) throw new Error(err);
  console.log('connected!');
});
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm',
  port:5432
});
// app.use(bodyParser.urlencoded({extended: true}));
// const toggleModal = require('scriptstwo.js');
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const { response } = require('express');
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above
// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
const getUsers = () => {
  pool.query(`SELECT *
  FROM menu_items
  where is_active = true`).then(function (data) {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved ALL menu items'
      });
  })
  .catch(function (err) {
    return next(err);
  });
}
app.get("/", (req, res) => {
  let isAdmin = false;
  if(isAdmin) {
    res.render("owner")
  } else {
    res.render("index");
  }

});
app.get("/login", (req, res) => {
  res.render("login");
});
// app.get("/menu", (req, res) => {
//   console.log("This page exists");
//   res.send(getUsers)
// })
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
app.get('/menu', (req, res) => {
  console.log(req.body)
  console.log("post request was succesful for menu");
  pool.query(`
  SELECT *
  FROM menu_items
  `)
  .then(function (data) {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved ALL menu items'
      });
  })
  .catch(function (err) {
    return next(err);
  });
}
)

//-----------------------------------Order query ------------------------------
app.get('/order', (req, res) => {
  console.log(req.body)
  console.log("post request was succesful for orders");
  pool.query(`
  SELECT *
  FROM orders
  JOIN users ON users_id = users.id
  where orders.is_pickedup = false
  GROUP BY orders.id, users.id
  ORDER BY orders.id desc
  `)
  .then(function (data) {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'Retrieved ALL menu items'
      });
  })
  .catch(function (err) {
    return next(err);
  });
}
)

app.post('/order', (req, res) => {
  let rowID = req.body
  rowID = Object.keys(rowID)
  rowID = Number(rowID)
  console.log("post request was succesful for orders");
  pool.query(`
  UPDATE orders
  SET is_pickedup = true
  WHERE id = $1;
  `, [rowID])
  .then(function (data) {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        message: 'post request comming trougth'
      });
  })
  .catch(function (err) {
    return next(err);
  });
}
)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
