
'use strict';

var childProcess = require('child_process'),
	express = require('express'),
	request = require('supertest'),
	git = require('git');

function ok(req, res, next) {
	res.status(200).send({ ok: true });
	next();
}


describe('.git', function() {

	var sandbox;

	beforeEach(function() {
		sandbox = sinon.sandbox.create();
	});

	afterEach(function() {
		sandbox.restore();
	});

	it('should fail with no path', function() {
		expect(function() {
			git({ path: null });
		}).to.throw(TypeError);
	});

	describe('invalid repo', function() {
		var app;

		beforeEach(function() {
			sandbox.stub(childProcess, 'execFile').callsArgWith(3, 'err');
			app = express();
			app.use(git('fakepath'));
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
					expect(res).to.not.have.header('X-Commit');
				})
				.end(done);
		});
	});

	describe('default behavior', function() {
		var app;

		beforeEach(function() {
			sandbox.stub(childProcess, 'execFile')
				.onCall(0).callsArgWith(3, null, 'branch')
				.onCall(1).callsArgWith(3, null, '123')
				.onCall(2).callsArgWith(3, null, 'v0.1.1');
			app = express();
			app.use(git('fakepath'));
			app.get('/', ok);
		});

		afterEach(function() {
			app = null;
		});

		it('should get correct commit', function(done) {
			request(app)
				.get('/')
				.expect(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.have.header('X-Commit', '123');
				})
				.end(done);
		});

		it('should get correct branch', function(done) {
			request(app)
				.get('/')
				.expect(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.have.header('X-Branch', 'branch');
				})
				.end(done);
		});

		it('should get correct tags', function(done) {
			request(app)
				.get('/')
				.expect(function(res) {
					expect(res).to.have.status(200);
					expect(res).to.have.header('X-Tags', 'v0.1.1');
				})
				.end(done);
		});
	});
});
