var cool = require('cool-ascii-faces');
var path = require('path');
var express = require('express');
var app = express();

//var parseurl = require('parseurl')
var session = require('express-session');

// set up sessions
app.use(session({
  secret: 'my-super-secret-secret!',
  resave: false,
  saveUninitialized: true
}))

var bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(logRequest);

app.post('/login', handleLogin);
app.post('/logout', handleLogout);

app.get('/getServerTime', verifyLogin, getServerTime);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


// views is directory for all template files
app.set('views', __dirname + '/views');

// fake posts to simulate a database
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

app.set('view engine', 'ejs');


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


var pg = require('pg');

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT id, first, last FROM person', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else{
 response.render('pages/db', {results: result.rows} ); 
      }  
    });
  });
});

// blog post
app.get('/post/:id', (request, response) => {
  // find the post in the `posts` array
  const post = posts.filter((post) => {
    return post.id == request.params.id
  })[0]

  // render the `post.ejs` template with the post content
  response.render('pages/post.ejs', {
    author: post.author,
    title: post.title,
    date: post.date,
    time: post.time,
    body: post.body
  })
})








/*************************************************************
* Sessions/Login
*************************************************************/
function handleLogin(request, response) {
	var result = {success: false};
	if (request.body.username == "admin" && request.body.password == "password") {
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