const iGlobal = require('../../global');
const constant = require('../../global/constant');
const Filter = require('../../filter');

module.exports = async(ctx, next) => {
	if(ctx.query.token && ctx.query.memberId && ctx.query.courseId){
		await next();
		ctx.state.data = Filter.courseIndex({
			courseDetail : ctx.state.courseDetail,
			tasksProgress : ctx.state.getTasksProgress,
			txamDate : ctx.state.getExamDate,
			memberGetplan : ctx.state.memberGetplan,
			courseactivestatus : ctx.state.courseactivestatus
		})
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}