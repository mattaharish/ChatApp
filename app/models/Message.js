var mongoose = require( 'mongoose' );
//var bcrypt = require( 'bcryptjs' );

// User Schema
var MessageSchema = mongoose.Schema( {

	from: {
		type: String,
	},
	to: {
		type: String,
	},
	message: {
		type: String,
	},
	date:{
		type: Date,
	}
} );

var Message = module.exports = mongoose.model( 'Message', MessageSchema );
