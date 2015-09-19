'use strict';

module.exports = {
	app: {
		title: 'StartApp',
		description: 'Full-Stack MEANJS application to create invoice',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
                'public/lib/metisMenu/dist/metisMenu.min.css',
                'public/lib/fontawesome/css/font-awesome.min.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
        'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/metisMenu/dist/metisMenu.min.js',
        'public/lib/PACE/pace.min.js',
        'public/scripts.js',
        'public/lib/ng-file-upload-shim/ng-file-upload-shim.min.js',
        'public/lib/angular/angular.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',    
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/moment/moment.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};