// ── State ──────────────────────────────────────────────────────────────
let tasks = [];          // Array of task objects: { id, text, completed }
let currentFilter = 'all';

// ── Load from localStorage on page load ────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);   // Restore saved tasks
  }
  renderTasks();
});

// ── Save to localStorage ────────────────────────────────────────────────
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ── Add Task ────────────────────────────────────────────────────────────
document.getElementById('addBtn').addEventListener('click', addTask);

// Also add task when user presses Enter
document.getElementById('taskInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();

  if (text === '') return;   // Do nothing if input is empty

  // Create a new task object
  const newTask = {
    id: Date.now(),          // Unique ID based on timestamp
    text: text,
    completed: false
  };

  tasks.push(newTask);       // Add to tasks array
  input.value = '';          // Clear the input box
  saveTasks();
  renderTasks();
}

// ── Toggle Complete ─────────────────────────────────────────────────────
function toggleTask(id) {
  // Find the task with this id and flip its completed value
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// ── Delete Task ─────────────────────────────────────────────────────────
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);   // Remove task with this id
  saveTasks();
  renderTasks();
}

// ── Clear Completed ─────────────────────────────────────────────────────
document.getElementById('clearBtn').addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);  // Keep only active tasks
  saveTasks();
  renderTasks();
});

// ── Filter Buttons ──────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button style
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentFilter = btn.dataset.filter;   // 'all', 'active', or 'completed'
    renderTasks();
  });
});

// ── Render Tasks ────────────────────────────────────────────────────────
function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';   // Clear the list before re-drawing

  // Filter tasks based on current filter
  let filtered;
  if (currentFilter === 'active') {
    filtered = tasks.filter(task => !task.completed);
  } else if (currentFilter === 'completed') {
    filtered = tasks.filter(task => task.completed);
  } else {
    filtered = tasks;   // 'all' - show everything
  }

  // Build each task item
  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Task text
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    // Put it all together
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  updateCount();
}

// ── Update Task Counter ─────────────────────────────────────────────────
function updateCount() {
  const active = tasks.filter(task => !task.completed).length;
  const label = active === 1 ? 'task' : 'tasks';
  document.getElementById('taskCount').textContent = `${active} ${label} left`;
}
