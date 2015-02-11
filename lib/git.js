
'use strict';

var _ = require('lodash'),
	Promise = require('bluebird'),
	ChildProcess = require('child_process');

function Repository(dir) {
	if (!_.isString(dir)) {
		throw new TypeError();
	}
	this.path = dir;
}

Repository.prototype.git = function git(args) {
	var self = this;
	return new Promise(function gitResolve(resolve, reject) {
		ChildProcess.execFile('git', args, {
			cwd: self.path
		}, function gitComplete(err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result.trim());
			}
		});
	});
};

Repository.prototype.getBranch = function getBranch() {
	return this.git(['rev-parse', '--verify', '--abbrev-ref', 'HEAD']);
};

Repository.prototype.getCommit = function getCommit() {
	return this.git(['rev-parse', '--verify', 'HEAD']);
};

Repository.prototype.getTags = function getTag() {
	return this.git(['tag', '--points-at', 'HEAD']);
};

Repository.prototype.getInfo = function getInfo() {
	return Promise.props({
		branch: this.getBranch(),
		commit: this.getCommit(),
		tags: this.getTags()
	});
};



module.exports = function versionable(options) {

	if (_.isString(options)) {
		options = { path: options };
	}

	options = _.assign({
		path: process.cwd(),
		headers: {
			'X-Commit': 'commit',
			'X-Branch': 'branch',
			'X-Tags': 'tags'
		}
	}, options);

	var repo = new Repository(options.path), promisedHeaders;

	promisedHeaders = repo.getInfo().then(function gotInfo(info) {
		return _.mapValues(options.headers, function mapHeader(key) {
			return info[key];
		});
	}).catch(_.noop);

	return function version(req, res, next) {
		promisedHeaders
			.then(function gotHeaders(headers) {
				_.forEach(headers, function outputHeader(value, header) {
					res.set(header, value);
				});
			})
			.finally(next);
	};
};
