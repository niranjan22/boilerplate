'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Filemonkey Schema
 */
var FilemonkeySchema = new Schema({
	filename: {type: String},
  fileuuid: {type: String},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Filemonkey', FilemonkeySchema);