const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const multer = require('koa-multer');
const mkdirp = require('mkdirp');
let currMonth = new Date().toISOString().substr(0, 7);
let dest = `uploads/${currMonth}/`;
let uploadDir = multer({ dest: dest });
// eslint-disable-next-line no-unused-expressions
fs.existsSync(uploadDir) ? '' : mkdirp.sync(path.join(__dirname, '../../../', dest));
const {
  authUser
} = require('../../../middlewares/auth');
const router = new Router({
  prefix: '/v1'
});
const {
  index, upload, download
} = require('../../control/home');

router.get('/', index);
router.post('/upload', authUser, uploadDir.array('files', 12), upload);
router.get('/download', download);

module.exports = router;
