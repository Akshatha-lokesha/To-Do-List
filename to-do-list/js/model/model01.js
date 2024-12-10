export class TodoModel {
    constructor() {
        this.tasks = [];
    }

    addTask(taskText, startDate, endDate) {
        const task = {
            text: taskText,
            startDate,
            endDate,
            lastModified: new Date().toISOString(),
            checked: false,
        };
        this.tasks.push(task);
    }

    removeTask(taskIndex) {
        this.tasks.splice(taskIndex, 1);
    }

    toggleTaskComplete(taskIndex) {
        const task = this.tasks[taskIndex];
        task.checked = !task.checked
        this.saveData()
    }

    editTask(taskIndex, newText) {
        this.tasks[taskIndex].text = newText;
        this.tasks[taskIndex].lastModified = new Date().toISOString();
    }

    
    saveData() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    
    loadData() {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
    }

    filterTasks(status) {
        if (status === 'all') {
            return this.tasks;
        } else if (status === 'active') {
            return this.tasks.filter(task => !task.checked);
        } else if (status === 'completed') {
            return this.tasks.filter(task => task.checked);
        }
    }
}
