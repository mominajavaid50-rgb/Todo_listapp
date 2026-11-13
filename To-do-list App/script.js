

const themeToggle = document.getElementById("themeToggle");

const taskinput = document.getElementById("taskInput");
const addtaskbtn = document.getElementById("addTask");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const searchInput = document.getElementById("searchInput");

const allTasks = document.getElementById("allTasks");
const pendingTasksFilter = document.getElementById("pendingTasksFilter");
const completedTasksFilter = document.getElementById("completedTasksFilter");

const taskslist = document.getElementById("taskList");

const emptyState = document.getElementById("emptyState");


let tasksArray = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("tasksArray")
    );

    tasksArray = Array.isArray(savedTasks) ? savedTasks : [];

} catch (error) {
    tasksArray = [];
}

let currentFilter = "all";


function saveTasks() {

    localStorage.setItem(
        "tasksArray",
        JSON.stringify(tasksArray)
    );

}


function addTask() {

    const tasktext = taskinput.value.trim();

    if (tasktext === "") {

        alert("Please enter a task!");

        return;

    }

    const newTask = {

        id: Date.now(),

        text: tasktext,

        completed: false

    };

    tasksArray.push(newTask);

    taskinput.value = "";

    saveTasks();

    DisplayTasks();

}

addtaskbtn.addEventListener("click", addTask);

taskinput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});

function DisplayTasks() {

    taskslist.innerHTML = "";

    const searchText = searchInput.value.toLowerCase().trim();

    let filteredTasks = tasksArray.filter((task) => {

        return task.text.toLowerCase().includes(searchText);

    });

    if (currentFilter === "pending") {

        filteredTasks = filteredTasks.filter(
            task => !task.completed
        );

    }

    else if (currentFilter === "completed") {

        filteredTasks = filteredTasks.filter(
            task => task.completed
        );

    }
    filteredTasks.forEach((task) => {

        const taskItem = document.createElement("li");

        if (task.completed) {

            taskItem.classList.add("completed");

        }


        const taskText = document.createElement("span");

        taskText.textContent = task.text;


        const completeBtn = document.createElement("button");

        completeBtn.textContent = task.completed
            ? "Undo"
            : "Complete";

        completeBtn.addEventListener("click", function() {

            toggleTask(task.id);

        });


        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {

            deleteTask(task.id);

        });


        taskItem.appendChild(taskText);

        taskItem.appendChild(completeBtn);

        taskItem.appendChild(deleteBtn);

        taskslist.appendChild(taskItem);

    });



    updateStatistics();



    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

        const emptyMessage = emptyState.querySelector("p");

        emptyMessage.textContent = tasksArray.length === 0
            ? "No tasks yet! Add your first task."
            : "No matching tasks found!";

    }

    else {

        emptyState.style.display = "none";

    }


    allTasks.classList.toggle(
        "active",
        currentFilter === "all"
    );

    pendingTasksFilter.classList.toggle(
        "active",
        currentFilter === "pending"
    );

    completedTasksFilter.classList.toggle(
        "active",
        currentFilter === "completed"
    );

}


function toggleTask(id) {

    tasksArray = tasksArray.map((task) => {

        if (task.id === id) {

            return {

                ...task,

                completed: !task.completed

            };

        }

        return task;

    });

    saveTasks();

    DisplayTasks();

}


function deleteTask(id) {

    tasksArray = tasksArray.filter((task) => {

        return task.id !== id;

    });

    saveTasks();

    DisplayTasks();

}


function updateStatistics() {

    const total = tasksArray.length;

    const completed = tasksArray.filter(
        task => task.completed
    ).length;

    const pending = tasksArray.filter(
        task => !task.completed
    ).length;


    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}


searchInput.addEventListener("input", function() {

    DisplayTasks();

});


allTasks.addEventListener("click", function() {

    currentFilter = "all";

    DisplayTasks();

});



pendingTasksFilter.addEventListener("click", function() {

    currentFilter = "pending";

    DisplayTasks();

});


completedTasksFilter.addEventListener("click", function() {

    currentFilter = "completed";

    DisplayTasks();

});


themeToggle.addEventListener("click", function() {

    document.body.classList.toggle("dark-theme");

    const isDarkMode = document.body.classList.contains(
        "dark-theme"
    );

    themeToggle.textContent = isDarkMode
        ? "Light Mode"
        : "Dark Mode";

    localStorage.setItem("darkMode", isDarkMode);

});


const savedTheme = localStorage.getItem("darkMode");

if (savedTheme === "true") {

    document.body.classList.add("dark-theme");

    themeToggle.textContent = "Light Mode";

}

else {

    document.body.classList.remove("dark-theme");

    themeToggle.textContent = "Dark Mode";

}

DisplayTasks();
