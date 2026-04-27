// selecciones de DOM principales
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const statTotal = document.getElementById('stat-total');
const statCompleted = document.getElementById('stat-completed');
const statPending = document.getElementById('stat-pending');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const markAllBtn = document.getElementById('mark-all-btn');
const deleteCompletedBtn = document.getElementById('delete-completed-btn');


const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;


if (localStorage.getItem('theme') === 'dark') {
    htmlElement.classList.add('dark');
}

//evento para alternar modo oscuro y guardarlo
themeToggleBtn.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    if (htmlElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateStats();
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    statTotal.textContent = total;
    statCompleted.textContent = completed;
    statPending.textContent = total - completed;
}

function renderTasks() {
    taskList.innerHTML = ''; 
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm);
        let matchesFilter = true;
        if (filterValue === 'pending') matchesFilter = !task.completed;
        if (filterValue === 'completed') matchesFilter = task.completed;
        return matchesSearch && matchesFilter;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        // tailwind
        li.className = "bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors";
        
        li.innerHTML = `
            <div class="flex items-center gap-3 w-full sm:w-auto">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})" class="w-5 h-5 accent-blue-600 cursor-pointer">
                <span class="break-all ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}">${task.title}</span>
            </div>
            <div class="flex gap-2 w-full sm:w-auto justify-end">
                <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition-colors" onclick="editTask(${task.id})">Editar</button>
                <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors" onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        taskList.appendChild(li);
    });
    
    updateStats();
}

function addTask(e) {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;
    tasks.push({ id: Date.now(), title, completed: false, createdAt: new Date() });
    saveTasks();
    renderTasks();
    taskForm.reset();
}

window.toggleTask = id => {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    renderTasks();
};

window.deleteTask = id => {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
};

window.editTask = id => {
    const taskToEdit = tasks.find(t => t.id === id);
    const newTitle = prompt("Edita tu tarea:", taskToEdit.title);
    if (newTitle !== null && newTitle.trim() !== "") {
        tasks = tasks.map(t => t.id === id ? { ...t, title: newTitle.trim() } : t);
        saveTasks();
        renderTasks();
    }
};

searchInput.addEventListener('input', renderTasks);
filterSelect.addEventListener('change', renderTasks);

markAllBtn.addEventListener('click', () => {
    tasks = tasks.map(t => ({ ...t, completed: true }));
    saveTasks();
    renderTasks();
});

deleteCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
});

taskForm.addEventListener('submit', addTask);

// Pintar todo al cargar la página
renderTasks();