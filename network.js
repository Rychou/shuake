import axios from 'axios'
import request from 'request'
import qs from 'qs'
function login(){
  return axios.get('http://acadol.cn/LMS/login.do?companyId=4')
}
// get Code
function getCode(cookie){
  return new Promise((resolve,reject)=>{
    request.get({url:'http://acadol.cn/code',encoding:'binary',headers:{Cookie:cookie}},function(err,res,body){
      resolve(body)
      if(err) reject(err)
    })
  })
}

// do Login
function doLogin(data,cookie){
  return axios({
    method:'post',
    url:'http://acadol.cn/LMS/doLogin.do',
    data,
    headers:{
      Cookie:cookie
    }
  })
}
// get userId
function getUserId(cookie){
  return new Promise((resolve,reject)=>{
    axios({
      method:'get',
      url:'http://acadol.cn/LMS/study/personalv2/personalInfo/information.do',
      headers:{
        Cookie:cookie
      }
    }).then(res=>{
      resolve(res.data.match(/<.*?id="id".*?>/g)[0].match(/[0-9]+/)[0])
    }).catch(err=>reject(err))
  })
}
// 获取对应周的课程列表
function getStaffScoList(data,cookie){
  return new Promise((resolve,reject)=>{
    axios({
    method:"post",
    url:"http://acadol.cn/LMS/ajax/coursePlayer/getStaffScoList.do",
    data,
    headers:{
      "Cookie":cookie
    }
  }).then(res=>{
    resolve(res.data.scoList)
  }).catch(err=>reject(err))
  })
}

// 获取课程视频的sessionId
function getSessionId(data,cookie){
  return new Promise((resolve,reject)=>{
    axios({
      method:"post",
      url:"http://acadol.cn/LMS/ajax/coursePlayer/onlineCoursePlayer.do",
      data,
      headers:{
        Cookie:cookie
      }
    }).then(res=>{
      resolve(res)
    }).catch(err=>reject(err))
  })
}

// 正式刷课
function setCourse(params){
  return new Promise((resolve,reject)=>{
    axios.get('http://116.62.11.214:8082/coursePlayer/loopCommit.do',{
      params
    }).then(res=>resolve(res))
    .catch(err=>reject(err))
  })
}


export default{
  getStaffScoList,
  getSessionId,
  setCourse,
  getCode,
  login,
  doLogin,
  getUserId
}