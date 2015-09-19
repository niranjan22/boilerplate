'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Filemonkey = mongoose.model('Filemonkey'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, filemonkey;

/**
 * Filemonkey routes tests
 */
describe('Filemonkey CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Filemonkey
		user.save(function() {
			filemonkey = {
				name: 'Filemonkey Name'
			};

			done();
		});
	});

	it('should be able to save Filemonkey instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Filemonkey
				agent.post('/filemonkeys')
					.send(filemonkey)
					.expect(200)
					.end(function(filemonkeySaveErr, filemonkeySaveRes) {
						// Handle Filemonkey save error
						if (filemonkeySaveErr) done(filemonkeySaveErr);

						// Get a list of Filemonkeys
						agent.get('/filemonkeys')
							.end(function(filemonkeysGetErr, filemonkeysGetRes) {
								// Handle Filemonkey save error
								if (filemonkeysGetErr) done(filemonkeysGetErr);

								// Get Filemonkeys list
								var filemonkeys = filemonkeysGetRes.body;

								// Set assertions
								(filemonkeys[0].user._id).should.equal(userId);
								(filemonkeys[0].name).should.match('Filemonkey Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Filemonkey instance if not logged in', function(done) {
		agent.post('/filemonkeys')
			.send(filemonkey)
			.expect(401)
			.end(function(filemonkeySaveErr, filemonkeySaveRes) {
				// Call the assertion callback
				done(filemonkeySaveErr);
			});
	});

	it('should not be able to save Filemonkey instance if no name is provided', function(done) {
		// Invalidate name field
		filemonkey.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Filemonkey
				agent.post('/filemonkeys')
					.send(filemonkey)
					.expect(400)
					.end(function(filemonkeySaveErr, filemonkeySaveRes) {
						// Set message assertion
						(filemonkeySaveRes.body.message).should.match('Please fill Filemonkey name');
						
						// Handle Filemonkey save error
						done(filemonkeySaveErr);
					});
			});
	});

	it('should be able to update Filemonkey instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Filemonkey
				agent.post('/filemonkeys')
					.send(filemonkey)
					.expect(200)
					.end(function(filemonkeySaveErr, filemonkeySaveRes) {
						// Handle Filemonkey save error
						if (filemonkeySaveErr) done(filemonkeySaveErr);

						// Update Filemonkey name
						filemonkey.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Filemonkey
						agent.put('/filemonkeys/' + filemonkeySaveRes.body._id)
							.send(filemonkey)
							.expect(200)
							.end(function(filemonkeyUpdateErr, filemonkeyUpdateRes) {
								// Handle Filemonkey update error
								if (filemonkeyUpdateErr) done(filemonkeyUpdateErr);

								// Set assertions
								(filemonkeyUpdateRes.body._id).should.equal(filemonkeySaveRes.body._id);
								(filemonkeyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Filemonkeys if not signed in', function(done) {
		// Create new Filemonkey model instance
		var filemonkeyObj = new Filemonkey(filemonkey);

		// Save the Filemonkey
		filemonkeyObj.save(function() {
			// Request Filemonkeys
			request(app).get('/filemonkeys')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Filemonkey if not signed in', function(done) {
		// Create new Filemonkey model instance
		var filemonkeyObj = new Filemonkey(filemonkey);

		// Save the Filemonkey
		filemonkeyObj.save(function() {
			request(app).get('/filemonkeys/' + filemonkeyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', filemonkey.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Filemonkey instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Filemonkey
				agent.post('/filemonkeys')
					.send(filemonkey)
					.expect(200)
					.end(function(filemonkeySaveErr, filemonkeySaveRes) {
						// Handle Filemonkey save error
						if (filemonkeySaveErr) done(filemonkeySaveErr);

						// Delete existing Filemonkey
						agent.delete('/filemonkeys/' + filemonkeySaveRes.body._id)
							.send(filemonkey)
							.expect(200)
							.end(function(filemonkeyDeleteErr, filemonkeyDeleteRes) {
								// Handle Filemonkey error error
								if (filemonkeyDeleteErr) done(filemonkeyDeleteErr);

								// Set assertions
								(filemonkeyDeleteRes.body._id).should.equal(filemonkeySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Filemonkey instance if not signed in', function(done) {
		// Set Filemonkey user 
		filemonkey.user = user;

		// Create new Filemonkey model instance
		var filemonkeyObj = new Filemonkey(filemonkey);

		// Save the Filemonkey
		filemonkeyObj.save(function() {
			// Try deleting Filemonkey
			request(app).delete('/filemonkeys/' + filemonkeyObj._id)
			.expect(401)
			.end(function(filemonkeyDeleteErr, filemonkeyDeleteRes) {
				// Set message assertion
				(filemonkeyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Filemonkey error error
				done(filemonkeyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Filemonkey.remove().exec();
		done();
	});
});