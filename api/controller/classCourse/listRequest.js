const axios = require('axios');
const Request = require('../../request');

module.exports = async(ctx, next) => {
	await Request.ajax({
		server : "classCourseList",
		ctxState : ctx.state,
		data : {
			token: ctx.query.token
		}
	}).then(async (res) => {

		let classCourseList = res;
		if(classCourseList.data && classCourseList.data.length){
			for(let elementClassCourse of classCourseList.data){
				if(elementClassCourse.classCourse && elementClassCourse.classCourse.length){
					for (let courseElement of elementClassCourse.classCourse) {
				    await Request.ajax({
				    	server : "courseBaseInfo",
				    	ctxState : ctx.state,
				    	data : {
				    		idType: 0,
				    		courseId : courseElement.courseId
				    	}
				    }).then((res) => {
				    	if(res.data && res.data.length){
  				    	courseElement.courseName = res.data[0].courseName;
  				    	courseElement.coverPath = res.data[0].coverPath;
  				    	courseElement.categoryId = res.data[0].categoryId;
  		    			courseElement.subjectId = res.data[0].subjectId;
				    	}
				    	
				    })
				  }
				}
			}
		}
		ctx.state.classCourseList = classCourseList;
		return next();
	})
}