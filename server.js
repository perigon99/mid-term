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
const dbParams = require('./lib/db.js');
const { Pool } = require('pg');
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

const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

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

const loginRoutes = require("./routes/login");
const database = require("./server/database")

const { response } = require('express');
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

// login endpoints
app.use("/login", loginRoutes(db));

// app.post("/login", (req, res) => {
//   console.log("login", req);
// })
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
  res.render("index");
});
app.post('/menu', (req, res) => {
  console.log(req.body)
  console.log("post request was succesful for menu");
  pool.query(`
  SELECT *
  FROM menu_items
  `)
  then(function (data) {
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
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
