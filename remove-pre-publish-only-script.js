const fs = require('fs');
const path = require('path');

// Define absolute path for 'package.json'.
const ORIG_PKG_PATH = path.resolve(__dirname, 'dist/full-fledged/dynamic-forms/package.json');

// Obtain original `package.json` contents.
const pkgData = require(ORIG_PKG_PATH);

// Delete scripts
delete pkgData.scripts;

// Overwrite `package.json` with new data (i.e. minus the specific data).
fs.writeFile(ORIG_PKG_PATH, JSON.stringify(pkgData, null, 2), function (err) {
  if (err) {
    throw err;
  }
});
