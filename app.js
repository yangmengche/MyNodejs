
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
//  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var settings = require('./settings');
//var MongoStore = require('connect-mongodb');
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('keyboard cat'));
app.use(express.session({
  cookie: {maxAge: 60000},
  secret: settings.cookieSecret,
  store: new MongoStore({
    db: settings.db
  })
}));

app.use(flash());

app.use(function(req, res, next){
  res.locals.user = req.session.user;
  var err = req.flash('error');
  if(err.length)
    res.locals.error = err;
  else
    res.locals.error = null;
  var succ = req.flash('success');
  if(succ.length)
    res.locals.success = succ;
  else
    res.locals.success = null;
  next();
});

app.use(app.router);
//app.use(express.router(routes));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

/*
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/hello', routes.hello);
app.get('/user/:username',function(req,res){
  res.send('user: ' + req.params.username);
});
*/

/*
app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('logout', routes.logout);
*/

/*
app.dynamicHelpers({
  user: function(req, res){
    return req.session.user;
  },
  error: function(req, res){
    var err = req.flash('error');
    if(err.length)
      return err;
    else
      return null;
  },
  success: function(req, res){
    var succ = req.flash('success');
    if(succ.length)
      return succ;
    else
      return null;
  },
});
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
