

const axios = require('axios');
const config = require('./config');
const COMMON = require('../global/constant')

axios.defaults.timeout = 0;

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';


// axios.interceptors.request.use(function (config) {
  
//   return config;
    
//   }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   });
axios.interceptors.response.use((res) => {
  if (res && res.data.state == 'success') {
    return Promise.resolve(res.data);
  } else {
    return Promise.reject(res.data);
  }
}, (error) => {
  return Promise.reject(error);
});
function ajax(servername,payload){
  var args = {};
  var thatServer = server[servername];
  var hostName = '';
  var thatServerUrl = thatServer.url;
  if(process.env.NODE_ENV == 'development'){ // production development
    if(thatServer.staticDataDemo){
      args.url = thatServer.staticDataDemo  + "?verTT=" + new Date().getTime();
      args.type = 'GET';
    }else{
      hostName  = COMMON.host.demoName;
      if(thatServer.hostNameDemo){
        hostName = thatServer.hostNameDemo;
      }
      if(thatServer.urlDemo){
        thatServerUrl = thatServer.urlDemo;
      }
      if(thatServer.mock){
        args.url = thatServer.mock;
        args.type = 'GET';
      }else{
        args.url = hostName + thatServerUrl  + "?verTT=" + new Date().getTime();
        args.type = thatServer.type ? thatServer.type : 'GET';
      }
    }
  }else{
    hostName = COMMON.host.name;
    if(thatServer.hostName){
      hostName = thatServer.hostName;
    }
    if(thatServer.mock){
      args.url = thatServer.mock;
      args.type = 'GET';
    }else{
      args.url = hostName + thatServerUrl  + "?verTT=" + new Date().getTime();
      args.type = thatServer.type ? thatServer.type : 'GET';
    }
  }
  let localData = localStorage.getItem('elearning/'+servername);
  if(localData){
    return Vue.localForage.getItem(servername);
  }else{
    if (args.type === 'POST') {
      return axios.post(args.url, payload, config).then(done(servername,res)).catch(err => err)
    } else if (args.type === 'GET') {
      return axios.get(args.url, {
        params: payload
      }, config).then(res => done(servername,res)).catch(err => err)
    }
  }

  
}
function done(servername,res){
  let addLocalStorage = true;
  noLocalStorage.forEach(list=>{
    if(list == servername){
      addLocalStorage = false;
    }
  })
  if(addLocalStorage){
    Vue.localForage.setItem(servername,res).then(value => {})
  }
  
  return res
}
function fail(){

}
const noLocalStorage = ['gettoken','login','updateStatus'];

