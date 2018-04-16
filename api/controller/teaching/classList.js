const Request = require('../../request');
const iGlobal = require('../../global');
const constant = require('../../global/constant');

module.exports = async(ctx, next) => {
	// ctx.state.mock = true;
	if(ctx.query.memberId && ctx.query.token && ctx.query.userLevel){
		await next();
		// let classCourseList = ctx.state.classCourseList;
		// let serverTime = parseInt(classCourseList['server-time']);
		// let classCourseListRes = [];

		// let classCourseNotStart = [];
		// let classCourseStudyIn = [];
		// let classCourseActivated = [];
		// if(classCourseList.data && classCourseList.data.length){
		// 	classCourseList.data.forEach((element, index) => {
		// 		let classCourse = [];
		// 		let classAssistant = '';
		// 		let classAssistantArray = [];
				
		// 		let classCourseData = {};
		// 		if(element.classAssistant && element.classAssistant.length){
		// 			classAssistant = element.classAssistant;
		// 		}

		// 		if(element.classCourse && element.classCourse.length){
		// 			element.classCourse.forEach((item,index)=>{
		// 				classCourse.push({
		// 					"courseCategoryId" : iGlobal.toString(item.courseCategoryId),
		// 					"courseId" : iGlobal.toString(item.courseId),
		// 					"courseName" : iGlobal.toString(item.courseName),
		// 					"createTime" : iGlobal.toString(item.createTime),
		// 					"lecturerName" : iGlobal.toString(item.teacherName),
		// 					"lecturerId" : iGlobal.toString(item.teacherId),
		// 					"versionId" : iGlobal.toString(item.versionId),
		// 					"planId" : iGlobal.toString(item.planId),
		// 					"assistant" : []
		// 				})
		// 				if(classAssistant && classAssistant.length){
		// 					classAssistant.forEach((itemAssistant) => {
		// 						// classAssistantArray.push(item.teacherName)
		// 						if(itemAssistant.classCourseId == item.id){
		// 							classCourse[index].assistant.push({
		// 								teacherId : itemAssistant.teacherId,
		// 								teacherName : itemAssistant.teacherName
		// 							})
		// 						}
		// 					})
		// 				}
		// 			})

		// 		}
				
				
		// 		classCourseData = {
		// 			"className" : iGlobal.toString(element.name),
		// 			"classId" : iGlobal.toString(element.id),
		// 			"startTime" : iGlobal.getDate(element.starTime),
		// 			"endTime" : iGlobal.toString(element.endTme),
		// 			"headmasterName" : iGlobal.toString(element.classTeacherName),
		// 			"headmasterId" : iGlobal.toString(element.classTeacherId),
		// 			"QRCode" : iGlobal.toString(element.qrCodeUrl),
					
		// 			"classCourse" : classCourse,
					
		// 			"serverTime" : iGlobal.toString(serverTime)
		// 		}
		// 		if(serverTime<element.starTime){
		// 			// console.log("未开始")
		// 			classCourseData.state = "0";
		// 			let day = (parseInt((element.starTime-serverTime)/(1000*60*60*24))).toString();
		// 			if(day.length == 1){
		// 				day = "00" + day;
		// 			}else if(day.length == 2){
		// 				day = "0" + day;
		// 			}else if(day.length == 3){

		// 			}else{

		// 			}
		// 			let dayArray = day.split('');

		// 			classCourseData.nowToOpeningTime = day;
		// 			classCourseData.nowToOpeningTimeArray = dayArray;

		// 			// classCourseNotStart.push(classCourseData);
		// 			classCourseStudyIn.push(classCourseData);

		// 		}else if(element.starTime<serverTime && serverTime<element.endTme){
		// 			// console.log("进行中")
		// 			classCourseData.state = "1";
		// 			classCourseStudyIn.push(classCourseData);
		// 		}else if(element.endTme<serverTime){
		// 			// console.log("已过期")
		// 			classCourseData.state = "2";
		// 			classCourseActivated.push(classCourseData);
		// 		}
		// 	})
		// }
		
		let loginTimeago = '';
		if(ctx.state.loginLog && ctx.state.loginLog.length){
			loginTimeago = ctx.state.loginLog[0] ? iGlobal.timeago(ctx.state.loginLog[0].loginTime/1000) : "第一次登录";
		}
		ctx.state.data = {
			loginTimeago : loginTimeago,
			teacherClass : ctx.state.teacherClass
		};
		// ctx.state.data = {
		// 	teacherClass : teacherClass,
		// 	classCourseList : {
		// 		"notStarted" : classCourseNotStart,
		// 		"studyIn" : classCourseStudyIn,
		// 		"beoverdue" : classCourseActivated
		// 	}
		// };
	}else{
		ctx.state.response = constant.response.noparameter;
	}
}