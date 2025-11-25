// eventHandlers.js - Handles user interactions and events

import createTaskForm from './taskForm.js';
import createProjectForm from './projectForm.js';
import createProjectCard from './projectCard.js';
import createTaskCard from './taskCard.js';
import { currentProject } from './currentProject.js';
import { updateProjectBadge, renderTasksForActiveProject } from './uiManager.js';
import { addTaskToProject, updateTaskInProject, deleteTaskFromProject, createProject } from './dataManager.js';

export const createEventHandlers = (dependencies) => {
  const { sidebarContainer, setCurrentProject, projects } = dependencies;

  let currentEditingCard = null;

  // Register a card created outside this module so it gets the same click behavior
  const registerCard = (cardInstance) => {
    if (!cardInstance || !cardInstance.element) return;
    // store reference for later lookup
    cardInstance.element.__projectCardInstance = cardInstance;
    cardInstance.element.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      currentEditingCard = cardInstance;
      const currentData = cardInstance.getData();
      projectForm.open({ ...currentData, _isEdit: true });
    });
  };

  // Open the project form for an existing project by its id (find registered card)
  const openProjectEditById = (projectId) => {
    if (!projectId) return;
    const el = sidebarContainer.querySelector(`.project-card[data-id="${projectId}"]`);
    if (!el) return;
    const instance = el.__projectCardInstance;
    if (!instance) return;
    currentEditingCard = instance;
    projectForm.open({ ...instance.getData(), _isEdit: true });
  };

  const handleAddTask = (targetProject) => {
    const taskForm = createTaskForm((taskData) => {
      const newTask = addTaskToProject(targetProject, taskData);

      // Update Badge in Sidebar immediately
      updateProjectBadge(sidebarContainer, targetProject.id, targetProject.tasks.length);

      // If we added a task to the CURRENTLY active project, show it
      if (currentProject && currentProject.id === targetProject.id) {
        renderTasksForActiveProject(sidebarContainer, currentProject, createTaskCard, handleTaskEdit);
      }
      // Notify app that data changed so persistence can run
      try { document.dispatchEvent(new CustomEvent('dataChanged')); } catch (e) {}
    });
    taskForm.open();
  };  const handleTaskEdit = (originalTask) => {
    const taskForm = createTaskForm((updatedData) => {
      updateTaskInProject(currentProject, originalTask.id, updatedData);
      // Re-render
      renderTasksForActiveProject(sidebarContainer, currentProject, createTaskCard, handleTaskEdit);
      // Persist change
      try { document.dispatchEvent(new CustomEvent('dataChanged')); } catch (e) {}
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
        // Use the global wrapper so UI refresh runs consistently
        if (typeof window.setCurrentProject === 'function') window.setCurrentProject(currentEditingCard.getData());
      }
    } else {
      // Create New
      const projectData = createProject(formData);

      const newCard = createProjectCard(projectData, {
        onDelete: (cardElement) => {
        if (sidebarContainer.contains(cardElement)) {
          sidebarContainer.removeChild(cardElement);
        }
        // remove from projects list if provided
        if (projects && Array.isArray(projects)) {
          const idx = projects.findIndex(p => p.id === projectData.id);
          if (idx > -1) projects.splice(idx, 1);
        }
        if (currentProject && currentProject.id === projectData.id) {
          document.querySelector('.card-container').innerHTML = ''; // Clear the main display
          if (typeof window.setCurrentProject === 'function') window.setCurrentProject(null);
        }
        try { document.dispatchEvent(new CustomEvent('dataChanged')); } catch (e) {}
      },
        onAddTask: (dataOfThisCard) => handleAddTask(dataOfThisCard)
      });

      // wire the card up consistently
      registerCard(newCard);

      sidebarContainer.appendChild(newCard.element);

      // add to projects array if present
      if (projects && Array.isArray(projects)) projects.push(projectData);
      try { document.dispatchEvent(new CustomEvent('dataChanged')); } catch (e) {}
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

  return { handleAddTask, handleTaskEdit, handleProjectSubmit, setupGlobalListeners, projectForm, registerCard, openProjectEditById };
};