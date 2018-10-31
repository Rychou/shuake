import readline from 'readline'
import fs from 'fs'
var  rl = readline.createInterface(process.stdin, process.stdout);

function getUserInput(info){
  return new Promise((resolve,reject)=>{
    rl.question(info,function(input){
      resolve(input)      
    })
  })
}
function saveCode(data){
  return new Promise((resolve,reject)=>{
    fs.writeFile(`./static/code/1.png`,data,'binary',(err)=>{
      if(err) reject(err)
      else resolve('save success')
    })
  })
}

export default{
  getUserInput,
  saveCode
}