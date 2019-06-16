const fs = require('fs');
const path = require('path');
module.exports = (app) => {
  fs.readdirSync(path.join(__dirname, 'v1')).forEach(file => {
    let router = require(`./v1/${file}`);
    if (file !== 'index.js') {
      app.use(router.routes()).use(router.allowedMethods());
    }
  });
};
