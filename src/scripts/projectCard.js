import { createButton, createCard } from './domUtils.js';

export default function createProjectCard(initialData = {}, { onDelete, onAddTask } = {}) {
  const card = document.createElement('div');
  card.className = 'project-card';
  
  // Store data
  let currentData = { ...initialData };
  
  // dd ID to the DOM element for easy lookup
  card.dataset.id = currentData.id;

  function build() {
    card.innerHTML = '';

    // Title
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = currentData.title || 'Untitled Project';
    title.style.margin = '0'; 
    title.style.fontSize = '1.1rem';
    title.style.color = '#6b0f0f';

    // Task Count Badge (Circle)
    const taskCountBadge = document.createElement('span');
    taskCountBadge.className = 'task-count-badge';
    // Ensure tasks exists before checking length
    const count = currentData.tasks ? currentData.tasks.length : 0;
    taskCountBadge.textContent = count;

    // Header Row
    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.alignItems = 'center';
    headerRow.style.justifyContent = 'space-between';
    headerRow.style.marginBottom = '8px';
    headerRow.style.gap = '8px';
    
    headerRow.appendChild(title);
    headerRow.appendChild(taskCountBadge);

    // Priority & Date
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.style.marginBottom = '8px';
    meta.style.fontSize = '0.85rem';

    const badge = document.createElement('span');
    badge.className = `priority-badge priority-${currentData.priority || 'low'}`;
    badge.textContent = (currentData.priority || 'Low');
    
    meta.appendChild(badge);

    // Actions Row
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    actions.style.display = 'flex';
    actions.style.gap = '8px';
    actions.style.marginTop = '8px';

    const setActiveButton = createButton('Open', 'btn-small', (e) => {
      e.stopPropagation(); 
      if (typeof window.setCurrentProject === 'function') {
        window.setCurrentProject(currentData);
      }
    });

    const addTaskButton = createButton('+', 'add-task-btn', (e) => {
      e.stopPropagation(); 
      if (typeof onAddTask === 'function') {
        onAddTask(currentData);
      }
    });
    addTaskButton.title = 'Add New Task';

    const del = createButton('🗑️', 'card-delete', (e) => {
      e.stopPropagation(); 
      if (typeof onDelete === 'function') {
        onDelete(card); 
      }
    });

    actions.appendChild(setActiveButton);
    actions.appendChild(addTaskButton);
    actions.appendChild(del);

    card.appendChild(headerRow);
    card.appendChild(meta);
    card.appendChild(actions);

    // Events
  }

  build();

  return {
    element: card,
    update(newData = {}) {
      currentData = { ...currentData, ...newData };
      // Update dataset ID in case it changed
      card.dataset.id = currentData.id; 
      build();
    },
    getData() {
      return currentData;
    }
  };
}