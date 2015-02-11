
'use strict';

var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	Promise = require('bluebird');

function manifest(root) {

	if (!_.isString(root)) {
		throw new TypeError();
	}

	return new Promise(function manfiestPromise(resolve, reject) {
		var file = path.join(root, 'package.json');
		fs.readFile(file, 'utf8', function manifestRead(err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		});
	});
}


module.exports = function versionable(options) {
	if (_.isString(options)) {
		options = { path: options };
	}

	options = _.assign({
		path: process.cwd(),
		headers: {
			'X-Name': 'name',
			'X-Version': 'version'
		}
	}, options);

	var promisedHeaders = manifest(options.path).then(function gotPkg(pkg) {
		return _.mapValues(options.headers, function mapValue(key) {
			return pkg[key];
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
