
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/beer');

var Schema = mongoose.Schema;

var Drinks = new Schema({
  type: { type: String, required: true}
, from: { type: String, requred: true }
});

var User = new Schema({  
  name: { type: String, required: true, unique: true}
, drinks: [Drinks]
, lastDrink: {type: Date, default: Date.now}

});

var User = mongoose.model('User', User);

var app = module.exports = express.createServer();

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
  User.findOne({name: req.body.drink.from}, function(er, pal){
    if(er) throw er;
    console.log(pal);
    if(pal == null){
      next(new Error("That's not a user"));
    }
    var hasDrinksToGive = function(){
      var today = new Date();
      var lastbeer = new Date(pal.lastDrink);
      console.log(lastbeer, today);
      if(lastbeer.getMonth() == today.getMonth() && lastbeer.getDate() == today.getDate()){
        return false;
      }else{
        return true;
      }
    }
    if(pal && hasDrinksToGive()){
      pal.lastDrink = new Date();
      pal.save(function(er){
        next();
      });
    }else{
      next(new Error('User Has no drinks to give.'));
    }
  });
}

// Routes

app.get('/', function(req, res){
  User.find({}, function(err, users){
    res.render('index', { title: 'Drinks owed.', users: users });
  });
});
app.get('/users', function(req, res){
  User.find({}, function(err, users){
    res.send(users);
  });
});

app.get('/users/:name', function(req, res){
  User.findOne({name: req.params.name}, function(err, user){
    res.send(user);
  });
});

app.post('/users', checkForDrinks, function(req, res){
  if(req.body.drink){
    User.findOne({name: req.body.drink.to}, function(err, user){
      if(err) throw err;
      if(user){
        user.drinks.push({type: req.body.drink.type, from: req.body.drink.from});
        user.save(function(err){
        if(err) throw err;
          res.send(user);
        });
      }else{
        var d = new Date();
        d.setDate(d.getDate()-1);
        user = new User({name: req.body.drink.to, lastDrink: d});
        user.drinks.push({type: req.body.drink.type, from: req.body.drink.from});
        user.save(function(err){
        if(err) throw err;
          res.send(user);
        });
      }
    });
  }else{
    res.send({'error': 'looks like you\'re missing some stuff'})
  }
});
app.post('/dan',function(req, res){
  dan = new User({name: 'Dan Nawara'});
  dan.drinks.push({type: 'beer', from: 'Dan Nawara'});
  dan.save(function(er){
    if(!er){
      res.send("created dan\n")
    }
  });
})
app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
