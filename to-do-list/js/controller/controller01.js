import { TodoView } from '../view/views01.js';
import { TodoModel } from '../model/model01.js';

export class TodoController {
    constructor() {
        this.model = new TodoModel();
        this.view = new TodoView();
        
        this.model.loadData();
        this.view.renderAllTasks(this.model.tasks);

        this.addEventListeners();
        this.updateProgress(); 
    }

    
    addEventListeners() {
       
        document.getElementById("addTaskButton").addEventListener("click", () => this.handleAddTask());

        this.view.listContainer.addEventListener("click", (e) => this.handleTaskComplete(e));

        this.view.listContainer.addEventListener("click", (e) => this.handleRemoveTask(e));
        
        this.view.listContainer.addEventListener("click", (e) => this.handleEditTask(e));

        this.view.searchInput.addEventListener('input', (e) => this.handleSearch(e));

        document.getElementById('all').addEventListener('click', () => this.filterTask('all'));
        document.getElementById('active').addEventListener('click', () => this.filterTask('active'));
        document.getElementById('completed').addEventListener('click', () => this.filterTask('completed'));
   
        this.view.filterStartDate.addEventListener('input', () => this.filterTasksByDate());
        this.view.filterEndDate.addEventListener('input', () => this.filterTasksByDate());

        this.view.keywordSearch.addEventListener('input', (e) => this.handleKeyWordSearch(e));

        this.view.grpBy.addEventListener('change', () => this.handleGroupByChange());

        this.view.reset.addEventListener('click',()=> this.refreshPage())
    }

    handleAddTask() {
        const { taskText, startDate, endDate } = this.view.getInputValues();
        
        if (!taskText) {
            alert("Please add one task.");
        } else if (!startDate || !endDate) {
            alert("Please specify both start and end dates.");
        } else {
            this.model.addTask(taskText, startDate, endDate);
            this.view.renderTask({
                text: taskText,
                startDate,
                endDate,
                lastModified: new Date().toISOString(),
                checked: false,
            });
            this.model.saveData();
            this.view.clearInputFields();
            this.updateProgress(); 
        }
    }

    handleTaskComplete(e) {
        if (e.target.tagName === "LI") {
            const taskIndex = Array.from(this.view.listContainer.children).indexOf(e.target);
            this.model.toggleTaskComplete(taskIndex);
            this.view.updateTaskCompletion(taskIndex, this.model.tasks[taskIndex].checked);
            this.model.saveData();
            this.updateProgress(); 
        }
    }

    handleRemoveTask(e) {
        if (e.target.tagName === "SPAN" && e.target.classList.contains("cross-btn")) {
            const taskIndex = Array.from(this.view.listContainer.children).indexOf(e.target.parentElement);
            this.model.removeTask(taskIndex);
            this.view.listContainer.removeChild(e.target.parentElement);
            this.model.saveData();
            this.updateProgress(); 
        }
    }

    async handleEditTask(e) {
        if (e.target.tagName === "BUTTON" && e.target.textContent === "Edit") {
            const taskIndex = Array.from(this.view.listContainer.children).indexOf(e.target.parentElement);
            const taskText = this.model.tasks[taskIndex].text;
            this.view.editTaskUI(taskText, taskIndex);

            const newText = await this.view.editTaskUI(taskText, taskIndex); // Wait for user input
            if (newText) {
                this.model.editTask(taskIndex, newText);
                this.view.renderAllTasks(this.model.tasks);
                this.model.saveData();
                this.updateProgress(); 
            }
        }
    }

    handleSearch(e) {
        const searchValue = e.target.value.toLowerCase();
        this.view.filterTasksBySearch(searchValue);
    }

    filterTask(status) {
        const filteredTasks = this.model.filterTasks(status);
        this.view.renderAllTasks(filteredTasks);
        this.updateProgress()
    }

    filterTasksByDate() {
        const startDate = new Date(this.view.getStartDate());
        const endDate = new Date(this.view.getEndDate());

        const filteredTasks = this.model.tasks.filter(task => {
            const taskStartDate = new Date(task.startDate);
            const taskEndDate = new Date(task.endDate);
            return taskStartDate >= startDate && taskEndDate <= endDate;
        });

        this.view.renderAllTasks(filteredTasks);
        this.updateProgress()
    }

    handleKeyWordSearch(e) {
        const searchValue = e.target.value;
        this.view.searchByKeyWords(searchValue);
    }

