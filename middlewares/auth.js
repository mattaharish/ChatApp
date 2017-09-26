var mongoose = require('mongoose');
var userModel = require('./../app/models/User')


exports.checkLogin = function(req,res,next){

	if(!req.user && !req.session.user){
		res.redirect('/');
	}
	else{

		next();
	}

}// end checkLogin