#!/usr/bin/env node

// Get arguments (first two are 'node' and 'app.js')
const args = process.argv.slice(2);
const fs=require('fs');

if (!fs.existsSync("data.json")) {
  fs.writeFileSync("data.json", "[]");
}
const stats = fs.statSync("data.json");
const chalk=require('chalk');

const color_text=(color,text)=>{
  const colors = {
    black: chalk.black,
    red: chalk.red,
    green: chalk.green,
    yellow: chalk.yellow,
    blue: chalk.blue,
    magenta: chalk.magenta,
    cyan: chalk.cyan,
    white: chalk.white,
    redBright: chalk.redBright,
    greenBright: chalk.greenBright,
    yellowBright: chalk.yellowBright,
    blueBright: chalk.blueBright,
    magentaBright: chalk.magentaBright,
    cyanBright: chalk.cyanBright,
    whiteBright: chalk.whiteBright
  };
  
  if(colors[color]) console.log(colors[color](text));
  else console.log(text);
};

let rawData;
let data=[];
let id;
if(stats.size!=0){
  rawData = fs.readFileSync("data.json");
  data = JSON.parse(rawData);
  id=data.length+1;
}
else id=1;


const operation = args[0]; // add, update, delete, list

if(operation=="add"){
  const task=args[1];
  const priority=args[2];
  if(args.length!=3){
    console.log("Usage: task <add> <task> <priority:high,medium,low>");
    process.exit(1);
  }
  else{
    const now = new Date();
    const formatted = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    let data1=data;
    let tasks={
      id:id,
      task:task,
      status:"todo",
      priority:priority,
      createdAt:formatted,
      updatedAt:null
    };
    data1.push(tasks);
    fs.writeFileSync("data.json",JSON.stringify(data1,null,2));
    console.log("Task added successfully! Task Id:",id);
    id++;
  }
}
else if(operation=="delete"){
  const idToDelete=parseInt(args[1]);
  if(args.length!=2){
    console.log("Usage: task <delete> <task_id>");
    process.exit(1);
  }
  if(data.length==0){
    console.log("No tasks to be deleted!!");
    process.exit(1);
  }
  else{
    data = data.filter(task => task.id !== idToDelete);
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
    console.log("Deleted task with id",idToDelete);
  }
}
else if(operation=="update"){
  if(args.length!=4){
    console.log("Usage: task <update> <task_id> <attribute> <data>");
    process.exit(1);
  }
  const idToUpdate=parseInt(args[1]);
  const attributeToUpdate=args[2];
  const updateData=args[3];
  
  const now = new Date();
  const formatted = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  let updated=false;
  data=data.map(task => {
    if(task.id==idToUpdate){
      task[attributeToUpdate]=updateData;
      task.updatedAt=formatted;
      updated=true;
    }
    return task;
  });
  if(updated){
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2)); 
    console.log("Data updated successfully for task id",idToUpdate);
  }
  else console.log("No such id found in the data!!");
}
else if(operation=="list"){
  if(args.length!=2){
    console.log("Usage: task <list> <all>|<done>|<todo>|<in-progress>");
    process.exit(1);
  }
  const subcmd=args[1];
  let listTasks=[]
  if(subcmd=="all") for(let tasks of data) listTasks.push([tasks.id,tasks.task,tasks.status,tasks.priority]);
  else if(subcmd=="done"){
    for(let tasks of data){
      if(tasks.status=="done"){
        listTasks.push([tasks.id,tasks.task,tasks.status,tasks.priority]);
      }
    }
  }
  else if(subcmd=="todo"){
    for(let tasks of data){
      if(tasks.status=="todo"){
        listTasks.push([tasks.id,tasks.task,tasks.status,tasks.priority]);
      }
    }
  }
  else if(subcmd=="in-progress"){
    for(let tasks of data){
      if(tasks.status=="in-progress"){
        listTasks.push([tasks.id,tasks.task,tasks.status,tasks.priority]);
      }
    }
  }
  else{
    console.log("Usage: task <list> <all>|<done>|<todo>|<in-progress>")
    process.exit(1);
  }
  console.log("Found",listTasks.length,"tasks!");
  for(let i of listTasks){
    let color;
    if(i[2]=="done") color="green";
    else if(i[3]=="high") color="redBright";
    else if(i[3]=="medium") color="yellow";
    else if(i[3]=="low") color="cyan"
    color_text(color,i);
  }
}
else if(operation=="done"){
  if(args.length!=2){
    console.log("Usage: task <done> <task_id>");
    process.exit(1);
  }
  else{
    const task_id=parseInt(args[1]);
    let updated=false;
    data=data.map(task => {
      if(task.id==task_id){
        task.status="done";
        updated=true;
      }
      return task;
    });
    if(updated){
      fs.writeFileSync("data.json", JSON.stringify(data, null, 2)); 
      console.log("Task with task id",task_id,"completed successfully!!");
    }
    else console.log("No such id found in the data!!");
  }
}
else if(operation=="todo"){
  if(args.length!=2){
    console.log("Usage: task <todo> <task_id>");
    process.exit(1);
  }
  else{
    const task_id=parseInt(args[1]);
    let updated=false;
    data=data.map(task => {
      if(task.id==task_id){
        task.status="todo";
        updated=true;
      }
      return task;
    });
    if(updated){
      fs.writeFileSync("data.json", JSON.stringify(data, null, 2)); 
      console.log("Status of the task with task id",task_id,"has been changed!!");
    }
    else console.log("No such id found in the data!!");
  }
}
else{
  console.log("Usage: task <add>|<update>|<delete>|<list>|<done>|<todo> <....>")
  process.exit(1);
}