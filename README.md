# express-version

Automatically publish package.json and git information out over your app.

![build status](http://img.shields.io/travis/izaakschroeder/express-version.svg?style=flat)
![coverage](http://img.shields.io/coveralls/izaakschroeder/express-version.svg?style=flat)
![license](http://img.shields.io/npm/l/express-version.svg?style=flat)
![version](http://img.shields.io/npm/v/express-version.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/express-version.svg?style=flat)

```javascript
var express = require('express'),
	version = require('express-version');

var app = express();

app.use(version.pkg());
app.use(version.git());
```

## Usage

### .git

You can export `branch`, `commit` or `tags` as a header. The defaults are shown below:
```javascript
version.git({
	path: process.cwd(),
	headers: {
		'X-Branch': 'branch',
		'X-Commit': 'commit',
		'X-Tags': 'tags'
	}
});
```

### .pkg

You can export any field in the `package.json` file as a header. The defaults are shown below:

```javascript
version.pkg({
	path: process.cwd(),
	headers: {
		'X-Name': 'name',
		'X-Version': 'version'
	}
});
```
