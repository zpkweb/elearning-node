const Request = require('../../request');
const constant = require('../../global/constant');
const Filter = require('../../filter');
module.exports = async (ctx, next) => {
	ctx.state.mock = true;
	await Request.ajax({
		server: 'exerciseIdList',
		ctxState: ctx.state
	}).then(async (resCourse) => {
		// ctx.state.data = Filter.notActivated({
		// 	notActivated: resCourse.data.courselist
		// })
		ctx.state.data = resCourse
		ctx.state.mock = false;
		return next();
	})

}