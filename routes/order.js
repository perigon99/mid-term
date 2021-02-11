const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm',
  port:5432
});

module.exports = (db) => {
  router.get("/", (req, res) => {
    pool.query(`
    SELECT *, orders.id as order_id
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
      return console.log(err);
    });
  })
  router.post('/:id', (req, res) => {
    pool.query(`
    select *, orders_content.id as target
    from orders_content
    join menu_items on menu_item_id = menu_items.id
    where orders_id = $1
    `, [req.params.id])
  .then(function (data) {
    res.status(200)
      .json({
        status: 'success',
        data: data.rows,
        message: 'post request comming trougth'
      });
      console.log(data.rows)
  })
  .catch(function (err) {
    return console.log(err);
  })
  })
  router.post('/item/:id', (req, res) => {
    if(req.body) {
      pool.query(`
      DELETE FROM orders_content
        WHERE id=$1;
        `, [req.params.id])
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data.rows,
            message: 'post request comming trougth'
          });
          console.log(data.rows)
      })
      .catch(function (err) {
        return console.log(err);
      });
    }
  })
  return router;
}


