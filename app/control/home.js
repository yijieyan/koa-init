class Home {
  async index (ctx) {
    ctx.body = 'home page';
  }
}

module.exports = new Home();
