const iGlobal = require('../global');
const constant = require('../global/constant');
const _ = require('lodash');

var courseDetailList = [];
// var courseTimeTotalNum = 0;
// var courseDetailLevel = 0;
var weekIngNum = 0;

function classCourse(payload){
	// courseDetail, tasksProgress, examDate, memberGetplan, courseactivestatus
	let courseRenderData = {};
	filterCourseDetail(payload.courseDetail.chapters);
	addTaskProgress(payload.tasksProgress);
	courseRenderData = getChapterListWeekList(payload.memberGetplan);

	courseRenderData.courseStatus = courseByInFo(payload.courseactivestatus);
	courseRenderData.courseStatus.examinationDate = filterExamDate(payload.courseDetail.courseId, payload.examDate);
	courseRenderData.courseInfo = filterCourseInfo(payload.courseDetail);
	courseRenderData.lastLearn = filterLastLearnChapter(payload.tasksProgress);

	return courseRenderData;
}
function filterCourseDetail(chapters, level, node, oldNode, rootNode) {
	if(level){
		level++;
	}else{
		var level = 1;
	}
	chapters.forEach((element,index) => {

		let rootNode = '';
		let newNode = '';
		if(level>1){
			rootNode = oldNode;
			newNode = node + '-' + index;
		}else{
			newNode = index.toString();
			node = index.toString();
			rootNode = index.toString();
		}
		let chapterTotalTime = 0;
		let videoTime = 0;
		let examTime = 0;
		let knowledgePointTime = 0;
		let openCourseTime = 0;
		if(element.tasks && element.tasks.length){
			let newTasks = [];
			let completedNum = 0;
			let ongoingNum = 0;
			let notstartedNum = 0;
			element.tasks.forEach(function(element,index){
				if(element.taskType == "video"){
					newTasks.push(element);
					// courseTimeTotalNum += (+element.videoTime);
					chapterTotalTime+=(+element.videoTime);
					videoTime+=(+element.videoTime);
				}else if(element.taskType == "exam"){
					newTasks.push(element);
					// courseTimeTotalNum += (+element.taskTime)*60;
					chapterTotalTime+=(+element.taskTime)*60;
					examTime+=(+element.taskTime);
				}else if(element.taskType == "knowledgePointExercise"){
					newTasks.push(element);
					// courseTimeTotalNum += (120)*60;
					chapterTotalTime+=(120)*60;
					knowledgePointTime+=(+element.taskTime);
				}else if(element.taskType == "openCourse"){
					newTasks.push(element);
					// courseTimeTotalNum += (+element.taskTime);
					chapterTotalTime+=(+element.taskTime);
					openCourseTime+=(+element.taskTime);
				}
				if(element.state){
					completedNum++;
				}else{
					if(element.progress){
						ongoingNum++;
					}else{
						notstartedNum++;
					}
				}
			})
			courseDetailList.push({
				'level' : level,
				'rootNode' : rootNode,
				'parentNode' : node,
				'node' : newNode,
				'isChildren' : false,
				'isFree' : element.isFree,
				'chapterTitle' : element.chapterTitle,
				'chapterId' : element.chapterId,
				'isTasks' : true,
				'tasks' : newTasks,
				'completedNum' : completedNum,
				'ongoingNum' : ongoingNum,
				'notstartedNum' : notstartedNum,
				'chapterTotalTime' : chapterTotalTime,
				'chapterStudyTime' : 0,
				'videoTime' : videoTime,
				'examTime' : examTime,
				'knowledgePointTime' : knowledgePointTime,
				'openCourseTime' : openCourseTime,
				'checked' : true,
				'activeClass' : true,
				'showClass' : true
			})
		}
		if(element.children && element.children.length){
			// courseDetailLevel++;
			courseDetailList.push({
				'level' : level,
				'rootNode' : rootNode,
				'parentNode' : node,
				'node' : newNode,
				'isChildren' : true,
				'isFree' : element.isFree,
				'chapterTitle' : element.chapterTitle,
				'chapterId' : element.chapterId,
				'isTasks' : false,
				'checked' : true,
				'activeClass' : true,
				'showClass' : true
			})

			filterCourseDetail(element.children, level, newNode, node, rootNode);
		}
	})
}
function addTaskProgress(taskProgress) {
	if(taskProgress && taskProgress.length){
		courseDetailList.forEach(function(courseElement, courseIndex){
			if(courseElement.isTasks){
				var chapterStudyTime = 0;
				var completedNum = 0;
				var ongoingNum = 0;
				var notstartedNum = 0;
				var taskLength = courseElement.tasks.length;
				var taskItem = 0;
				courseElement.tasks.forEach(function(taskElement, taskIndex){

					var thatTaskData = '';
					taskProgress.forEach(function(taskProgressElement, taskProgressIndex){
						if(taskElement.taskId == taskProgressElement.taskId){
							thatTaskData = taskProgressElement;
						}
					});

					if(thatTaskData){

						var studyTime = 0;
						if(thatTaskData.taskStudyTimeList && thatTaskData.taskStudyTimeList.length){
							thatTaskData.taskStudyTimeList.forEach(function(element, index){
								studyTime += parseInt(element.studyTime);
							})
						}

						chapterStudyTime+=studyTime;
						if(thatTaskData.state){
							completedNum++;
						}else{
							if(thatTaskData.progress){
								ongoingNum++;
							}
						}
						taskElement.progress = thatTaskData.progress;
						taskElement.total = thatTaskData.total;
						taskElement.state = thatTaskData.state;
						taskElement.percentage = iGlobal.getPercentage(thatTaskData.progress,thatTaskData.total);
					}else{
						notstartedNum++;
					}
				})
				courseElement.completedNum = completedNum;
				courseElement.ongoingNum = ongoingNum;
				courseElement.notstartedNum = notstartedNum;
				courseElement.chapterStudyTime = chapterStudyTime;
			}
		})
	}
}
function getChapterListWeekList(memberGetplan){
	if(memberGetplan && memberGetplan.length){
		return filterCourseDetailWeekPlan(courseDetailList, memberGetplan);
	}else{
		return filterCourseDetailPlan(courseDetailList);
	}
}
function filterCourseDetailPlan(courseData){
	return  {
		'isCoursePlan' : "false",
		'chapterList' : courseData
	}
}
function filterCourseDetailWeekPlan(courseData, planData){

	let courseDetailWeekList = [];
	let courseDetailLevel = 0;

	let weekTotal = planData.length;
	let weekTotalCompleted = 0;
	let weekTotalOngoing = 0;
	let weekTotalNotstarted = 0;
	let weekTotalBeoverdue = 0;

	let taskTotal = 0;
	let taskTotalCompleted = 0;
	let taskTotalOngoing = 0;
	let taskTotalNotstarted = 0;
	let taskTotalBeoverdue = 0;

	let itemStart = 0;
	let newDate = new Date().getTime();

	planData.forEach(function(element,index){
		let isOpen = 'true';
		let startCategoryId = element.startCategoryId;
		let endCategoryId = element.endCategoryId;
		let addCourseDetailList = [];
		let addcourseDetailWeekList = false;
		let item = courseData;
		let itemLength = item.length;
		let itemEnd = 0;

		let weekStatus = "";
		let weekTaskTime = 0;
		let weekStudyTime = 0;
		// let weekTaskOngoing = 0;
		let weekDone = 0;
		let weekDoneNum = 0;
		let weekTotal = 0;

		let weekTaskTotal = 0;
		let weekTaskBeoverdue = 0;
		let weekTaskOngoing = 0;
		let weekTaskCompleted = 0;
		let weekTaskNotstarted = 0;

		let videoTotal = 0;
		let videoBeoverdue = 0;
		let videoOngoing = 0;
		let videoCompleted = 0;
		let videoNotstarted = 0;
		let videoTime = 0;
		
		let examTotal = 0;
		let examBeoverdue = 0;
		let examOngoing = 0;
		let examCompleted = 0;
		let examNotstarted = 0;
		let examTime = 0;

		let evaluationStatus = 0;
		let evaluationTime = 0;

		let liveStatus = 0;
		let liveTime = 0;
		let liveStatusText = '';

		if(element.startDate<newDate && element.endDate<newDate){
			weekStatus = "beoverdue";
			weekTotalBeoverdue++;
		}else if(element.startDate<newDate && newDate<element.endDate){
			weekIngNum = index;
			weekStatus = "ongoing";
			weekTaskOngoing++;
		}if(newDate<element.startDate && newDate<element.endDate){
			isOpen = "false";
			weekStatus = "notstarted";
			weekTaskNotstarted++;
		}
		
		for(var i=itemStart;i<itemLength;i++){
			weekTotal++;
			var thisItem = item[i];
			thisItem.index = i;
			if(startCategoryId == thisItem.chapterId){
				addcourseDetailWeekList = true;
			}
			if(addcourseDetailWeekList){

				if(thisItem.isTasks){

					weekTaskTime+=thisItem.chapterTotalTime;
					weekStudyTime+=thisItem.chapterStudyTime;
					videoTime+=thisItem.videoTime;
					examTime+=thisItem.examTime;
					liveTime+=thisItem.openCourseTime;

					let taskLength = thisItem.tasks.length;
					weekTaskTotal+=taskLength;

					switch(weekStatus){
						case "completed":
							taskTotalCompleted+=taskLength;
							break;
						case "beoverdue":
							// taskTotalBeoverdue+=taskLength;
							for(var j=0;j<taskLength;j++){
								if(thisItem.tasks[j].state){
									weekDoneNum++;
									taskTotalCompleted++;
									weekTaskCompleted++;
								}else{

									if(thisItem.tasks[j].progress){
										taskTotalOngoing++;
										weekTaskOngoing++;
									}else{
										taskTotalBeoverdue++;
										weekTaskBeoverdue++;
										// taskTotalNotstarted++;
									}
								}
							}
							break;
						case "ongoing":
							for(var j=0;j<taskLength;j++){
								if(thisItem.tasks[j].state){
									weekDoneNum++;
									taskTotalCompleted++;
									weekTaskCompleted++;
								}else{
									if(thisItem.tasks[j].progress){
										taskTotalOngoing++;
										weekTaskOngoing++;
									}else{
										taskTotalNotstarted++;
										weekTaskNotstarted++;
									}
								}
							}
							break;
						case "notstarted":
							taskTotalNotstarted+=taskLength;
							break;
					}
					thisItem.tasks.forEach(function(element,index){
						if(element.taskType == "video"){
							videoTotal++;
							if(element.state){
								videoCompleted++;
							}else{
								if(element.progress){
									videoOngoing++;
								}else{
									videoNotstarted++;
								}
							}
						}else if(element.taskType == "exam"){
							examTotal++;
							if(element.state){
								examCompleted++;
							}else{
								if(element.progress){
									examOngoing++;
								}else{
									examNotstarted++;
								}
							}
						}else if(element.taskType == "knowledgePointExercise"){
							// evaluationStatus = 1;
						}else if(element.taskType == "openCourse"){
							liveStatus = element.state;
							if(element.state){
								liveStatusText = "已完成"
							}else{
								if(element.progress){
									liveStatusText = "进行中";
								}else{
									liveStatusText = "未开始";
								}
							}
						}
					})
				}
				addCourseDetailList.push(thisItem);
			}
			if(endCategoryId == thisItem.chapterId){
				addcourseDetailWeekList = false;
				itemStart = i;
				itemEnd = i;
				weekTotal = i;
				break;
			}
		}
		if(weekTaskTotal == weekDoneNum && weekStatus !== "notstarted"){
			weekDone = 1;
			weekStatus = "completed";
			weekTotalCompleted++;
		}

		taskTotal += weekTaskTotal;

		courseDetailWeekList.push({
			'isOpen' : isOpen,
			'isFinish' : element.isFinish,
			'list' : addCourseDetailList,
			'status' : weekStatus,
			'isDone' : weekDone,
			'planId' : element.id,
			'weekName' : element.planTitle,
			'weekProgress' : iGlobal.getProgress(weekTaskCompleted,weekTaskTotal),
			
			'totalTime' : weekTaskTime,
			'taskTime' : weekTaskTime,
			'studyTime' : weekStudyTime,
			'weekTime' : `${iGlobal.getDate(element.startDate)}-${iGlobal.getDate(element.endDate)}`,
			'startDate' : iGlobal.getDate(element.startDate),
			'endDate' : iGlobal.getDate(element.endDate),

			'taskTotal' : weekTaskTotal,
			'taskCompleted' : weekTaskCompleted,
			'taskOngoing' : weekTaskOngoing,
			'taskBeoverdue' : weekTaskBeoverdue,
			'taskNotstarted' : weekTaskNotstarted,

			'videoTotal' : videoTotal,
			'videoCompleted' : videoCompleted,
			'videoOngoing' : videoOngoing,
			'videoProgress' : iGlobal.getProgress(videoCompleted,videoTotal),
			'videoTime' : videoTime,

			'examTotal' : examTotal,
			'examCompleted' : examCompleted,
			'examOngoing' : examOngoing,
			'examProgress' : iGlobal.getProgress(examCompleted,examTotal),
			'examTime' : examTime,

			'evaluationStatus' : evaluationStatus,
			'evaluationTime' : evaluationTime,

			'liveStatus' : liveStatus,
			'liveStatusText' : liveStatusText,
			'liveTime' : iGlobal.getDate(element.startDate)
		})
	})

	return  {
		'weekIngNum' : weekIngNum,
		'isCoursePlan' : "true",
		'planInfo' : courseDetailWeekList,
		"studyInfo" : {
			"studyProgressTotal" : iGlobal.getProgress(taskTotalCompleted,taskTotal)
		},
		'tasksSummary' : {
			'total' : taskTotal,
			'beoverdue' : taskTotalBeoverdue,
			'completed' : taskTotalCompleted,
			'ongoing' : taskTotalOngoing,
			'notstarted' : taskTotalNotstarted
		},
		'weeksSummary' : {
			'total' : weekTotal,
			'beoverdue' : weekTotalBeoverdue,
			'completed' : weekTotalCompleted,
			'ongoing' : weekTotalOngoing,
			'notstarted' : weekTotalNotstarted
		}
	}
}
function courseByInFo(coursestatus){
	let lockStatus = "false";
	let courseActiveTime = 0;
	let courseExpirationTime = 0;
	let courseActiveState=0;
	let courseActiveStateText = "默认未购买";
	if(coursestatus && coursestatus.length){
		var lockStatusNum = 0;
		for(var i=0;i<coursestatus.length;i++){
			if(coursestatus[i].lockStatus == 0){
				lockStatusNum++;
			}
		}
		if(!lockStatusNum){
			lockStatus = "true";
		}

		for(var i=0;i<coursestatus.length;i++){
			if(coursestatus[i].isExpiration == "false" && coursestatus[i].activeState == "acitve"){
				courseActiveTime = iGlobal.getDate(coursestatus[i].activeTime*1000);
				courseExpirationTime = iGlobal.getDate(coursestatus[i].expirationTime*1000);
			}
		}
		var datanow=(new Date().getTime())/1000;//当前时间戳
		for(var i=0;i<coursestatus.length;i++){
			if(coursestatus[i].activeState=="acitve" && coursestatus[i].expirationTime>datanow && courseActiveState<3){
				courseActiveState="3";//已激活未过期
				courseActiveStateText = "已激活未过期";
				break;
			}else if(coursestatus[i].activeState=="init" && courseActiveState<2){
				courseActiveState="2";//未激活
				courseActiveStateText = "未激活";
			}else if(coursestatus[i].activeState=="acitve" && coursestatus[i].expirationTime<datanow && courseActiveState<1){
				courseActiveState="1";//已激活已过期
				courseActiveStateText = "已激活已过期";
			}
			
		}
			
		if(courseActiveState && lockStatus){
			courseActiveState="4";//课程已锁定
			courseActiveStateText = "课程已锁定";
		}
		courseActiveState = courseActiveState;
	}else{

	}
	
	return {
		lockStatus : lockStatus,
		courseActiveTime : courseActiveTime,
		courseExpirationTime : courseExpirationTime,
		courseActiveState : courseActiveState,
		courseActiveStateText : courseActiveStateText
	}
}
function filterExamDate(courseId, examDate){
	var data = {};
	var days = -1;
	if(examDate && examDate.length){
		for(var i=0;i<examDate.length;i++){
			if(courseId == examDate[i].id){
				data = examDate[i];
				days = parseInt((new Date().getTime() - data.examinationDate)/(24*60*60*1000));
			}
		}
	}
	if(days<0){
    return "本科目考试时间未确定";
  }else if(days==0){
    return "请留意,本科目<strong>今天</strong>开始考试";
  }else{
    return "距本科目考试还有<strong>"+days+"</strong>天";
  }
}
function filterCourseInfo(courseDetail){
	let courseInfo = {}
	if(courseDetail){
		courseInfo = {
			categoryName : courseDetail.categoryName,
			categoryId : courseDetail.categoryId,
			courseName : courseDetail.courseName,
			courseId : courseDetail.courseId,
			courseImage : constant.host.static + courseDetail.coverPath,
			expirationTime : courseDetail.effectiveDay
		};
		let courseModel = JSON.parse(courseDetail.courseModel);
		if(courseModel && courseModel.length){
			courseInfo.courseModel = courseDetail.courseModel;
			courseInfo.img = constant.host.static + courseDetail.coverPath;
			courseInfo.video = courseDetail.firstVideo;
		}
	}

	return courseInfo;
}
function filterLastLearnChapter(taskProgress){
	let lastLearnChapter = '';
	let isLastLearn = false;
	let title = '';
	let chapterId = '';
	let chapterName = '';
	let taskId = '';
	let taskName = '';
	if(taskProgress && taskProgress.length){
		isLastLearn = true;
		lastLearnChapter =  _.maxBy(taskProgress, 'createDate');
		title = lastLearnChapter.chapterName;
		chapterId = lastLearnChapter.chapterId;
		chapterName = lastLearnChapter.chapterName;
		taskId = lastLearnChapter.taskId;
		taskName = lastLearnChapter.taskName;

	}else{
		isLastLearn = false;
		let index = _.findIndex(courseDetailList, ['isTasks', true]);
		if(index){
			lastLearnChapter = courseDetailList[index];
			title = "开始学习本课程";
			chapterId = lastLearnChapter.chapterId;
			chapterName = lastLearnChapter.chapterName;
			taskId = lastLearnChapter.tasks[0].taskId;
			taskName = lastLearnChapter.tasks[0].title;
		}else{
			title = "暂无课程任务";
			chapterId = "";
			chapterName = "";
			taskId = "";
			taskName = "";
		}
	}
	return {
		isLastLearn : isLastLearn,
		title : title,
		chapterId : chapterId,
		chapterName : chapterName,
		taskId : taskId,
		taskName : taskName
	}
}
module.exports = classCourse