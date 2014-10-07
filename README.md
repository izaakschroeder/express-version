# version

Automatically publish package.json and git version information out over your app.

```javascript
var app = express();
// Path to the folder containing package.json
app.use(version(__dirname));
```
