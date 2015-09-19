'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Filemonkey = mongoose.model('Filemonkey');

/**
 * Globals
 */
var user, filemonkey;

/**
 * Unit tests
 */
describe('Filemonkey Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			filemonkey = new Filemonkey({
				name: 'Filemonkey Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return filemonkey.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			filemonkey.name = '';

			return filemonkey.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Filemonkey.remove().exec();
		User.remove().exec();

		done();
	});
});