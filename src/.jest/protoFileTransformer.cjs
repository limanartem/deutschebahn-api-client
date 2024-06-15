const fs = require('fs');
const path = require('path');

module.exports = {
  process: (src, filename) => {
    switch (path.extname(filename)) {
      case '.protobuf': {
        const content = fs.readFileSync(filename);
        return { code: `module.exports = ${JSON.stringify(content)}` };
      }
      case '.proto': {
        const content = fs.readFileSync(filename, 'utf8');
        return { code: `module.exports = ${JSON.stringify(content)}` };
      }
    }
    return null;
  },
};
