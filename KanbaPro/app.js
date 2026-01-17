/**
 * KanbaPro - Premium 3D Kanban Board
 * JavaScript - Complete functionality
 */

// ========================================
// State Management
// ========================================
let tasks = JSON.parse(localStorage.getItem('kanbapro_tasks')) || [];
let editingTaskId = null;

// ========================================
// DOM Elements
// ========================================
const flashlight = document.getElementById('flashlight');
const flashlightGlow = document.getElementById('flashlight-glow');
const kanbanBoard = document.getElementById('kanbanBoard');
const taskModal = document.getElementById('taskModal');
const taskForm = document.getElementById('taskForm');
const addTaskBtn = document.getElementById('addTaskBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const toastContainer = document.getElementById('toastContainer');

// ========================================
// Flashlight Effect
// ========================================
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateFlashlight() {
    // Smooth follow effect
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    flashlight.style.left = currentX + 'px';
    flashlight.style.top = currentY + 'px';
    flashlightGlow.style.left = currentX + 'px';
    flashlightGlow.style.top = currentY + 'px';

    requestAnimationFrame(animateFlashlight);
}
animateFlashlight();

// Custom cursor
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 12px;
    height: 12px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10001;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 20px #6366f1, 0 0 40px #8b5cf6;
    transition: transform 0.1s ease, width 0.2s ease, height 0.2s ease;
`;
document.body.appendChild(cursor);

let cursorX = 0, cursorY = 0;
document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
});

function animateCursor() {
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
document.addEventListener('mouseover', (e) => {
    if (e.target.matches('button, a, input, textarea, select, .task-card, .stat-card, .user-avatar')) {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        cursor.style.background = 'rgba(99, 102, 241, 0.5)';
    }
});

document.addEventListener('mouseout', (e) => {
    if (e.target.matches('button, a, input, textarea, select, .task-card, .stat-card, .user-avatar')) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    }
});

// ========================================
// 3D Board Effect
// ========================================
document.addEventListener('mousemove', (e) => {
    const rect = kanbanBoard.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateY = ((e.clientX - centerX) / rect.width) * 3;
    const rotateX = ((e.clientY - centerY) / rect.height) * -2;

    kanbanBoard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

document.addEventListener('mouseleave', () => {
    kanbanBoard.style.transform = 'rotateX(0deg) rotateY(0deg)';
});

// ========================================
// Task Management
// ========================================
function generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function saveTasks() {
    localStorage.setItem('kanbapro_tasks', JSON.stringify(tasks));
    updateStats();
}

function createTask(data) {
    const task = {
        id: generateId(),
        title: data.title,
        description: data.description || '',
        priority: data.priority || 'medium',
        dueDate: data.dueDate || '',
        tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(t => t) : [],
        column: data.column || 'todo',
        createdAt: new Date().toISOString()
    };
    tasks.push(task);
    saveTasks();
    renderTasks();
    showToast('Tarefa criada com sucesso!', 'success');
    return task;
}

function updateTask(id, data) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
        tasks[index] = {
            ...tasks[index],
            title: data.title,
            description: data.description || '',
            priority: data.priority || 'medium',
            dueDate: data.dueDate || '',
            tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(t => t) : []
        };
        saveTasks();
        renderTasks();
        showToast('Tarefa atualizada!', 'success');
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    showToast('Tarefa excluída!', 'info');
}

function moveTask(id, newColumn) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.column = newColumn;
        saveTasks();
        renderTasks();
    }
}

// ========================================
// Render Tasks
// ========================================
function renderTasks(filter = '') {
    const columns = ['todo', 'progress', 'review', 'done'];

    columns.forEach(column => {
        const container = document.getElementById(`${column}Tasks`);
        const filteredTasks = tasks.filter(t => {
            const matchesColumn = t.column === column;
            const matchesFilter = filter === '' ||
                t.title.toLowerCase().includes(filter.toLowerCase()) ||
                t.description.toLowerCase().includes(filter.toLowerCase()) ||
                t.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
            return matchesColumn && matchesFilter;
        });

        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">${getColumnEmoji(column)}</div>
                    <p class="empty-state-text">Nenhuma tarefa aqui</p>
                </div>
            `;
        } else {
            container.innerHTML = filteredTasks.map(task => createTaskCardHTML(task)).join('');
        }

        // Update count
        document.getElementById(`${column}Count`).textContent = filteredTasks.length;
    });

    initDragAndDrop();
}

function getColumnEmoji(column) {
    const emojis = { todo: '📋', progress: '⚡', review: '🔍', done: '✅' };
    return emojis[column] || '📋';
}

