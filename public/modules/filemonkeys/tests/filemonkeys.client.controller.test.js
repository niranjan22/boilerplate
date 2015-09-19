'use strict';

(function() {
	// Filemonkeys Controller Spec
	describe('Filemonkeys Controller Tests', function() {
		// Initialize global variables
		var FilemonkeysController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Filemonkeys controller.
			FilemonkeysController = $controller('FilemonkeysController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Filemonkey object fetched from XHR', inject(function(Filemonkeys) {
			// Create sample Filemonkey using the Filemonkeys service
			var sampleFilemonkey = new Filemonkeys({
				name: 'New Filemonkey'
			});

			// Create a sample Filemonkeys array that includes the new Filemonkey
			var sampleFilemonkeys = [sampleFilemonkey];

			// Set GET response
			$httpBackend.expectGET('filemonkeys').respond(sampleFilemonkeys);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.filemonkeys).toEqualData(sampleFilemonkeys);
		}));

		it('$scope.findOne() should create an array with one Filemonkey object fetched from XHR using a filemonkeyId URL parameter', inject(function(Filemonkeys) {
			// Define a sample Filemonkey object
			var sampleFilemonkey = new Filemonkeys({
				name: 'New Filemonkey'
			});

			// Set the URL parameter
			$stateParams.filemonkeyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/filemonkeys\/([0-9a-fA-F]{24})$/).respond(sampleFilemonkey);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.filemonkey).toEqualData(sampleFilemonkey);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Filemonkeys) {
			// Create a sample Filemonkey object
			var sampleFilemonkeyPostData = new Filemonkeys({
				name: 'New Filemonkey'
			});

			// Create a sample Filemonkey response
			var sampleFilemonkeyResponse = new Filemonkeys({
				_id: '525cf20451979dea2c000001',
				name: 'New Filemonkey'
			});

			// Fixture mock form input values
			scope.name = 'New Filemonkey';

			// Set POST response
			$httpBackend.expectPOST('filemonkeys', sampleFilemonkeyPostData).respond(sampleFilemonkeyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Filemonkey was created
			expect($location.path()).toBe('/filemonkeys/' + sampleFilemonkeyResponse._id);
		}));

		it('$scope.update() should update a valid Filemonkey', inject(function(Filemonkeys) {
			// Define a sample Filemonkey put data
			var sampleFilemonkeyPutData = new Filemonkeys({
				_id: '525cf20451979dea2c000001',
				name: 'New Filemonkey'
			});

			// Mock Filemonkey in scope
			scope.filemonkey = sampleFilemonkeyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/filemonkeys\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/filemonkeys/' + sampleFilemonkeyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid filemonkeyId and remove the Filemonkey from the scope', inject(function(Filemonkeys) {
			// Create new Filemonkey object
			var sampleFilemonkey = new Filemonkeys({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Filemonkeys array and include the Filemonkey
			scope.filemonkeys = [sampleFilemonkey];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/filemonkeys\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFilemonkey);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.filemonkeys.length).toBe(0);
		}));
	});
}());