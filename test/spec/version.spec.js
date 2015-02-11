
'use strict';

var version = require('version');

describe('version', function() {
	it('should export `.git`', function() {
		expect(version).to.have.property('git');
	});
	it('should export `.pkg`', function() {
		expect(version).to.have.property('pkg');
	});
});
