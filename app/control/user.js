let db = [{
  name: 'tom'
}];
class User {
  async addUser (ctx) {
    ctx.verifyParams({
      name: 'string'
    });
    db.push(ctx.request.body);
    ctx.body = ctx.request.body;
  }

  async getUserList (ctx) {
    ctx.body = db;
  }

  async updateUser (ctx) {
    ctx.verifyParams({
      id: 'string'
    });

    const id = ctx.params.id;
    const user = ctx.request.body;
    db.splice(id, 1, user);
    ctx.body = user;
  }

  async deleteUser (ctx) {
    const id = +ctx.params.index;
    db.splice(id, 1);
    ctx.status = 204;
  }
}

module.exports = new User();
