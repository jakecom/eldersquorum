var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

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

/*app.get('/', function(request, response) {
  response.render('pages/index')
});*/

// blog home page
app.get('/', (req, res) => {
  // render `home.ejs` with the list of posts
  res.render('/home', { posts: posts })
})

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


