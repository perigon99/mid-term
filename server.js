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
const { NewOrderId, getUserFromCookie, addItemToContent} = require('./server/database');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm',
  port:5432
});
const { sendText } = require('./api/twilio.js');

var twilioNumber = '+12247013494'
const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(bodyParser.urlencoded({extended: true}));
// const toggleModal = require('scriptstwo.js');
// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(bodyParser.json({ type: 'application/*+json' }))
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

const cartRoutes = require("./routes/cart")
const loginRoutes = require("./routes/login");
const logoutRoutes = require("./routes/logout")
const adminsmsRoutes =require("./routes/admin")
const orderRoutes = require("./routes/order")

const { response } = require('express');
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/login", loginRoutes(db));
app.use("/logout", logoutRoutes(db));
app.use("/cart", cartRoutes(db));
app.use("/owner/sms/:id", adminsmsRoutes(db));
app.use("/order", orderRoutes(db));

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
  if (req.session.id) {

    getUserFromCookie(req.session.id)
    .then (user => {
      if(user.is_admin){
        res.render("owner");
      } else {
        const templateVars = {
          logged_in: true,
          username: user.name
        }
        res.render("index", templateVars);
      }
    })
  } else {
    const templateVars = {
      logged_in: false,
    }
    res.render("index", templateVars);
  }
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

//-----------------------------------Owner side queries & routes ------------------------------

app.post('/admin/order', (req, res) => {
  if(req.body) {
    let rowID = req.body
    rowID = Object.keys(rowID)
    rowID = Number(rowID)
    console.log("post request was succesful for orders", rowID);
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
      return console.log(err);
    });
  }
  })

  app.post('/menu/add', (req, res) => {
    if(req.body) {

      const name = req.body.name;
      const price = req.body.price;
      const prep = req.body.prep;
      const type = req.body.type;
      pool.query(`
      insert into menu_items (name, price, prep_time,type_plate)
      values($1,$2,$3,$4)
        `, [name,price,prep,type])
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
          });
      })
      .catch(function (err) {
        return console.log(err);
      });
    }
    })

  app.get('/menu/all', (req, res) => {
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
      return console.log(err);
    });
  }
  )

  app.post('/menu/:id', (req, res) => {
    if(req.params) {
      pool.query(`
      UPDATE menu_items
      SET is_active = true
        WHERE id=$1;
        `, [req.params.id])
      .then(function (data) {
        res.status(200)
      })
      .catch(function (err) {
        return console.log(err);
      });
    }
    })

    app.post('/menu/disable/:id', (req, res) => {

      if(req.params) {
        pool.query(`
        UPDATE menu_items
        SET is_active = false
          WHERE id=$1;
          `, [req.params.id])
        .then(function (data) {
          res.status(200)
        })
        .catch(function (err) {
          return console.log(err);
        });
      }
      })




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
