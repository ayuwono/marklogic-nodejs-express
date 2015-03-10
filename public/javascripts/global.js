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

// Foodlist data array for filling in info box
var foodListData = [];
var foodSearchListData = [];

// DOM Ready ==========================================
$(document).ready(function() {

  // Populate the food table on initial page load
  populateTable();

  // Food Name link click
  $('#foodList table tbody').on('click', 'td a.linkshowfood', showFoodInfo);

  // Add Food button click
  $('#btnAddFood').on('click', addFood);

  // Remove Food link click
  $('#foodList table tbody').on('click', 'td a.linkremovefood', removeFood);

  // Search Food button click
  $('#btnSearchFood').on('click', searchFood);
  

});

// Functions ==========================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON('/foods/foodlist', function(data) {
    
    // Stick our food data array into foodList variable in the global object
    foodListData = data;
  
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowfood" rel="' +  this.content.name + '">' + this.content.name + '</a></td>';
      tableContent += '<td>' + this.content.price + '</td>';
      tableContent += '<td><a href="#" class="linkremovefood" rel="' + this.content.name + '">remove</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#foodList table tbody').html(tableContent);

  });
};

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

// Add Food
function addFood(event) {
  event.preventDefault();

  var errorCount = 0;
  $('#addFood input').each(function(index, val) {
    if($(this).val() === '') {errorCount++; }
  });

  // Check and make sure errorCount is still at zero
  if(errorCount === 0) {
    //If it is, compile all food info into one object
    var newFood = {
      'foodname': $('#addFood fieldset input#inputFoodName').val(),
      'foodprice': $('#addFood fieldset input#inputFoodPrice').val(),
      'foodpop': $('#addFood fieldset input#inputFoodPop').val()
    }
    
    // User AJAX to post the object to our addfood service
    $.ajax({
      type: 'POST',
      data: newFood,
      url: '/foods/addfood',
      dataType: 'JSON'
    }).done(function(response) {
      
      // Check for successful (blank) response
      if (response.msg !== '') {

        // Clear the form inputs
        $('#addFood fieldset input').val('');

        // Update the table
        populateTable();
      }
      else {
        
        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }

};

// Remove Food
function removeFood(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to remove this food?');

  // Check and make sure the user confirmed
  if (confirmation === true) {
    
    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/foods/removefood/' + $(this).attr('rel')
    }).done(function(response) {
      
      // Check for a successful (blank) response
      if (response.msg !== '') {
      }
      else {
        alert('Error: ' + response.msg);
      }
      
      // Update the table
      populateTable();
    });
  }
  else {

    // If they said no to the confirm, do nothing
    return false;
  }
};

// Search Food
function searchFood(event) {
  var searchResultContent = '';
  
  event.preventDefault();

  var foodQuery = $('#searchFood fieldset input#inputFoodSearch').val();
    
  // User AJAX to post the object to our addfood service
  $.getJSON('/foods/searchfood/' + foodQuery, function(data) {

    foodSearchListData = data;
    
    $.each(data, function() {
      searchResultContent += '<ul>';
      searchResultContent += '<li>' + this.uri + ': ' + this.content.name + ' is a great menu with price $' + this.content.price + ', popularity is ' + this.content.popularity + '!!!.' + '</li>';
      searchResultContent += '</ul>';
    });
  
    // Inject the whole content string into our search result
    $('#searchFood p').html(searchResultContent);  
  });
};

// Show Food Info with array
/*function showFoodInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve foodname from link rel attribute
  var thisFoodName = $(this).attr('rel');
  
  // Get Index of object based on id value
  var arrayPosition = foodListData.map(function(arrayItem) { return arrayItem.content.name; }).indexOf(thisFoodName);

  // Get our Food Object
  var thisFoodObject = foodListData[arrayPosition];

  // Populate Info Box
  $('#foodInfoName').text(thisFoodObject.content.name);
  $('#foodInfoPrice').text(thisFoodObject.content.price);
  $('#foodInfoPop').text(thisFoodObject.content.popularity);

};*/
