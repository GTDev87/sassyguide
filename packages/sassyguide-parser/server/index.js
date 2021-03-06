'use strict';

const express = require('express');
const thematic = require('sass-thematic');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/api/json_style', function (req, res) {
	console.log("inside api style")
  thematic.renderCSS({
  	cwd: __dirname,
    file: '../node_modules/sanitize.css/sanitize.css', //this should be site themes as scss... not css... mistake
    varsData: '$color1: blue; $color2: red;', //default set of vars
    themeData: '$color1: red; $color2: green;', //replacing sert of vars 
    includePaths: ['../style/']
  }, function(err, cssString) {
		console.log("err = %j", err);
		console.log("cssString = %j", cssString);
    res.json(cssString);
    
  });
  
});

module.exports = app;