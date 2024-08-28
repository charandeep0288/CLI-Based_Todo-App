// Commands -------------------------------------------------
// node index.js list            list all the todos
// node index.js add <task>      Add a new todo
// node index.js delete <id>     Delete a todo
// node index.js mark-done <id>  Mark a todo as done
// node index.js clear           Delete all todos
// node index.js help [command]  display help for command

import { Command } from "commander";
import chalk from "chalk";
import fs from "fs";


const program = new Command();
const FILE_NAME = "./todos.json";

function readTodosFromfile() {
  try {
    const data = fs.readFileSync(FILE_NAME, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return [];
  }
}

function writeTodosInFile(todosArr, taskType) {
  fs.writeFile(FILE_NAME, todosArr, (err, data) => {
    if (err) {
      throw err;
    } else {
      if (taskType == "add") 
        console.log("Task added!");
      else if (taskType == "delete") 
        console.log("Task removed successfully!");
      else if (taskType == "mark-done")
        console.log("Task marked as completed!");
      else if (taskType == "clear")
        console.log("Cleared all tasks successfully!");
    }
  });
}

program
  .name("Todos app")
  .description("CLI to create todos [ Your daily tasks in your terminal ] ")
  .version("1.0.0");

program
  .command("list")
  .description("list all the todos")
  .action(() => {
    fs.readFile(FILE_NAME, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const todosArr = JSON.parse(data);
        if (todosArr.length == 0) {
          console.log("No Task Exist. \nPlease create a new one!");
          return;
        }

        for (let i = 0; i < todosArr.length; i++) {
          const status =
            todosArr[i].status == true
              ? chalk.green("[ Done ✓ ]")
              : chalk.yellow("[ pending ⌛ ]");
          console.log(
            todosArr[i].id + ". " + todosArr[i].task + " - " + status
          );
        }
      }
    });
  });

program
  .command("add")
  .description("Add a new todo")
  .argument("<task>", "task name")
  .action((task) => {
    const todosArr = readTodosFromfile();
    const newTask = {
      id: todosArr.length + 1,
      task: task,
      status: false,
    };

    todosArr.push(newTask);
    const updatedTodosArr = JSON.stringify(todosArr);

    writeTodosInFile(updatedTodosArr, "add");
  });

program
  .command("delete")
  .description("Delete a todo")
  .argument("<id>", "id of the todo to be deleted")
  .action((id) => {
    let todosArr = readTodosFromfile();
    if (id < 1 || id > todosArr[todosArr.length - 1].id) {
      console.log("Invalid todo id. \nPlease try with different id!");
      return;
    }

    const taskToBeDeleted = todosArr.filter(todo => todo.id == id);
    if(taskToBeDeleted.length == 0) {
      console.log("Invalid todo id. \nPlease try with different id!");
      return;
    }
    
    todosArr = todosArr.filter((todo) => todo.id != id);

    const updatedTodosArr = JSON.stringify(todosArr);
    writeTodosInFile(updatedTodosArr, "delete");
  });

program
  .command("mark-done")
  .description("Mark a todo as done")
  .argument("<id>", "id of the todo to be marked as done")
  .action((id) => {
    let todosArr = readTodosFromfile();
    if (id < 1 || id > todosArr[todosArr.length - 1].id) {
      console.log("Invalid todo id. \nPlease try with different id!");
      return;
    }

    let markedAsDone = false;
    todosArr.map((todo) => {
      if (todo.id == id) {
        markedAsDone = true;
        todo.status = true;
      }
    });

    if (!markedAsDone) {
      console.log("Invalid todo id. \nPlease try with different id!");
      return;
    }

    const updatedTodosArr = JSON.stringify(todosArr);
    writeTodosInFile(updatedTodosArr, "mark-done");
  });

program
  .command("clear")
  .description("Delete all todos")
  .action(() => {
    const todos = [];
    writeTodosInFile(JSON.stringify(todos), "clear");
  });

program.parse();