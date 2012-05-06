/**
 * Module dependencies.
 */

var express = require('express')
  , users = require('./routes/users')
  , app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


var checkForDrinks= function(req,res,next){
}

// Routes
console.log(users.list);
app.get('/', users.index);


app.get('/recent', users.recent);

app.get('/users', users.list);

app.post('/users', users.checkForDrinks, users.create);

app.get('/users/:name', users.details);

app.get('/:name', users.show);

app.listen(8334);
console.log("Thirsty is at your service %d in %s mode", app.address().port, app.settings.env);
