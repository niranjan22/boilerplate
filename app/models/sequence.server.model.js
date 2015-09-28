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
  seqNumber: Number
});
mongoose.model('Sequence', SequenceSchema);