# ml-node-express

This simple REST web application is to show the integration between MarkLogic, MarkLogic Node.js Client API, and express. The appllication shows on how to make a client connection with MarkLogic Server, document CRUD operation, and search query. We assume that you do git clone under your project directory.

## Setup express and a new project

- cd project_directory
- npm install express
- npm install express-generator
- express yourprojectname
- modify your package.json so it will include marklogic. It should look like this:
```
{
  "name": "ml-node-express",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www"
  },
  "dependencies": {
    "body-parser": "~1.10.2",
    "cookie-parser": "~1.3.3",
    "debug": "~2.1.1",
    "express": "~4.11.1",
    "jade": "~1.9.1",
    "morgan": "~1.5.1",
    "serve-favicon": "~2.2.0",
    "marklogic": "*"
  }
}
```
- npm install
- Download MarkLogic server (http://developer.marklogic.com/products) and follow installation instruction (http://docs.marklogic.com/guide/installation)

## Starting up your application

Type npm start on your project directory.

On your web browser, go to: http://localhost:3000

## Including global.js on your views/layout.jade

global.js is the file where you mainly put all the UI, logic, and functions. Declare global.js on layout.jade. The modified layout.jade should look like this:
```
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    block content
    script(src='http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js')
    script(src='/javascripts/global.js')
```    

## Database Connection Config

Create env.js that contains database connection information from MarkLogic Server. Here is the example of env.js file.
```
var dev =  {
  database: "Documents",     // Each connection can specify its own database
  host: "localhost",         // The host against which queries will be run
  port: 8000,                // By default port 8000 accepts Client API requests
  user: "username",          // A user with at least the rest-writer role
  password: "yourpassword",  // Probably not your password
  authType: "DIGEST"         // The default auth
}

module.exports = {
  connection: dev
}
```

## MarkLogic connection on app.js

Modify app.js and add these variables:
```
// Connect to MarkLogic DB
var marklogic = require('marklogic');
var conn = require('./env.js').connection;
var db = marklogic.createDatabaseClient(conn);
var q = marklogic.queryBuilder;
var foods = require('./routes/foods');
```
These lines tell our app that we want to connect to MarkLogic Server.

Look at the lines that look like this:
```
app.use('/', routes);
app.use('/users', users);
```
For this tutorial, we want to add a new router that the app will use, the new code will look like:
```
app.use('/', routes);
app.use('/users', users);
app.use('/foods', foods);
```
Above these lines, add these following codes:
```
// Make ML db accessible to our router
app.use(function(req, res, next){
  req.db = db;
  next();
});

// Make ML queryBuilder accessible to our router
app.use(function(req, res, next){
  req.q = q;
  next();
});
```
These lines will make MarkLogic db and queryBuilder variables accessible to our router.

## MarkLogic Node.js Client API on router/foods.js router

In this router file, we will use MarkLogic Node.js Client API to talk with the MarkLogic database. One example of the call is:
```
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
```
This code is using the search capability to return all documents that belong to a specific collection.
```
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
```
This code is using the CRUD capability to write the JSON content to the database.

For more information on how to use the API, visit our documentation page: http://docs.marklogic.com/jsdoc/index.html

## User interaction on public/javascripts/global.js

This file contains all UIs on the app. Functions to do GET, POST, and DELETE requests are written here. This file is also used to render the html.

One example of the function:
```
// Show Food Info
function showFoodInfo(event) {

  event.preventDefault();

  var foodInfoData = [];
  var foodName = $(this).attr('rel');

  $.getJSON('/foods/foodinfo/' + foodName, function(data) {
    var foodInfo = data[0];
    // Populate Info Box
    $('#foodInfoName').text(foodInfo.content.name);
    $('#foodInfoPrice').text(foodInfo.content.price);
    $('#foodInfoPop').text(foodInfo.content.popularity);
  });
};
```
The tagged variable is controlled by views/index.jade

## Positioning your UI elements with jade

To position your UI elements, you can use jade, My index.jade for this tutorial looks like this:
```
extends layout

block content
  h1= title
  p Welcome to MarkLogic Node.js API

  // Wrapper
  #wrapper

      // FOOD INFO
      #foodInfo
          h2 Food Info
          p
              strong Name:
              |  <span id='foodInfoName'></span>
              br
              strong Price:
              |  <span id='foodInfoPrice'></span>
              br
              strong Popularity:
              |  <span id='foodInfoPop'></span>
      //  /FOOD INFO


      // FOOD LIST
      h2 Food List
      #foodList
          table
              thead
                  th FoodName
                  th Price
                  th Delete?
              tbody
      //  /FOOD LIST

      // ADD FOOD
      h2 Add Food
      #addFood
          fieldSet
              input#inputFoodName(type='text', placeholder='Food name')
              input#inputFoodPrice(type='text', placeholder='price')
              input#inputFoodPop(type='text', placeholder='popularity')
              br
              button#btnAddFood Add Food
      //  /ADD FOOD

      // FOOD SEARCH
      #searchFood
          h2 Food Search
              fieldSet
                  input#inputFoodSearch(type='text', placeholder='onion, tacos, SF')
                  br
                  button#btnSearchFood Search Food
          strong Search Result:
          p
      //  /FOOD SEARCH

  //  /WRAPPER
```
