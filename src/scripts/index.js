import createProjectForm from "./projectForm.js";
import createProjectCard from "./projectCard.js";
import createTaskForm from "./taskForm.js";
import createTaskCard from "./taskCard.js";
import { setCurrentProject, currentProject } from './currentProject.js';
import { updateProjectBadge, renderTasksForActiveProject } from './uiManager.js';
import { createEventHandlers } from './eventHandlers.js';

// Ensure global access for the 'Set Active' button in projectCard
window.setCurrentProject = setCurrentProject;

import "./../stylesheets/styles.css";
import "./../stylesheets/modern-normalize.css";

document.addEventListener('DOMContentLoaded', () => {
  const sidebarContainer = document.getElementById('project-container'); 

  const { handleAddTask, handleTaskEdit, handleProjectSubmit, setupGlobalListeners, projectForm } = createEventHandlers({ sidebarContainer, setCurrentProject });

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
});