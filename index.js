'use strict'

var mongoose = require('mongoose');
var app =require('./app');
var port = process.env.PORT || 3977;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/spotify',(err,res)=>{
  if (err) {
    throw err;
  }else {
    console.log('db running ◕◡◕  ...');
    app.listen(port,function(){
      console.log('booting spotify on http://localhost:3977/');
    });
  }
});
