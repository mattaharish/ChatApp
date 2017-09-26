var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var events = require('events');

var eventEmitter = new events.EventEmitter(); 
// Response Generator
var responseGenerator = require('./../../libs/responseGenerator');

// Authorization Middleware
var auth = require("./../../middlewares/auth");

// User Model
var User = require('../models/User');

// User Register
router.get('/', function (req, res) {
	res.render('signup-signin', {
		userExists: req.flash('userExists'),
		signupSuccess: req.flash('signupSuccess'),
		invalidUser: req.flash('invalidUser'),
		invalidPass: req.flash('InvalidPass')
	});
});

// Register User
router.post('/register', function (req, res) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(password, salt, function (err, hash) {
			password = hash;
			var newUser = new User({
				username: username,
				email: email,
				password: password
			});
			console.log(newUser.password);
			newUser.save(function (err) {
				if (err) {
					req.flash('userExists', 'User already exists');
					res.redirect('/');
				} else {
					req.flash('signupSuccess', 'You are registered and can now login');
					res.redirect('/');
				}
			});
		});
	});
});

//Login Authentication
router.post('/login', function (req, res) {
	var password = req.body.password;
	//console.log(req.body.email);
	User.findOne({
		'email': req.body.email
	}, function (err, user) {
		if (err) {
			//console.log("Error Matta");
			var response = responseGenerator.generate(true, "Some Error",
				500, null);
			res.render('error', {
				message: response.message
			});
		} else if (user == null || user == undefined || user.username == undefined) {
			req.flash('invalidUser', 'Invalid username');
			res.redirect('/');
		} else {
			bcrypt.compare(password, user.password, function (err, result) {
				if (err) {
					var response = responseGenerator.generate(true, "Some Error",
						500, null);
					res.render('error', {
						message: response.message
					});

				} else if (result) {
					//req.user = user;
					req.session.user = user;
					delete req.session.user.password;
					//console.log(result);
					//console.log(result);
					
					eventEmitter.emit('updateOnline', req.session.user.email,res);
					
					//res.end();

				} else {
					//console.log("Matta-HA")
					req.flash('InvalidPass', 'Invalid password');
					res.redirect('/');
					//res.end();
				}
			});
		}
	});
});

  
  //Assign the event handler to an event:
  eventEmitter.on('updateOnline', function(data,res){
	  //console.log("I'm "+data);
	  User.findOneAndUpdate({email:data},{$set:{online:true}},function(err){
		if(err) throw err;
		else{
			res.redirect('/users/online');
		}
  });
});
  
  //Fire the 'scream' event:
  
  

//logout Module
router.get('/logout', function (req, res) {
	eventEmitter.emit('updateOffline', req.session.user.email,req,res);
	
});

eventEmitter.on('updateOffline', function(data,req,res){
	User.findOneAndUpdate({email:data},{$set:{online:false}},function(err){
		if(err) throw err;
		else{
			req.session.destroy(function (err) {
				res.redirect('/');
				//res.end();
			});
		}
	});
});

router.get('/users/chat/:to', auth.checkLogin, function (req, res) {
	//console.log(req.session.user.username);
	//console.log(req.params.to);
	res.render('chat', {
		user: req.session.user.username,
		to:req.params.to
	});
});

router.get('/users/online', auth.checkLogin, function (req, res) {
	User.find({}, function (err, results) {
		if (err) {
			throw err;
		} else {
			//console.log(results);
			res.render('online-users', {
				users: results,
				mainUser: req.session.user.username
			}, function(err,html){
				if(err){
					console.log(err);
				}
				else{
					res.send(html);
				}
			});
		}
	});
});

module.exports = router;