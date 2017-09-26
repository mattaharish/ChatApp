var mongoose = require( 'mongoose' );
//var bcrypt = require( 'bcryptjs' );

// User Schema
var UserSchema = mongoose.Schema( {

	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	online:{
		type: Boolean,
		default : false
	}
} );

var User = module.exports = mongoose.model( 'User', UserSchema );
