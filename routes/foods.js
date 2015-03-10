/*
* Copyright 2014-2015 MarkLogic Corporation
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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