const server = {
  'token' : 'dd68b8cb-9c9c-4da4-9d24-7cbc92006d41',
  'gettoken': {
    'name' : '获取token',
    'url': '/api/zbids/app/gettoken/v1.0/',
    'mock' : '/static/mock/token.json',
    'data': COMMON.product.pcWeb,
    'defaultData' : {
      "appType": "pc",
      "appId": "pcWeb",
      "appKey": "e877000be408a6cb0428e0f584456e03"
    }
  },
  'login': {
    'name' : '登录',
    'url': '/api/zbids/member/login/v1.0',
    'mock' : '/static/mock/login.json',
    'type': 'POST',
    'defaultData' : {
      'account' : 'zpk',
      'password' : '123456',
      'token' : this.token
    }
  },
  'logout': {
    'name' : '登出',
    'url': '/api/zbids/member/loginout/v1.0'
  },
  'mycount': {
    'name' : '我的交流笔记统计',
    'url': '/api/studytools/mycount/v2.1',
    'mock': '/static/mock/mycount.json',
    'defaultData' : {
      'token' : this.token
    }
  },
  'slide-list': {
    'name' : '活动列表',
    'url': '/api/article/slide/list',
    'mock': '/static/mock/slide-list.json',
    'defaultData' : {
      'tag' : '0',
      'valid' : 'true',
      'count' : '4'
    }
  },
  'getLoginLog': {
    'name' : '登录日志',
    'url': '/api/zbids/member/getLoginLog',
    'mock': '/static/mock/getLoginLog.json',
    'defaultData' : {
      'memberid' : 'ff8080815133db0d0151375bfdf30c0d',
      'pageNo' : 1,
      'pageSize' : 1
    }
  },
  'getExamDate': {
    'name' : '考试时间',
    'url': '/api/business/coursestudy/getExamDate',
    'mock': '/static/mock/getExamDate.json',
    'defaultData' : {
      'memberId' : 'ff8080815133db0d0151375bfdf30c0d'
    }
  },
  'learningcourse': {
    'name' : '在学的课程',
    'url': '/api/business/learning/learningcourse/v1.0',
    'mock': '/static/mock/learningcourse.json',
    'defaultData' : {
      'token' : this.token,
      'pageNo' : 1,
      'pageSize' : 999
    }
  },
  'getCourseProgress': {
    'name' : '课程进度',
    'action': 'true',
    'hostName': 'http://action.zbgedu.com',
    'mock': '/static/mock/getCourseProgress.json',
    'url': '/api/userAction/course/getCourseProgress/v1.0/',
    'defaultData' : {
      'token' : this.token,
      'memberId' : 'ff8080815133db0d0151375bfdf30c0d',
      'courseId' : ''
    }
  },
  'messageList': {
    'name' : '消息列表',
    'url': '/api/study/message/list/v1.0',
    'mock': '/static/mock/message-list.json',
    'defaultData' : {
      'token' : this.token,
      // 'type' : '1',
      'pageNo' : 1,
      'pageSize' : 20
    }
  },
  'messageListPageNo2': {
    'name' : '消息列表',
    'url': '/api/study/message/list/v1.0',
    'mock': '/static/mock/message-list-pageNo2.json',
    'defaultData' : {
      'token' : this.token,
      // 'type' : '1',
      'pageNo' : 1,
      'pageSize' : 20
    }
  },
  'messageListNoRead': {
    'name' : '未阅读消息列表',
    'url': '/api/study/message/list/v1.0',
    'mock': '/static/mock/message-list-noread.json',
    'defaultData' : {
      'token' : this.token,
      'isRead' : '0', // 0 未阅读 1 已阅读
      // 'type' : '1',
      'pageNo' : 1,
      'pageSize' : 20
    }
  },
  'updateStatus': {
    'name' : '更新消息状态',
    'url': '/api/study/message/updateStatus/v1.0',
    'mock': '/static/mock/updateStatus.json',
    'defaultData' : {
      'token' : this.token,
      'messageId' : 'messageId',
      'isall' : '0' // 0 更新一个 1 更新所有
    },
  },
  'member': {
    'name' : '用户详细信息',
    'url': '/api/zbids/member/getmemberinfo'
  },
  
  
  'exam-list': {
    'url': '/api/userAction/examen/get_exercise_knowledge_member_status'
  },
  
  'noActivecourse': {
    'name' : '未激活的课程',
    'url': '/api/business/learning/noActivecourse/v1.0'
  },
  'expirationcourse': {
    'name' : '过期的课程',
    'url': '/api/business/learning/expirationcourse/v1.0'
  },
  'courseBaseInfo': {
    'urlDemo': '/api/v2.1/course/courseBaseInfo/data',
    'url': '/api/v2.1/course/courseBaseInfo/data',
    'type': 'POST'
  },
  'courseDetail': {
    'urlDemo': '/api/teachsource/course/courseDetail/data',
    'url': '/api/teachsource/course/courseDetail/data'
  },
  'coursesBaseInfo': {
    'urlDemo': '/api/teachsource/course/courseBaseInfo/data',
    'url': '/api/teachsource/course/courseBaseInfo/data'
  },
  'handout': {
    'urlDemo': '/api/teachsource/course/courseBaseInfo/data',
    'url': '/api/teachsource/course/courseBaseInfo/data'
  },
  'version': {
    'urlDemo': '/api/teachsource/course/coursesversionlist/data',
    'url': '/api/teachsource/course/coursesversionlist/data'
  },
  'getNidExerciseDetail': {
    'hostNameDemo': 'http://192.168.10.112:8083',
    'urlDemo': '/api/teachsource/examen/getNidExerciseDetail/data',
    'url': '/api/teachsource/examen/getNidExerciseDetail/data'
  },
  'getExerciseIds': {
    'urlDemo': '/api/teachsource/examen/getExerciseIds/data',
    'url': '/api/teachsource/examen/getExerciseIds/data'
  },
  'getExerciseBaseInfo': {
    'urlDemo': '/api/teachsource/examen/getExerciseBaseInfo/data',
    'url': '/api/teachsource/examen/getExerciseBaseInfo/data'
  },
  'getTasksProgress': {
    'url': '/api/v2/study/getTasksProgress'
  },
  'taskProgress': {
    'url': '/api/v2.1/chapter/taskProgress',
    'type': 'POST'
  },
  'coursestatus': {
    'url': '/api/business/learning/courseactivestatus'
  },
  'bbslist': {
    'url': '/api/studytools/bbslist/v1.0'
  },
  'bbsdetail': {
    'url': '/api/studytools/bbsdetail/v1.0'
  },
  'bbslist_myJoin': {
    'url': '/api/studytools/bbslist_myJoin/v1.0'
  },
  'bbs_praise': {
    'url': '/api/studytools/bbs_praise/v1.0'
  },
  'bbsreply': {
    'url': '/api/studytools/bbsreply/v1.0',
    'type': 'POST'
  },
  'bbssave': {
    'url': '/api/studytools/bbssave/v1.0',
    'type': 'POST'
  },
  'bbs_del': {
    'url': '/api/studytools/bbs_del/v1.0'
  },
  'course-node': {
    'url': '/api/v2/course/node'
  },
  'nodelist': {
    'url': '/api/studytools/nodelist/v2.1'
  },
  'nodedetail': {
    'url': '/api/studytools/nodedetail/v2.1'
  },
  'node-list': {
    'url': '/api/v2/note/list'
  },
  'nodesave': {
    'url': '/api/studytools/nodesave/v2.1',
    'type': 'POST'
  },
  'coursechapternodecount': {
    'url': '/api/studytools/coursechapternodecount/v2.1',
    'type': 'POST'
  },
  'myallcoursechapternodecount': {
    'url': '/api/studytools/myallcoursechapternodecount/v2.1',
    'type': 'POST'
  },
  'delmycontent': {
    'url': '/api/studytools/delmycontent/v2.1'
  },
  'ad_discuss': {
    'url': '/api/studytools/ad_discuss/v2.1'
  },
  'timeList': {
    'url': '/api/teachsource/exam/timeList'
  },
  'active': {
    'url': '/api/business/order/courseActive/v1.0'
  },
  'bbs_forumlistShow': {
    'url': '/api/studytools/bbs_forumlistShow/v1.0'
  },
  'addLMG': {
    'url': '/api/business/complaintOpinion/create/v1.0',
    'type': 'POST'
  },
  'exercisePointCountCache': {
    'hostNameDemo': 'http://192.168.10.134:8080',
    'url': '/api/extendapi/examen/get_exercise_point_count_cache',
    'type': 'POST'
  },
  'exerciseKnowledgeMemberStatus': {
    'hostNameDemo': 'http://192.168.10.134:8080',
    'url': '/api/userAction/examen/get_exercise_knowledge_member_status',
    'type': 'POST'
  },
  'userKnowledgePointExerciseList': {
    'hostNameDemo': 'http://192.168.10.134:8080',
    'url': '/api/userAction/examen/get_user_knowledge_point_exercise_list'
  },
  'setMemberExerciseLog': {
    'hostNameDemo': 'http://192.168.10.112:8083',
    'url': '/api/userAction/examen/setMemberExerciseState',
    'type': 'POST'
  },
  'actionGetTasksProgress': {
    'action': 'true',
    'hostName': 'http://action.zbgedu.com',
    'url': '/api/userAction/course/getTasksProgress/v1.0/'
  },
  'actionTaskProgress': {
    'action': 'true',
    'hostName': 'http://action.zbgedu.com',
    'url': '/api/userAction/course/taskProgress/v1.0/'
  },
  'wileyCourseActive': {
    'url': '/api/business/order/wileyCourseActive/v1.0'
  },
  'wileyCourseStudy': {
    'url': '/api/business/order/wileyCourseStudy/v1.0'
  },
  'getAppointmentState': {
    'hostName': window.origin,
    'url': '/publicCourse/getAppointmentState.do',
    'type': 'POST'
  },
  'appointClick': {
    'hostName': window.origin,
    'url': '/publicCourse/appointClick.do',
    'type': 'POST'
  },

  'getmembernotprocnoticelist': {
    'url': '/api/business/coursegroup/getmembernotprocnoticelist'
  },
  'membercheck': {
    'url': '/api/business/coursegroup/membercheck'
  },
  'get_user_knowledge_point_exercise_list': {
    'hostNameDemo': 'http://192.168.10.134:8080',
    'url': '/api/userAction/examen/get_user_knowledge_point_exercise_list'
  },
  'get_exercise_knowledge_member_status': {
    'hostNameDemo': 'http://192.168.10.134:8080',
    'url': '/api/userAction/examen/get_exercise_knowledge_member_status',
    'type': 'POST'
  },
  'getMemberErrorExercise': {
    'hostNameDemo': 'http://192.168.10.134:8080',
    'url': '/api/userAction/examen/getMemberErrorExercise'
  },
  'delMemberExercise': {
    'url': '/api/userAction/examen/delMemberExercise'
  },
  'setMemberErrorExercise': {
    'hostNameDemo': 'http://192.168.10.112:8083',
    'url': '/api/userAction/examen/setMemberErrorExercise',
    'type': 'POST'
  },
  'setMemberExamenFinish': {
    'hostNameDemo': 'http://192.168.10.112:8083',
    'url': '/api/userAction/examen/setMemberExamenFinish',
    'type': 'POST'
  },
  'appointment': {
    'url': '/api/userAction/opencourse/appointment',
  },
  'getappointmentlist': {
    'url': '/api/userAction/opencourse/getappointmentlist',
  },
  'includeopencoursegroup': {
    'url': '/api/business/coursegroup/includeopencoursegroup'
  },
  'memberbuycategorylist': {
    'url': '/api/business/course/memberbuycategorylist'
  },
  'memberbuylist': {
    'url': '/api/business/coursegroup/memberbuylist'
  },
  'getTotalTime': {
    'url': '/api/userAction/openCourse/getTotalTime'
  },
  'settotaltime': {
    'url': '/api/userAction/openCourse/settotaltime'
  },
  'setgift': {
    'url': '/api/userAction/openCourse/setgift'
  },
  'payment': {
    'url': '/api/business/order/payment',
    'type': 'POST'
  },
  'ccLogin': {
    'hostName': 'https://view.csslcloud.net',
    'hostNameDemo': 'https://view.csslcloud.net',
    'url': '/api/view/login',
    'type': 'POST'
  },
  'getcoursecategory': {
    'staticData': './script/staticData/getcoursecategory.json',
    'staticDataDemo': './scripts/staticData/getcoursecategory.json'
  },
  'courseCategoryExamenCount': {
    'url': '/api/teachsource/examen/courseCategoryExamenCount',
  },
  'courseCategoryExamenList': {
    'url': '/api/teachsource/examen/courseCategoryExamenList'
  },
  'childKnowledgeNodePointList': {
    'url': '/api/teachsource/knowledge/childKnowledgeNodePointList'
  },
  'getListById': {
    'url': '/api/teachsource/resources/getListById'
  },
  'getDetailById': {
    'url': '/api/teachsource/resources/getDetailById'
  },
  'getExamenInfo': {
    'url': '/api/teachsource/examen/getExamenInfo'
  },
  'getKnowledgePointInfo': {
    'url': '/api/teachsource/knowledge/getKnowledgePointInfo'
  }
};

export default {
  ajax
}