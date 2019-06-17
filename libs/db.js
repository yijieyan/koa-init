const mongoose = require('mongoose');
const { dbUrl } = require('../config/index.js');

module.exports = {
  dbConnect() {
    mongoose.connect(dbUrl, {
      useNewUrlParser: true
    });
    mongoose.set('debug', process.NODE_ENV === 'development');
    mongoose.set('useFindAndModify', false);
    let db = mongoose.connection;
    db.on('error', (err) => {
      console.log(`mongodb error:${err}`);
    });
    db.once('open', function() {
      console.log(`mongodb connection successful`);
    });
    
    db.on('disconnected', () => {
      throw new Error('数据库挂了,快去修吧。');
    });
  }
}