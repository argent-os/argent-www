var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.json({
    "applinks": {
      "apps": [],
      "details": [
        {
          "appID": "95ZGR52Q89.com.argentapp.ios",
          "paths":[ "*" ]
        }
      ]
    }
  })   
});

module.exports = router;

