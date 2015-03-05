var express = require('express');
var router = express.Router();

/* GET foodList. */
router.get('/foodlist', function(req, res, next) {
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

/* POST new food. */
router.post('/addfood', function(req, res, next) {
  var db = req.db;
  var foodName = req.body.foodname;
  var foodPrice = req.body.foodprice;
  var foodPop = req.body.foodpop;  

  db.documents.write({
    uri: '/menu/entree/' + foodName + '.json',
    collections: ['entree'],   
    contentType: 'application/json',
    content: {
      name: foodName,
      popularity: foodPop,
      price: foodPrice
    }
  }).
  result(function(err, result){
    res.send(
      (err === null) ? {msg: ''} : {msg: err }
    );
  });
});

/* GET food info. */
router.get('/foodinfo/:name', function(req, res, next) {
  var db = req.db;
  var foodInfo = req.params.name;
  var uri = '/menu/entree/' + foodInfo + '.json'; 

  db.documents.read({uris: uri}).
  result(function(response, err){
    res.send(response);
  });
});


/* DELETE to remove food. */
router.delete('/removefood/:name', function(req, res, next) {
  var db = req.db;
  var foodToRemove = req.params.name;
  var uri = '/menu/entree/' + foodToRemove + '.json'; 

  db.documents.remove(uri).
  result(function(err, result){
    res.send(
      (err === null) ? {msg: '' } : {msg: err }
    );
  });
});

/* GET searched food. */
router.get('/searchfood/:foodquery', function(req, res, next) {
  var db = req.db;
  var q = req.q;
  var foodQuery = req.params.foodquery;

  db.documents.query(
    q.where(
      q.term(foodQuery)
    )
  ).
  result(function(records){
    res.json(records);
  });

});

module.exports = router;
