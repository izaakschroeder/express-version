
'use strict';

var fs = require('fs'),
	express = require('express'),
	request = require('supertest'),
	pkg = require('package');

function ok(req, res, next) {
	res.status(200).send({ ok: true });
	next();
}

describe('.pkg', function() {

	var sandbox;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function() {
		sandbox.restore();
	});

	it('should fail with no path', function() {
		expect(function() {
			pkg({ path: null });
		}).to.throw(TypeError);
	});

	describe('invalid package', function() {
		var app;

		beforeEach(function() {
			sandbox.stub(fs, 'readFile').callsArgWith(2, 'error');
			app = express();
			app.use(pkg('fakepath'));
			app.get('/', ok);
		});

		afterEach(function() {
			app = null;
		});

		it('should omit the header', function(done) {
			request(app)
				.get('/')
				.expect(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.not.have.header('X-Version');
				})
				.end(done);
		});
	});

	describe('default behavior', function() {
		var app;

		beforeEach(function() {
			sandbox.stub(fs, 'readFile').callsArgWith(2, null, JSON.stringify({
				name: 'test',
				version: '2.1.1'
			}));
			app = express();
			app.use(pkg('fakepath'));
			app.get('/', ok);
		});

		afterEach(function() {
			app = null;
		});

		it('should get correct version', function(done) {
			request(app)
				.get('/')
				.expect(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.have.header('X-Version', '2.1.1');
				})
				.end(done);
		});
	});


});
