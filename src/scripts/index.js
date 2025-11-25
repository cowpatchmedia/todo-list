import createProjectForm from "./projectForm.js";
import createProjectCard from "./projectCard.js";
import createTaskForm from "./taskForm.js";
import createTaskCard from "./taskCard.js";
import { setCurrentProject, currentProject } from './currentProject.js';
import { updateProjectBadge, renderTasksForActiveProject } from './uiManager.js';
import { createEventHandlers } from './eventHandlers.js';
import { createProject, addTaskToProject } from './dataManager.js';

// Ensure global access for the 'Set Active' button in projectCard
window.setCurrentProject = setCurrentProject;

import "./../stylesheets/styles.css";
import "./../stylesheets/modern-normalize.css";

document.addEventListener('DOMContentLoaded', () => {
  const sidebarContainer = document.getElementById('project-container'); 

  const { handleAddTask, handleTaskEdit, handleProjectSubmit, setupGlobalListeners, projectForm, registerCard } = createEventHandlers({ sidebarContainer, setCurrentProject });

  // --- Helper: Update Sidebar Badge ---
  // Moved to uiManager.js

  // --- Helper: Render Tasks ---
  // Moved to uiManager.js

  // Override the imported setCurrentProject to add rendering logic
  // (We are wrapping the original to trigger a UI refresh)
  const originalSetCurrentProject = window.setCurrentProject;
  window.setCurrentProject = (projectData) => {
    originalSetCurrentProject(projectData); // Call original to set state
    renderTasksForActiveProject(sidebarContainer, currentProject, createTaskCard, handleTaskEdit); // Then render tasks
  };






  setupGlobalListeners();

  // Create default project if none exist
  if (sidebarContainer.children.length === 0) {
    const defaultProject = createProject({
      title: "Clean Kitchen",
      priority: "low",
      dueDate: new Date().toISOString().split('T')[0], // today's date
      notes: ""
    });

    addTaskToProject(defaultProject, {
      title: "turn off the stove",
      priority: "high",
      dueDate: new Date().toISOString().split('T')[0],
      notes: "did I remember to turn off the stove before I left??"
    });

    const card = createProjectCard(defaultProject, {
      onDelete: (cardElement) => {
        if (sidebarContainer.contains(cardElement)) {
          sidebarContainer.removeChild(cardElement);
        }
        if (currentProject && currentProject.id === defaultProject.id) {
          document.querySelector('.card-container').innerHTML = '';
          setCurrentProject(null);
        }
      },
      onAddTask: (dataOfThisCard) => handleAddTask(dataOfThisCard)
    });

    sidebarContainer.appendChild(card.element);

    // wire default card with same behavior (edit/open)
    if (typeof registerCard === 'function') registerCard(card);

    // Set as active project (use global wrapper)
    if (typeof window.setCurrentProject === 'function') window.setCurrentProject(defaultProject);
  }
});