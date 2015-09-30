'use strict';

module.exports = function(app) {
	var sequences = require('../../app/controllers/sequences.server.controller');

	// Sequences Routes
	app.route('/sequences')
		.get(sequences.list)
    .post(sequences.create);

	app.route('/sequences/:sequenceId')
		.get(sequences.read)
    .put(sequences.update)
		.delete(sequences.delete);

	// Finish by binding the Sequence middleware
	app.param('sequenceId', sequences.sequenceByID);
};