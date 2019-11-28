var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var md5 = require('md5');
var sess;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))


var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database:"blog"
});

class ProfileController {
   /**
    * @param {Model} model The default model object
    * for the controller. Will be required to create
    * an instance of the controller
    */
   // constructor(model) {
      // this._model = model;
      // this.create = this.create.bind(this);
 // }

   /**
    * @param {Object} req The request object
    * @param {Object} res The response object
    * @param {function} next The callback to the next program handler
    * @return {Object} res The response object
    */
    static async create(req, res, next) {
    	let obj = req.body;
    	var username = obj.username;
    	var email = obj.email;
    	var password = md5(obj.password);
    	con.query("INSERT INTO admin ('username','email',password) VALUES('"+username+"','"+email+"','"+password+"'", function (err, result, fields) {
    		if (typeof result[0] !== 'undefined') {
    			console.log(result);
    		}
    		else{
    			console.log('false');
    		}
    	});
    }
}