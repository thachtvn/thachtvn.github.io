const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const { getAllBooks, addBook, deleteBook, editBook } = require('./index');
const port = 8000;


var connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234",
  database: "db_book"
});

connect.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

// set global for connect
global.connect = connect;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/view'); // set express to look in this folder to render our views
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: true }))// parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'img'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
// routes for the app
app.get('/', getAllBooks);
app.post('/addBook', addBook);
app.get('/deleteBook/:id', deleteBook);
// app.post('/add', function(request, response){
//   response.send(request.body);
// });
app.post('/editBook', editBook);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});