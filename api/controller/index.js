const constant = require('../global/constant');
// const platform = require('platform');
module.exports = async (ctx, next) => {
	ctx.state.mock = ctx.query.mock || ctx.request.body.mock;
	// ctx.state.mock = true;
	ctx.state.fail = [];
	ctx.state.response = constant.response.success;
	// const UA = platform.parse(ctx.request.header['user-agent']);
	// ctx.state.UA = UA;

  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
	try {
    await next();
  } catch (err) {
  	console.log(err)
    ctx.state.response = constant.response.nodeerror;
  }
	let fail = ctx.state.fail;
	let responseData = {};
	if(fail && fail.length){
		for(let i=0;i<fail.length;i++){
			let thisFail = fail[i];
			let thisRequest = thisFail.request;
			if(thisFail.state == "error"){
				if(thisFail.msg == "nologin"){
					responseData = constant.response.nologin;
				}else if(thisFail.msg == "用户名或密码错误"){
					responseData = constant.response.errorInput;
					responseData.request = thisRequest;
				}else{
					responseData = constant.response.error;
					responseData.request = thisRequest;
				}
			}else{
				responseData = constant.response.error;
				responseData.request = thisRequest;
			}
		}
	}else{
		for(let i in ctx.state.response){
			responseData[i] = ctx.state.response[i];
		}
		if(ctx.state.data){
			for(let i in ctx.state.data){
				responseData[i] = ctx.state.data[i];
			}
		}
	}
	ctx.body = responseData;
}