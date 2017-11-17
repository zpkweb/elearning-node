const Request = require('../../request')

module.exports = async(ctx) => {
  await Request.ajax('login', {
    token: ctx.state.token,
    account: ctx.query.username,
    password: ctx.query.password
  }).then((res) => {
    ctx.body = res
  })
}