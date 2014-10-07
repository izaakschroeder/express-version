
'use strict';

var fs = require('fs'),
	path = require('path');

function collect(root) {
	var manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')),
		branch = fs.readFileSync(path.join(root, '.git', 'HEAD'), 'utf8').match(/ref:\s*refs\/heads\/(.*)/)[1],
		commit = fs.readFileSync(path.join(root, '.git', 'refs', 'heads', branch), 'utf8');
	return {
		version: manifest.version,
		branch: branch,
		commit: commit
	};
}

module.exports = function versionable(path) {
	var info = collect(path);
	return function version(req, res, next) {
		res
			.set('X-App-Version', info.version)
			.set('X-App-Commit', info.commit)
			.set('X-App-Branch', info.branch);
		next();
	};
};
