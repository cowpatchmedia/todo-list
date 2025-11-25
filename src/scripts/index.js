import createProjectForm from "./projectForm.js";
import createProjectCard from "./projectCard.js";
import createTaskForm from "./taskForm.js";
import createTaskCard from "./taskCard.js";
import { setCurrentProject, currentProject } from './currentProject.js';
import { updateProjectBadge, renderTasksForActiveProject } from './uiManager.js';
import { createEventHandlers } from './eventHandlers.js';
import { load, saveDebounced } from './storageManager.js';
import { createProject, addTaskToProject } from './dataManager.js';

// Ensure global access for the 'Set Active' button in projectCard
window.setCurrentProject = setCurrentProject;

import "./../stylesheets/styles.css";
import "./../stylesheets/modern-normalize.css";

document.addEventListener('DOMContentLoaded', () => {
  const sidebarContainer = document.getElementById('project-container'); 

  // Shared in-memory projects array (will be populated from storage if available)
  const allProjects = [];

  const { handleAddTask, handleTaskEdit, handleProjectSubmit, setupGlobalListeners, projectForm, registerCard, openProjectEditById } = createEventHandlers({ sidebarContainer, setCurrentProject, projects: allProjects });

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
    // Wire active-project action buttons (edit/add/delete)
    const activeEdit = document.querySelector('.active-project .active-edit-btn');
    const activeAdd = document.querySelector('.active-project .active-addtask-btn');
    const activeDel = document.querySelector('.active-project .active-delete-btn');

    if (activeEdit) {
      activeEdit.onclick = () => {
        if (typeof openProjectEditById === 'function' && currentProject) openProjectEditById(currentProject.id);
      };
    }
    if (activeAdd) {
      activeAdd.onclick = () => {
        if (currentProject) handleAddTask(currentProject);
      };
    }
    if (activeDel) {
      activeDel.onclick = () => {
        if (!currentProject) return;
        const sidebarCard = sidebarContainer.querySelector(`.project-card[data-id="${currentProject.id}"]`);
        if (sidebarCard) {
          const delBtn = sidebarCard.querySelector('.card-delete');
          if (delBtn) delBtn.click();
        } else {
          // fallback: clear active view
          if (typeof window.setCurrentProject === 'function') window.setCurrentProject(null);
        }
      };
    }
  };






  setupGlobalListeners();

  // Load persisted projects (if any)
  const persisted = load();
  if (persisted && Array.isArray(persisted) && persisted.length > 0) {
    // Preserve the same array reference so eventHandlers can mutate it
    allProjects.push(...persisted);
  } else {
    // Create a sensible default when no persisted data exists
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

    allProjects.push(defaultProject);
  }

  // Render all projects into the sidebar
  allProjects.forEach((p) => {
    const card = createProjectCard(p, {
      onDelete: (cardElement) => {
        if (sidebarContainer.contains(cardElement)) sidebarContainer.removeChild(cardElement);
        const idx = allProjects.findIndex(x => x.id === p.id);
        if (idx > -1) allProjects.splice(idx, 1);
        if (currentProject && currentProject.id === p.id) {
          const container = document.querySelector('.card-container');
          if (container) container.innerHTML = '';
          if (typeof window.setCurrentProject === 'function') window.setCurrentProject(null);
        }
        try { document.dispatchEvent(new CustomEvent('dataChanged')); } catch (e) {}
      },
      onAddTask: (dataOfThisCard) => handleAddTask(dataOfThisCard)
    });
    // Ensure consistent behavior
    if (typeof registerCard === 'function') registerCard(card);
    sidebarContainer.appendChild(card.element);
  });

  // Activate first project if available
  if (allProjects.length > 0 && typeof window.setCurrentProject === 'function') {
    window.setCurrentProject(allProjects[0]);
  }

  // Persist on data changes (debounced)
  document.addEventListener('dataChanged', () => saveDebounced(allProjects));
});