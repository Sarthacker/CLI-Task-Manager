#!/usr/bin/env node

// Get arguments (first two are 'node' and 'app.js')
const args = process.argv.slice(2);
const fs=require('fs');

const stats = fs.statSync("data.json");


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
  if(args.length!=2){
    console.log("Usage: task <add> <task>");
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
    console.log("Usage: task <delete> <id>");
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
    console.log("Usage: task <update> <id> <attribute> <data>");
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
  if(subcmd=="all") for(let tasks of data) listTasks.push([tasks.id,tasks.task,tasks.status]);
  else if(subcmd=="done"){
    for(let tasks of data){
      if(tasks.status=="done"){
        listTasks.push(tasks.task);
      }
    }
  }
  else if(subcmd=="todo"){
    for(let tasks of data){
      if(tasks.status=="todo"){
        listTasks.push(tasks.task);
      }
    }
  }
  else if(subcmd=="in-progress"){
    for(let tasks of data){
      if(tasks.status=="in-progress"){
        listTasks.push(tasks.task);
      }
    }
  }
  else{
    console.log("Usage: task <list> <all>|<done>|<todo>|<in-progress>")
    process.exit(1);
  }
  console.log("Found",listTasks.length,"tasks!");
  for(let i of listTasks) console.log(i);
}
else{
  console.log("Usage: task <add>|<update>|<delete>|<list> <....>")
  process.exit(1);
}
