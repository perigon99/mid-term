const { AddOnResultInstance } = require("twilio/lib/rest/api/v2010/account/recording/addOnResult");

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

const addUser = (user) => {
  const queryString = `
  INSERT INTO users(name, email, password, created_at, telephone, is_admin)
  VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4,  $5)
  RETURNING *;
  `
}

exports.addUser = addUser;

const addItemToContent = function(order) {

}

exports.addItemToContent = addItemToContent

const getNameWithEmail = function(email) {
  const queryString = `
  SELECT * FROM users
  WHERE email = $1;
  `;

  const queryParams = [email];

  return pool.query(queryString, queryParams)
    .then(result => {
      if (result.rows == null) {
        return null;
      } else {
        return result.rows[0];
      }
    })
}

exports.getNameWithEmail = getNameWithEmail;

const showAllOrders = function(userId) {
  let orders = [];
  const queryString = `
  SELECT orders.*, max(menu_items.prep_time) as time
  FROM orders
  JOIN orders_content ON orders_id = orders.id
  JOIN menu_items ON orders_content.menu_item_id = menu_items.id
  WHERE orders.id = $1
  GROUP BY orders.id;
  `
  queryParams = [userId]
  return pool.query(queryString, queryParams)
    .then(result => {
      if (result.rows == null) {
        return null;
      } else {
        return result.rows[0];
      }
    })
}

exports.showAllOrders = showAllOrders;

const totalCost = function(order, user) {
  const queryString = `
  SELECT sum(menu_items.price)
  FROM orders
  JOIN orders_content ON orders_id = orders.id
  JOIN menu_items ON orders_content.menu_item_id = menu_items.id
  WHERE orders.id = $1 AND orders.users_id = $2;
  `

  const queryParams = [order, user]

  return pool.query(queryString, queryParams)
    .then(result => {
      return result.rows[0];
    })

}

exports.totalCost = totalCost;
