
'use strict';

var fs = require('fs'),
	path = require('path'),
	express = require('express'),
	version = require('version'),
	request = require('supertest');

function ok(req, res, next) {
	res.status(200).send({ ok: true });
	next();
}

function error(error, req, res, next) {
	res.status(error.statusCode || 500).send(error);
	next(error);
}

describe('#allows', function() {

	beforeEach(function() {
		this.app = express();
		this.app.use(error);
	});

	afterEach(function() {
		this.app = null;
	});

	it('it should respond with correct version information', sinon.test(function(done) {
		this.stub(fs, 'readFileSync', function(file) {
			switch (path.basename(file)) {
			case 'package.json':
				return '{ "version": "1.1.2" }';
			case 'HEAD':
				return 'ref: refs/heads/master';
			case 'master':
				return 'abcdef';
			default:
				throw new Error();
			}
		});
		this.app.use(version('__fakepath'));
		this.app.get('/', ok);
		request(this.app)
			.get('/')
			.expect(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.have.header('X-App-Version', '1.1.2');
				expect(res).to.have.header('X-App-Branch', 'master');
				expect(res).to.have.header('X-App-Commit', 'abcdef');
			})
			.end(done);
	}));

});
