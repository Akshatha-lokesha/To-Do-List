// import TaskController from "./controller/controller.js";

// document.getElementById("addTaskButton").addEventListener("click", () => TaskController.addTask());


// main.js
import { TodoController } from "./controller/controller01.js";

const todoApp = new TodoController();
document.getElementById("addTaskButton").addEventListener("click", () => todoApp.handleAddTask());
