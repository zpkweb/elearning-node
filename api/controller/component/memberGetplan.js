const Request = require('../../request');
const constant = require('../../global/constant');

module.exports = async(ctx, next) => {
	// ctx.state.mock = true;
	await Request.ajax({
	  server : "getStudyPlanList",
	  ctxState : ctx.state,
	  data : {
	    token: ctx.query.token,
			courseId: ctx.query.courseId,
			tenantId: ctx.query.tenantId
	  }
	}).then((res) => {
		// if(res.state == "success"){
		// 	ctx.state.memberGetplan = res.data;
		// }else{
		// 	ctx.state.memberGetplan = [];
		// }
		if(res.state == "success" || res.success){
			ctx.state.memberGetplan = res.data;
		}else{
			ctx.state.memberGetplan = [];
		}
	  return next();
	})
	
}