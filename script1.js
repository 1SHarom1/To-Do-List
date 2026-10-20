const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const dinamicList = document.getElementById('dinamicList');
const deleteAllCompletedTasksButton = document.getElementById('deleteAllCompletedTasksButton');

let all_tasks = 0;
let completed_tasks = 0;
let remaining_tasks = 0;

let loadedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
loadedTasks.forEach(function (task) {
   createTaskElement(task.text, task.completed);

    if (task.completed) {
        completed_tasks++;
    }
    else {
        remaining_tasks++;
    }
    all_tasks++;
});
updateTaskCounts();

function saveTasks() {
    const tasks = [];
    for (const li of dinamicList.children) {
        const checkbox = li.querySelector('input[type="checkbox"]');
        const taskText = li.firstChild.textContent;
        tasks.push({ text: taskText, completed: checkbox.checked });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskCounts() {
    document.getElementById('allTasks').textContent = all_tasks;
    document.getElementById('completedTasks').textContent = completed_tasks;
    document.getElementById('remainingTasks').textContent = remaining_tasks;
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        return;
    }

    createTaskElement(taskText, false);

    taskInput.value = '';
    all_tasks++;
    remaining_tasks++;
    updateTaskCounts();
    saveTasks();
}

function createTaskElement(taskText, completed) {
    const li = document.createElement('li');
    li.textContent = taskText;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.className = "checkbox"
    li.appendChild(checkbox);
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Видалити';
    deleteButton.className = "deleteButton"
    li.appendChild(deleteButton);

   checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
        completed_tasks++;
        remaining_tasks--;
    } else {
        completed_tasks--;
        remaining_tasks++;
    }
    updateTaskCounts();
    saveTasks();
});

deleteButton.addEventListener('click', function () {
    if (checkbox.checked) {
        completed_tasks--;
    } else {
        remaining_tasks--;
    }
    all_tasks--;
    updateTaskCounts();
    li.remove();
    saveTasks();
});
    dinamicList.appendChild(li);
}    

addTaskButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

deleteAllCompletedTasksButton.addEventListener('click', function () {
    const completedTasks = dinamicList.querySelectorAll('input[type="checkbox"]:checked');
    completedTasks.forEach(function (task) {
        const li = task.parentElement;
        if (task.checked) {
            completed_tasks--;
        } else {
            remaining_tasks--;
        }
        all_tasks--;
        updateTaskCounts();
        li.remove();
        saveTasks();
    });
});
