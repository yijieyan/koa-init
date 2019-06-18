const mongoose = require('mongoose');
const { dbUrl } = require('../config/index.js');

module.exports = {
  dbConnect () {
    mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    mongoose.set('debug', process.env.NODE_ENV === 'development');
    let db = mongoose.connection;
    db.on('error', (err) => {
      console.log(`mongodb error:${err}`);
    });
    db.once('open', () => {
      console.log(`mongodb connection successful`);
    });

    db.on('disconnected', () => {
      throw new Error('数据库挂了,快去修吧。');
    });
  }
}
;
