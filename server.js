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
console.log("This is the send text require", sendText );

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

const loginRoutes = require("./routes/login");
const logoutRoutes = require("./routes/logout")

const { response } = require('express');
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/login", loginRoutes(db));
app.use("/logout", logoutRoutes(db));

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

app.put('/order', (req, res) => {
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
      return next(err);
    });
  }
}
)

app.post('/cart', (req, res) => {

    console.log("Backend receiving req",req.body);


    // NewOrderId(user.id);

    // for each row, add the items

    // rowID = Object.keys(rowID)
    // rowID = Number(rowID)

    // pool.query(`
    //   INSERT INTO orders (users_id)
    //   VALUES($2) RETURNING id;
    // `, [rowID])
   // .then(function (data) {
     // get user_id from the cookie
//----------------------------------instructions ----------------------------------------------
     // get user_id from cookie =>> do the first query to create a new order with the user id
     //first query INSERT INTO orders (users_id)
      // VALUES(2) RETURNING id;
     //then from the response data from the query 1
     //do : INSERT INTO orders_content (menu_item_id, orders_id)
     //VALUES(id of the menu item,the value that will be return by firt query);
//----------------------------------instruction
     getUserFromCookie(req.session.id)
      .then (result => {
        NewOrderId(result.id)
        .then (result => {
          console.log("THIS ONE IS THE RESULT:", result.id);
          for (item of req.body) {
            addItemToContent(result.id, item.id)
              .then(function (result) {
                console.log("THIS IS THE FINAL?:", result)
              })
              .catch(function (err) {
                console.log(err);
              })
          }
          sendText('This is order', twilioNumber, 1000, 2, true)
          sendText('An order has been received: Order ', twilioNumber, 1000, 1, false)
        })
      })
  //     console.log(data);
  //     pool.query(`
  //     INSERT INTO orders (users_id)
  //     VALUES($2) RETURNING id;
  //   `, [user_id])
  //  .then(function (data) {

      res.status(200)
        .json({
          status: 'success',
          data: "data",
          message: 'post request comming trougth'
        });
    // })
    // .catch(function (err) {
    //   return console.log(err);
    // });

}
)

// app.delete('/cart', (req, res) => {
//   console.log("Receiving from req", req.body);
//   console.log("receiving from res", res.body);
// })

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
