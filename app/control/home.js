const path = require('path');
const fs = require('fs');
const Files = require('../models/file.js');
class Home {
  async index (ctx) {
    ctx.body = 'home page';
  }
  /**
   * @apiGroup File
   * @api {POST} /upload 上传文件
   * @apiHeader {String} Authorization 用户的token
   * @apiParam  {String} id 用户唯一标识
   * @apiDescription 通过用户的唯一标识来修改用户信息
   * @apiParam  {File} files 上传文件的key
   * {
   *    "Authorization": "Bearer  token"
   * }
   * @apiVersion 1.0.0
   * @apiSuccess {Object} _id
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "_id": "5d089a824ad11e1260b57f9a"
   *  }
   */
  async upload (ctx) {
    let files = ctx.req.files;
    let f = [];
    for (let i = 0; i < files.length; i++) {
      let item = files[i];
      let ret = await Files.create({
        savePath: item.path,
        fileName: item.filename,
        mimeType: item.mimetype,
        size: item.size,
        originalname: item.originalname,
        account: ctx.state.user.userId
      });
      f.push({ _id: ret._id });
    }
    ctx.success(f);
  }
  /**
   * @apiGroup File
   * @api {GET} /download  下载文件
   * @apiDescription 下载文件
   * @apiParam  {String} fileId 文件的唯一标识
   * @apiVersion 1.0.0
   */
  async download (ctx) {
    ctx.verifyParams({
      fileId: 'string'
    });
    let { fileId } = ctx.query;
    let f = await Files.findOne({ _id: fileId });
    ctx.res.setHeader('Content-disposition', `attachment; filename=${encodeURIComponent(f.originalname)};filename*=utf-8${f.fileName}`);
    ctx.res.setHeader('Content-type', f.mimeType);
    if (f.size) {
      ctx.res.setHeader('Content-Length', Number(+f.size).toString());
    }
    ctx.body = fs.createReadStream(path.resolve(process.env.dataDir, f.savePath));
  }
}

module.exports = new Home();
