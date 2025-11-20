export default function createTaskCard(taskData = {}, { onEdit, onDelete } = {}) {
  const card = document.createElement('div');
  card.className = 'task-card';
  // Add ID to DOM
  card.dataset.taskId = taskData.id;

  let currentData = { ...taskData };

  function build() {
    card.innerHTML = '';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'start';
    header.style.marginBottom = '8px';

    const title = document.createElement('h4');
    title.className = 'task-title';
    title.textContent = currentData.title || 'Untitled Task';
    title.style.margin = '0';

    const priorityBadge = document.createElement('span');
    priorityBadge.className = `task-priority priority-${currentData.priority || 'low'}`;
    priorityBadge.textContent = currentData.priority || 'Low';

    header.append(title, priorityBadge);

    const dueDate = document.createElement('div');
    dueDate.className = 'task-due-date';
    dueDate.style.fontSize = '0.85rem';
    dueDate.style.color = '#666';
    dueDate.textContent = currentData.dueDate ? `Due: ${new Date(currentData.dueDate).toLocaleDateString()}` : 'No due date';

    const notes = document.createElement('p');
    notes.className = 'task-notes';
    notes.textContent = currentData.notes || 'No notes provided.';
    notes.style.marginTop = '10px';
    notes.style.fontSize = '0.9rem';

    // Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.style.marginTop = '15px';
    actions.style.display = 'flex';
    actions.style.gap = '10px';

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card expansion
      if (typeof onEdit === 'function') onEdit(currentData);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card expansion
      if (typeof onDelete === 'function') onDelete(card);
    });

    actions.append(editButton, deleteButton);

    card.append(header, dueDate, notes, actions);

    // Toggle Expand on Card Click
    card.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
  }

  build();

  return {
    element: card,
    update(newData = {}) {
      currentData = { ...currentData, ...newData };
      build();
    },
    getData() { return currentData; }
  };
}