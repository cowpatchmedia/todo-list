export default function createTaskCard(taskData = {}, { onEdit, onDelete } = {}) {
  const card = document.createElement('div');
  card.className = 'task-card';

  // Store task data
  let currentData = { ...taskData };

  function build() {
    card.innerHTML = '';

    // Title
    const title = document.createElement('h4');
    title.className = 'task-title';
    title.textContent = currentData.title || 'Untitled Task';

    // Priority Badge
    const priorityBadge = document.createElement('span');
    priorityBadge.className = `task-priority priority-${currentData.priority || 'low'}`;
    priorityBadge.textContent = currentData.priority || 'Low';

    // Due Date
    const dueDate = document.createElement('span');
    dueDate.className = 'task-due-date';
    dueDate.textContent = currentData.dueDate ? new Date(currentData.dueDate).toLocaleDateString() : 'No due date';

    // Notes (hidden by default)
    const notes = document.createElement('p');
    notes.className = 'task-notes';
    notes.textContent = currentData.notes || '';
    notes.style.display = 'none';

    // Expand/Collapse Button
    const expandButton = document.createElement('button');
    expandButton.className = 'task-expand';
    expandButton.textContent = 'Expand';
    expandButton.addEventListener('click', () => {
      const isExpanded = notes.style.display === 'block';
      notes.style.display = isExpanded ? 'none' : 'block';
      expandButton.textContent = isExpanded ? 'Expand' : 'Collapse';
    });

    // Edit Button
    const editButton = document.createElement('button');
    editButton.className = 'task-edit';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      if (typeof onEdit === 'function') {
        onEdit(currentData);
      }
    });

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'task-delete';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      if (typeof onDelete === 'function') {
        onDelete(card);
      } else {
        card.remove();
      }
    });

    // Actions Container
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.append(editButton, deleteButton);

    // Append elements to card
    card.append(title, priorityBadge, dueDate, notes, expandButton, actions);
  }

  // Initial build
  build();

  return {
    element: card,
    update(newData = {}) {
      currentData = { ...currentData, ...newData };
      build();
    },
    getData() {
      return currentData;
    },
  };
}