var cool = require('cool-ascii-faces');
var path = require('path');
var express = require('express');
var app = express();

var parseurl = require('parseurl');
var session = require('express-session');

// set up sessions
app.use(session({
  secret: 'my-super-secret-secret!',
  resave: false,
  saveUninitialized: true
}));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', (process.env.PORT || 5000));





app.use(express.static(path.join(__dirname, 'public')));



//app.use(express.static(__dirname + '/public'));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.use(logRequest);



app.set('view engine', 'ejs');




const posts = [
  {
    id: 1,
    author: 'Bishop Jensen',
    title: 'Ward Christmas Party',
    date: '12/9/17',
    time: '6:00 pm',
    body: 'It is that time of year for the ward Christmas party. Bring your friends, family, and an entree/side/dessert for the potluck'
  },
  {
    id: 2,
    author: 'President Burton',
    title: 'Indexing Party',
    date: '11/9/17',
    time: '6:30 pm',
    body: 'We will be having an indexing night at the Nielson home. Bring your laptop. Pizza will be provided, and the Seahawks will be on.'
  },
  {
    id: 3,
    author: 'President Burton',
    title: '5k Run',
    date: '4/29/17',
    time: '8:00 am',
    body: 'Come on down to the Park for the 5k run.'
  }
]


//app.get('/log', function(request, response) {
//  response.render('pages/test', { posts: posts })
//});

//app.get('/rest.js', function(request, response) {
//  response.render('pages/rest.js', { posts: posts })
//});

app.post('/login', handleLogin);
app.post('/logout', handleLogout);

app.get('/getServerTime', verifyLogin, getServerTime);

app.get('/', function(request, response) {
  response.render('pages/index', { posts: posts })
});

/* blog home page
app.get('/', (req, res) => {
  // render `home.ejs` with the list of posts
  response.render('/home', { posts: posts })
})*/

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


/*************************************************************
* Sessions/Login
*************************************************************/
function handleLogin(request, response) {
	var result = {success: false};
	if (request.body.username == "jack" && request.body.password == "jackson") {
		request.session.user = request.body.username;
		result = {success: true};
	}

	response.json(result);
}

function handleLogout(request, response) {
	var result = {success: false};
	if (request.session.user) {
		request.session.destroy();
		result = {success: true};
	}

	response.json(result);
}

function getServerTime(request, response) {
	var time = new Date();
	
	var result = {success: true, time: time};
	response.json(result); 
}

function verifyLogin(request, response, next) {
	if (request.session.user) {
		next();
	} else {
		var result = {succes:false, message: "Access Denied"};
		response.status(401).json(result);
	}
}

function logRequest(request, response, next) {
	console.log("Received a request for: " + request.url);
	next();
}




/***********************************************************
* Announcements, Homepage
************************************************************/
var pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT id, first, last FROM person ORDER BY id', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else{
 response.render('pages/db', {results: result.rows} ); 
      }  
    });
  });
});

app.get('/report', function (request, response) {

if (request.session.user){

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT id, first, last FROM person ORDER BY id', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else{
 response.render('pages/report', {results: result.rows} ); 
      }  
    });
  });

} else {
	response.redirect('/test.html');
}
});

// blog post
app.get('/post/:id', (request, response) => {
  
  const post = posts.filter((post) => {
    return post.id == request.params.id
  })[0]

  
  response.render('pages/post.ejs', {
    author: post.author,
    title: post.title,
    date: post.date,
    time: post.time,
    body: post.body
  })
})








