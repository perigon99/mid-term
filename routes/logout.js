const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    req.session.id = null;
    res.json({success: true})
  })
  return router;
}