function createTaskCardHTML(task) {
    const dueClass = getDueDateClass(task.dueDate);
    const formattedDate = task.dueDate ? formatDate(task.dueDate) : '';

    return `
        <div class="task-card" draggable="true" data-id="${task.id}" data-priority="${task.priority}">
            <div class="task-card-header">
                <h3 class="task-title">${escapeHtml(task.title)}</h3>
                <div class="task-actions">
                    <button class="task-action-btn edit" onclick="openEditModal('${task.id}')" title="Editar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="task-action-btn delete" onclick="confirmDelete('${task.id}')" title="Excluir">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
            ${task.tags.length > 0 ? `
                <div class="task-tags">
                    ${task.tags.map(tag => `<span class="task-tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            ` : ''}
            <div class="task-footer">
                ${formattedDate ? `
                    <div class="task-due ${dueClass}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>${formattedDate}</span>
                    </div>
                ` : '<div></div>'}
                <span class="priority-badge ${task.priority}">${getPriorityLabel(task.priority)}</span>
            </div>
        </div>
    `;
}

function getPriorityLabel(priority) {
    const labels = { low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente' };
    return labels[priority] || 'Média';
}

function getDueDateClass(dueDate) {
    if (!dueDate) return '';
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays <= 2) return 'soon';
    return '';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========================================
// Stats
// ========================================
function updateStats() {
    document.getElementById('statTodo').textContent = tasks.filter(t => t.column === 'todo').length;
    document.getElementById('statProgress').textContent = tasks.filter(t => t.column === 'progress').length;
    document.getElementById('statReview').textContent = tasks.filter(t => t.column === 'review').length;
    document.getElementById('statDone').textContent = tasks.filter(t => t.column === 'done').length;
}

// ========================================
// Drag and Drop
// ========================================
function initDragAndDrop() {
    const cards = document.querySelectorAll('.task-card');
    const columns = document.querySelectorAll('.kanban-column');

    cards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    columns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('dragenter', handleDragEnter);
        column.addEventListener('dragleave', handleDragLeave);
        column.addEventListener('drop', handleDrop);
    });
}

let draggedCard = null;

function handleDragStart(e) {
    draggedCard = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
    draggedCard = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    const column = e.target.closest('.kanban-column');
    if (column) column.classList.add('drag-over');
}

function handleDragLeave(e) {
    const column = e.target.closest('.kanban-column');
    if (column && !column.contains(e.relatedTarget)) {
        column.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.preventDefault();
    const column = e.target.closest('.kanban-column');
    if (column && draggedCard) {
        const taskId = draggedCard.dataset.id;
        const newColumn = column.dataset.column;
        moveTask(taskId, newColumn);
    }
    column?.classList.remove('drag-over');
}

// ========================================
// Modal
// ========================================
function openModal(column = 'todo') {
    editingTaskId = null;
    document.getElementById('modalTitle').textContent = 'Nova Tarefa';
    taskForm.reset();
    document.getElementById('taskColumn').value = column;
    document.getElementById('taskId').value = '';
    taskModal.classList.add('active');
}

function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        editingTaskId = taskId;
        document.getElementById('modalTitle').textContent = 'Editar Tarefa';
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDue').value = task.dueDate;
        document.getElementById('taskTags').value = task.tags.join(', ');
        document.getElementById('taskColumn').value = task.column;
        document.getElementById('taskId').value = task.id;
        taskModal.classList.add('active');
    }
}

function closeModal() {
    taskModal.classList.remove('active');
    editingTaskId = null;
    taskForm.reset();
}

function confirmDelete(taskId) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        deleteTask(taskId);
    }
}

// ========================================
// Toast
// ========================================
function showToast(message, type = 'info') {
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ========================================
// Event Listeners
// ========================================
addTaskBtn.addEventListener('click', () => openModal('todo'));
clearAllBtn.addEventListener('click', () => {
    if (tasks.length === 0) {
        showToast('Não há tarefas para limpar!', 'info');
        return;
    }
    if (confirm('Tem certeza que deseja excluir TODAS as tarefas? Esta ação não pode ser desfeita.')) {
        tasks = [];
        saveTasks();
        renderTasks();
        showToast('Todas as tarefas foram excluídas!', 'success');
    }
});
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDue').value,
        tags: document.getElementById('taskTags').value,
        column: document.getElementById('taskColumn').value
    };

    if (editingTaskId) {
        updateTask(editingTaskId, data);
    } else {
        createTask(data);
    }
    closeModal();
});

// Add card buttons in columns
document.querySelectorAll('.add-card-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.column));
});

// Search
searchInput.addEventListener('input', (e) => {
    renderTasks(e.target.value);
});

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Add sample tasks if empty
    if (tasks.length === 0) {
        tasks = [
            { id: generateId(), title: 'Redesign da Landing Page', description: 'Criar novo layout moderno com animações 3D', priority: 'high', dueDate: '2026-01-20', tags: ['design', 'frontend'], column: 'todo', createdAt: new Date().toISOString() },
            { id: generateId(), title: 'Implementar Dark Mode', description: 'Adicionar suporte a tema escuro em toda aplicação', priority: 'medium', dueDate: '2026-01-25', tags: ['ui', 'css'], column: 'todo', createdAt: new Date().toISOString() },
            { id: generateId(), title: 'API de Autenticação', description: 'Desenvolver endpoints de login e registro', priority: 'urgent', dueDate: '2026-01-15', tags: ['backend', 'api'], column: 'progress', createdAt: new Date().toISOString() },
            { id: generateId(), title: 'Testes Unitários', description: 'Escrever testes para componentes principais', priority: 'medium', dueDate: '2026-01-22', tags: ['testing'], column: 'progress', createdAt: new Date().toISOString() },
            { id: generateId(), title: 'Otimização de Performance', description: 'Melhorar tempo de carregamento da aplicação', priority: 'high', dueDate: '2026-01-18', tags: ['performance'], column: 'review', createdAt: new Date().toISOString() },
            { id: generateId(), title: 'Deploy em Produção', description: 'Configurar CI/CD e fazer deploy', priority: 'low', dueDate: '2026-01-30', tags: ['devops'], column: 'done', createdAt: new Date().toISOString() }
        ];
        saveTasks();
    }

    renderTasks();
    updateStats();
});
