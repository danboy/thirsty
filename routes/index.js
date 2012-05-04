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
      res.send({ title: 'Drinks owed.' });
    });
  }
};

module.exports= Beer;
