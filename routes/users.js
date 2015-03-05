var express = require('express');
var router = express.Router();

/* GET foodList. */
router.get('/userlist', function(req, res) {
  var db = req.db;
  var q = req.q;
  
  db.documents.query(
    q.where(
      q.collection('entree')
    )
  ).
  result(function(records){
    res.json(records);
  });
});

module.exports = router;
