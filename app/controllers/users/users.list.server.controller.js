'use strict';

var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');
  
exports.list = function(req, res) { 
	User.find().sort('-created').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};

exports.read = function(req, res) {
	res.jsonp(req.user);
};

exports.userByID = function(req, res, next, id) { 
	User.findById(id).exec(function(err, user) {
		if (err) return next(err);
		if (! user) return next(new Error('Failed to load User ' + id));
		req.user = user ;
		next();
	});
};

exports.delete = function(req, res) {
	var user = req.user ;

	user.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(user);
		}
	});
};