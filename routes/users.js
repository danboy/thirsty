var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/beer');

var Schema = mongoose.Schema;

var Drinks = new Schema({
  type: { type: String, required: true}
, from: { type: String, requred: true }
});

var User = new Schema({  
  name:       { type: String, required: true, unique: true}
, drinks:     [Drinks]
, email:      { type: String, requred: true }
, lastDrink:  { type: Date, default: Date.now }
, updatedAt:  { type: Date, default: Date.now }
});


var User = mongoose.model('User', User);
/*
 * GET home page.
 */
var Beer = {
  index: function(req, res){
    User.find({}, function(err, users){
      res.render('index', { title: 'Thirsty?', users: users });
    });
  }
, list: function(req, res){
    User.find({}, function(err, users){
      res.send(users);
    });
  }
, show: function(req, res){
    User.findOne({name: req.params.name}, function(err, user){
      res.send(user);
    });
  }
, details: function(req, res){
    User.findOne({name: req.params.name}, function(err, user){
      res.render('show', { title: user.name, user: user});
    });
  }
, recent: function(req, res){
    User.find({$where: "this.drinks.length > 0"}, function(err, recent){
      if(err) throw err;
      res.send(recent);
    });
  }
, create: function(req, res){
    if(req.body.drink){
      User.findOne({name: req.body.drink.to}, function(err, user){
        if(err) throw err;
        if(user){
          user.drinks.push({type: req.body.drink.type, from: req.body.drink.from});
          user.updatedAt = new Date();
          user.save(function(err){
          if(err) throw err;
            res.send(user);
          });
        }else{
          var d = new Date();
          d.setDate(d.getDate()-1);
          user = new User({name: req.body.drink.to, lastDrink: d, email: req.body.drink.email});
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
  }
, checkForDrinks: function(req, res, next){
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
};

module.exports= Beer;

