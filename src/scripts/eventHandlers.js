// eventHandlers.js - Handles user interactions and events

import createTaskForm from './taskForm.js';
import createProjectForm from './projectForm.js';
import createProjectCard from './projectCard.js';
import createTaskCard from './taskCard.js';
import { currentProject } from './currentProject.js';
import { updateProjectBadge, renderTasksForActiveProject } from './uiManager.js';

export const createEventHandlers = (dependencies) => {
  const { sidebarContainer, setCurrentProject } = dependencies;

  let currentEditingCard = null;

  const handleAddTask = (targetProject) => {
    const taskForm = createTaskForm((taskData) => {
      const taskId = `task-${Date.now()}`;
      const newTask = { id: taskId, ...taskData };

      // Initialize tasks array if missing
      if (!targetProject.tasks) targetProject.tasks = [];

      // Add to project data
      targetProject.tasks.push(newTask);

      // Update Badge in Sidebar immediately
      updateProjectBadge(sidebarContainer, targetProject.id, targetProject.tasks.length);

      // If we added a task to the CURRENTLY active project, show it
      if (currentProject && currentProject.id === targetProject.id) {
        renderTasksForActiveProject(sidebarContainer, currentProject, createTaskCard, handleTaskEdit);
      }
    });
    taskForm.open();
  };

  const handleTaskEdit = (originalTask) => {
    const taskForm = createTaskForm((updatedData) => {
      // Find the task in the current project's tasks array and update it
      const taskIndex = currentProject.tasks.findIndex(t => t.id === originalTask.id);
      if (taskIndex !== -1) {
        Object.assign(currentProject.tasks[taskIndex], updatedData);
      }
      // Re-render
      renderTasksForActiveProject(sidebarContainer, currentProject, createTaskCard, handleTaskEdit);
    });
    // Open form with existing data
    taskForm.open(originalTask);
  };

  const handleProjectSubmit = (formData) => {
    if (currentEditingCard) {
      // Update existing
      currentEditingCard.update(formData);
      // If active, update view
      if (currentProject && currentProject.id === currentEditingCard.getData().id) {
        setCurrentProject(currentEditingCard.getData());
      }
    } else {
      // Create New
      const newId = crypto.randomUUID();
      const projectData = { ...formData, id: newId, tasks: [] };

      const newCard = createProjectCard(projectData, {
        onDelete: (cardElement) => {
        if (sidebarContainer.contains(cardElement)) {
          sidebarContainer.removeChild(cardElement);
        }
        if (currentProject && currentProject.id === newId) {
          document.querySelector('.card-container').innerHTML = ''; // Clear the main display
          setCurrentProject(null);
        }
      },
        onAddTask: (dataOfThisCard) => handleAddTask(dataOfThisCard)
      });

      newCard.element.addEventListener('click', (e) => {
        // Don't edit if clicking action buttons
        if (e.target.closest('button')) return;

        currentEditingCard = newCard;
        const currentData = newCard.getData();
        projectForm.open({ ...currentData, _isEdit: true });
      });

      sidebarContainer.appendChild(newCard.element);
    }
  };

  const projectForm = createProjectForm(handleProjectSubmit);

  const setupGlobalListeners = () => {
    // 1. New Project Button
    const projectButton = document.getElementById('project-button');
    if (projectButton) {
      projectButton.addEventListener('click', () => {
        currentEditingCard = null;
        projectForm.open();
      });
    }

    // 2. New Task Button (Sidebar Header)
    const sidebarAddTaskBtn = document.getElementById('task-button');
    if (sidebarAddTaskBtn) {
      sidebarAddTaskBtn.addEventListener('click', () => {
        if (currentProject) {
          handleAddTask(currentProject);
        } else {
          alert("Please select or create a project first!");
        }
      });
    }
  };

  return { handleAddTask, handleTaskEdit, handleProjectSubmit, setupGlobalListeners, projectForm };
};