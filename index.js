// var axios = require('axios');
// import qs from 'qs'
import axios from 'axios'
import utils from './utils'
import network from './network'
import qs from 'qs'
// http://acadol.cn/code 验证码地址
var username, password, code
var userId //用户id
var id //每个章节url后的id
var cookie = ''
var scoList
var sessionId = []

network
  .login()
  .then(res => {
    res.headers['set-cookie'].forEach(item => {
      cookie += item.split(';')[0] + ';'
    })
    console.log(cookie)
    return network.getCode(cookie)
  })
  .then(res => {
    return utils.saveCode(res)
  })
  .then(res => {
    return utils.getUserInput('请输入用户名:')
  })
  .then(res => {
    username = res
    return utils.getUserInput('请输入密码:')
  })
  .then(res => {
    password = res
    return utils.getUserInput(
      `请打开目录下的验证码图片(./static/code/1.png)后输入验证码:`
    )
  })
  .then(res => {
    code = res
    const data = qs.stringify({
      redirectUrl: '',
      msgType: '',
      companyId: 4,
      txt_loginName: username,
      txt_password: password,
      txt_code: code
    })
    return network.doLogin(data, cookie)
  })
  .then(res => {
    return network.getUserId(cookie)
  })
  .then(res => {
    userId = res
    return utils.getUserInput('请输入课程id：')
  })
  .then(res => {
    console.log(res)
    id = res
    var data = qs.stringify({ id: id })
    return network.getStaffScoList(data, cookie)
  })
  .then(res => {
    scoList = eval(res)
    for (let i = 0; i < scoList.length; i++) {
      console.log(scoList[i].status)
      if (scoList[i].status != 'completed') {
        var formData = qs.stringify({
          courseNumer: '001',
          courseType: scoList[i].type,
          href: scoList[i].href,
          requiredTime: scoList[i].finishLength,
          location: scoList[i].location,
          suspeDate: scoList[i].suspendData,
          url: 'http://116.62.11.214:8082/coursePlayer/init.do',
          status: scoList[i].status,
          totalTime: scoList[i].totalTime,
          id: scoList[i].chapterId,
          staffChapterId: scoList[i].id,
          courseId: scoList[i].companyRelationCourseId
        })
        network.getSessionId(formData, cookie).then(res => {
          console.log(res.data)
          sessionId[i] = res.data
          // 正式刷课操作
          return network.setCourse({
            student_id: userId,
            lesson_location: 0,
            lesson_status: 'completed',
            score: 0,
            suspend_data: '',
            session_time: `00:${scoList[i].finishLength + 1}:${Math.floor(
              Math.random() * 60
            )}`,
            lesson_progress: '100.0',
            masteryscore: '',
            total_time: 0,
            required_time: scoList[i].finishLength,
            session_id: sessionId[i]
          })
          .then(res=>{
            console.log(res.data)
          })
          .catch(console.error)
        })
      }
    }
  })
  .catch(err => {
    console.log(err)
  })

// const id = process.argv[2]
// var data = qs.stringify({id:id})
// const cookie = "cookie_staff_loginName=16058523; cookie_staff_password=''; acw_tc=76b20f4615386338243544047ee19b56c448397ee4399805d52af329159552; JSESSIONID=8927A6BA8C55459ED1D6A864B4A73209"
// var scoList
// var sessionId = []
// network.getStaffScoList(data,cookie).then(res=>{
//   scoList = eval(res)
//   for(let i = 0;i<scoList.length;i++){
//     console.log(scoList[i].status)
//     if(scoList[i].status != "completed"){
//       var formData = qs.stringify({
//         courseNumer: "001",
//         courseType: scoList[i].type,
//         href: scoList[i].href,
//         requiredTime: scoList[i].finishLength,
//         location: scoList[i].location,
//         suspeDate: scoList[i].suspendData,
//         url: "http://116.62.11.214:8082/coursePlayer/init.do",
//         status: scoList[i].status,
//         totalTime: scoList[i].totalTime,
//         id: scoList[i].chapterId,
//         staffChapterId: scoList[i].id,
//         courseId: scoList[i].companyRelationCourseId
//       })
//       network.getSessionId(formData,cookie).then(res=>{
//         console.log(res.data)
//         sessionId[i] = res.data
//         // 正式刷课操作
//         // network.setCourse({
//         //   student_id:16506,
//         //   lesson_location:0,
//         //   lesson_status:"completed",
//         //   score:0,
//         //   suspend_data:'',
//         //   session_time:`00:${scoList[i].finishLength+1}:${Math.floor(Math.random()*60)}`,
//         //   lesson_progress:'100.0',
//         //   masteryscore:'',
//         //   total_time:0,
//         //   required_time:scoList[i].finishLength,
//         //   session_id:sessionId[i]
//         // })
//       }).catch(err=>{console.log(1)})
//     }
//   }
// }).catch(err=>console.error(err))
