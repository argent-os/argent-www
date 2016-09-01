var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('link', { title: 'Plaid Link' });    
});

module.exports = router;