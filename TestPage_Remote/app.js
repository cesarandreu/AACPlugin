
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express();

//Database URL, taken from the user environment or it uses the default value.
var databaseURL = (process.env.DATABASEURL || 'mongodb://localhost/plugin_license');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
  res.render('index', {title: "Plugin Test Page"});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



//Database 

//Connects to the database
mongoose.connect(databaseURL);

//Defines de database's schema
var LicenseSchema = new mongoose.Schema({
  UserIP: String,
  Hostname: String,
  CreationDate: {
    type: Date,
    expires: 90
  }
});

//Creates a database model which is used to check instances.
var license = mongoose.model('License', LicenseSchema, 'license', false)


app.get('/checkLicense', function(req, res) {
  var answer;
  license.findOne({UserIP: req.ip, Hostname: req.host}, function(err, result) {


    if(err) console.log('Error: ' + error);

    /*
     * Same as the conditional operator below.
    if(result){
      answer = true;
    } else {
      answer = false;
    }
    */

    answer = (result) ? true : false;

    res.json({hasLicense: answer});

  });
});

app.post('/submitLicense', function(req, res) {
    
    var query = license.findOne({UserIP: req.ip, Hostname: req.host});

    if(req.body.submitLicense){

      query.exec(function(err, result) {
        
        if(err) console.log('Error: ' + err);
        
        if(!result){
        //If a result is not found then an entry can be created.

        var newEntry = new license({UserIP: req.ip, Hostname: req.host, CreationDate: Date.now()});
        newEntry.save(function(err) {

          if(err){
            console.log('Error: ' + err);
            res.json({saved: false});
          } else {
            res.json({saved: true});
          }

        });


        } else {
        //If a result is found then it already has an entry and it does nothing.
        res.json({saved: false});

        }

      });

    } else {
      res.json({saved: false});

    }

});








