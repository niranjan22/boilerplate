'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var filemonkeys = require('../../app/controllers/filemonkeys.server.controller');
  var multiparty = require('connect-multiparty');
  var multipartyMiddleware = multiparty();
	// Filemonkeys Routes
	app.route('/filemonkeys')
		.get(filemonkeys.list)
		.post(multipartyMiddleware, filemonkeys.create);

	app.route('/filemonkeys/:filemonkeyId')
		.get(filemonkeys.fetchFile)
		.delete(filemonkeys.delete);
    
	// Finish by binding the Filemonkey middleware
	app.param('filemonkeyId', filemonkeys.filemonkeyByID);
};
