
/*
 * GET home page.
 */
var Beer = {
  index: function(req, res){
    res.render('index', { title: 'Drinks owed.' })
  }
};

module.exports= Beer;