    handleGroupByChange() {
        const groupBy = this.view.getGroupByValue();
        this.groupByTask(groupBy);
    }

    groupByTask(groupBy) {
        const presentTasks = Array.from(this.view.listContainer.getElementsByTagName('li'));
        this.view.listContainer.innerHTML = ''; 

        if (groupBy === 'grpbyTask') {
            const active = presentTasks.filter(task => !task.classList.contains('checked'));
            const complete = presentTasks.filter(task => task.classList.contains('checked'));
            active.forEach(task => this.view.listContainer.appendChild(task));
            complete.forEach(task => this.view.listContainer.appendChild(task));
        } else if (groupBy === 'recent') {
            presentTasks.sort((a, b) => {
                const dateA = new Date(a.dataset.lastModified || 0);
                const dateB = new Date(b.dataset.lastModified || 0);
                return dateB - dateA; 
            });
            presentTasks.forEach(task => this.view.listContainer.appendChild(task));
        } else if (groupBy === 'alphabetical') {
            presentTasks.sort((a, b) => a.textContent.localeCompare(b.textContent));
            presentTasks.forEach(task => this.view.listContainer.appendChild(task));
        } else if (groupBy === 'startDate') {
            presentTasks.sort((a, b) => new Date(a.querySelector('.startDate').textContent.replace('Start ', "")) - new Date(b.querySelector('.startDate').textContent.replace('Start ', "")));
            presentTasks.forEach(task => this.view.listContainer.appendChild(task));
        } else if (groupBy === 'endDate') {
            presentTasks.sort((a, b) => new Date(a.querySelector('.endDate').textContent.replace('End ', "")) - new Date(b.querySelector('.endDate').textContent.replace('End ', "")));
            presentTasks.forEach(task => this.view.listContainer.appendChild(task));
        }
    }

    updateProgress() {
        const present_task = this.view.listContainer.getElementsByTagName('li');

        for (let i = 0; i < present_task.length; i++) {
            const task = present_task[i];
            const progressBar = task.querySelector('progress');
            const taskDate = task.querySelector('.task-dates');
            if (!taskDate) {
                console.warn("Missing '.task-dates' for task:", task);
                continue; 
            }

            const startDate = new Date(taskDate.querySelector('.task-dates span:first-child').textContent.replace(' Start ', "").trim());
            const dueDate = new Date(taskDate.querySelector('.task-dates span:last-child').textContent.replace(' End ', "").trim());
            const currentDate = new Date();

            if (isNaN(startDate) || isNaN(dueDate)) {
                console.warn("Invalid dates in '.task-dates' for task:", task);
                continue; 
            }

            if (task.classList.contains('checked')) {
                progressBar.value = 100;
                progressBar.classList.add('completed');
                progressBar.classList.remove('due-today', 'overdue', 'not-started', 'in-progress');
            } else if (currentDate < startDate) {       
                progressBar.value = 0;
                progressBar.classList.add('not-started');
                progressBar.classList.remove('completed', 'due-today', 'overdue', 'in-progress');
            } else if (currentDate.toDateString() === dueDate.toDateString() && !task.classList.contains("overdue-alert")) {
                task.classList.add("overdue-alert");
                progressBar.value = 70;
                progressBar.classList.add('due-today');
                progressBar.classList.remove('completed', 'overdue', 'not-started', 'in-progress');
                alert("Today is the Due Date of " + task.childNodes[0].nodeValue);
            } else if (currentDate > dueDate && !task.classList.contains("overdue-alert")) {
                progressBar.classList.remove('completed', 'due-today', 'not-started', 'in-progress');
                task.classList.add("overdue-alert");
                progressBar.value = 100;
                progressBar.classList.add('overdue');
                alert("Task is Overdue!!! ---> " + task.childNodes[0].nodeValue);
            } else if (currentDate > startDate && currentDate < dueDate) {
                const progress = ((currentDate - startDate) / (dueDate - startDate)) * 100;
                progressBar.classList.remove('completed', 'due-today', 'overdue', 'not-started');
                progressBar.classList.add('in-progress');
                progressBar.value = Math.min(progress, 100);
            }
        }
    }

    refreshPage(){
        this.view.resetTask()
    }
}



// export const add=(a,b)=>{
//     return a+b;
// }


// const result=add(2,5);