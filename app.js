// Setup
var express = require('express');
const session = require('express-session');
var flash = require('connect-flash');
var app = express();
app.use(session({secret: 'blog'}));
app.use(flash());
var mysql = require('mysql');
var bodyParser = require('body-parser');
var md5 = require('md5');
var sess;
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


var profile = require('./controller/ProfileController');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"blog"
});


// home Route
app.get("/", (req, res) => {
   res.redirect('/admin');
});

// Login page
app.get("/admin", (req, res )=> {
	var success = {};
    success = req.flash('success');
    error = req.flash('error');
    res.render('sign-in',{success : success,error:error});
});

// Login authentication
app.post("/authenticate", (req, res) => {
	var username = req.body.username;
	var email = req.body.email;
	var password = md5(req.body.password);
	con.query("SELECT * FROM admin where username='"+username+"' and password='"+password+"'", function (err, result, fields) {
		if (typeof result[0] !== 'undefined') {
			sess=req.session;
    		sess.email = result[0].email;
    		sess.username = result[0].username;
    		sess.user_id = result[0].id;
			res.redirect('/dashboard');
		}
		else{
			req.flash('error','Authentication failed.');
			res.redirect('/admin');
		}
	});
});

// Dashboard
app.get("/dashboard", (req, res ,next) => {
	sess = req.session;
    if(sess.email) {
   		res.render('dashboard');
   		next();
    }
	req.flash('error','Authentication failed.');
    res.redirect('/admin');
});

// logout
app.get('/logout', (req, res ,next) => {
	sess=req.session;
	sess.email = null;
	sess.username = null;
	sess.user_id = null;
	req.flash('success','You have logout successfully.');
    res.redirect('/admin');
});

app.get('/profile',profile.create);



//DATABSE 
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
// Listen
app.listen(3000, () => {
    console.log('Server listing on 3000');
})