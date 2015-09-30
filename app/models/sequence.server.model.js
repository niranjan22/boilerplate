'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Sequence Schema
 */
var SequenceSchema = new Schema({
  name: String,
  seqNumber: Number,
	created: {type: Date, default: Date.now},
	user: {type: Schema.ObjectId, ref: 'User'}  
});
mongoose.model('Sequence', SequenceSchema);