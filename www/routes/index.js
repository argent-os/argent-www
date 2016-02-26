var express = require('express');
var router = express.Router();

/* GET API index page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Zyte' });
});

module.exports = router;