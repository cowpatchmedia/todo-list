// uiManager.js - Handles UI rendering and updates

// Function to update the project badge in the sidebar
export function updateProjectBadge(sidebarContainer, projectId, count) {
  const card = sidebarContainer.querySelector(`.project-card[data-id="${projectId}"]`);
  if (card) {
    const badge = card.querySelector('.task-count-badge');
    if (badge) badge.textContent = `(${count})`;
  }
}

// Function to render tasks for the active project
export function renderTasksForActiveProject(sidebarContainer, currentProject, createTaskCard, handleTaskEdit) {
  const taskContainer = document.querySelector('.card-container');
  if (!taskContainer) return;

  // Track existing cards
  const existingCards = new Map();
  taskContainer.querySelectorAll('.task-card').forEach(card => {
    const taskId = card.dataset.taskId;
    existingCards.set(taskId, card);
  });

  if (!currentProject || !currentProject.tasks) return;

  currentProject.tasks.forEach((task) => {
    const existingCard = existingCards.get(task.id);
    if (existingCard) {
      // Update existing card
      const taskCardInstance = existingCard.__taskCardInstance;
      if (taskCardInstance) {
        taskCardInstance.update(task);
      }
      existingCards.delete(task.id);
    } else {
      // Create new card
      const taskCard = createTaskCard(task, {
        onEdit: handleTaskEdit,
        onDelete: (cardEl) => {
          // Remove from data (will be handled by dataManager)
          const idx = currentProject.tasks.findIndex(t => t.id === task.id);
          if (idx > -1) currentProject.tasks.splice(idx, 1);

          // Remove from DOM
          cardEl.remove();

          // Update Badge
          updateProjectBadge(sidebarContainer, currentProject.id, currentProject.tasks.length);
        }
      });
      taskContainer.appendChild(taskCard.element);
      taskCard.element.__taskCardInstance = taskCard;
    }
  });

  // Remove leftover cards
  existingCards.forEach(card => card.remove());
}