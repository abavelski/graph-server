#!/bin/env node
var express = require('express'),
app = express(),
morgan  = require('morgan'),
bodyParser = require('body-parser'),
companies = require('./routes/companies');


app.use(morgan('short'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded());

  var router = express.Router();

  companies(router);


  app.use('/', router);
  app.listen(8000);
  console.log('Server started at 8000');
