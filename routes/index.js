var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/beer');

var Schema = mongoose.Schema;

var Drinks = new Schema({
  type: { type: String, required: true}
, from: { type: String, requred: true }
});

var User = new Schema({  
  name: { type: String, required: true}
, drinks: [Drinks]
, lastDrink: {type: Date, default: Date.now}

});

var User = mongoose.model('User', User);
/*
 * GET home page.
 */
var Beer = {
  index: function(req, res){
    User.find({}, function(err, users){
      res.send({ title: 'Drinks owed.', users: users });
    });
  }
, create: function(req, res){
    if(req.body.drink){
        User.findOne({name: req.body.drink.to}, function(err, user){
          if(err) throw err;
          if(user){
            //user.drinks
            user.drinks.push({type: req.body.drink.type, from: req.body.drink.from});
            user.save(function(err){
            if(err) throw err;
              res.send(user);
            });
          }else{
            user = new User({name: req.body.drink.to});
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
};

module.exports= Beer;

