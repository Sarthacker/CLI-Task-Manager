# Task Manager CLI
https://roadmap.sh/projects/task-tracker

A simple **command-line task manager** built using **Node.js** that lets you **add, update, delete, and list tasks**. Tasks are stored in a `data.json` file.

---

## Prerequisites

- Node.js installed
- Terminal/Command Prompt access
- Run these commands in the root folder of this project.
```bash
npm install
npm link
```

---

## Usage

Run all commands using:

```bash
task <command> <arguments>
```

### Commands
#### 1. Add a Task
Add a new task to the task manager.
```bash
task add <task_name> <priority:high,low,medium>
```

#### 2. Delete a Task
Delete a task by its ID.
```bash
task delete <task_id>
```

#### 3. List Tasks
List tasks based on status or all tasks.
```bash
task list <all|todo|in-progress|done>
```

#### 4. Complete a Task
Mark or unmark a task as completed for a particular ID.
```bash
task <done|todo> <id>
```

#### 5. Update a Task
Update a task attribute (task description or prioriy) for a particular ID.
```bash
task update <id> <attribute> <new_value>
```

Examples
```bash
task list all
task list todo
task list done
task list in-progress
```