import createProjectForm from "./projectForm.js";
import createProjectCard from "./projectCard.js";
import createTaskForm from "./taskForm.js";
import createTaskCard from "./taskCard.js";
import { setCurrentProject, currentProject } from './currentProject.js';

// Ensure global access for the 'Set Active' button in projectCard
window.setCurrentProject = setCurrentProject;

import "./../stylesheets/styles.css";
import "./../stylesheets/modern-normalize.css";

document.addEventListener('DOMContentLoaded', () => {
  const sidebarContainer = document.getElementById('project-container'); 

  let currentEditingCard = null;

  // --- Helper: Update Sidebar Badge ---
  const updateProjectBadge = (projectId, count) => {
    // Find the specific project card in the sidebar using the data-id we added
    const card = sidebarContainer.querySelector(`.project-card[data-id="${projectId}"]`);
    if (card) {
      const badge = card.querySelector('.task-count-badge');
      if (badge) badge.textContent = count;
    }
  };

  // --- Helper: Render Tasks ---
  const renderTasksForActiveProject = () => {
    const taskContainer = document.querySelector('.card-container');
    if(!taskContainer) return;
    
    taskContainer.innerHTML = ''; // Clear existing
    
    if (!currentProject || !currentProject.tasks) return;

    currentProject.tasks.forEach((task) => {
      const taskCard = createTaskCard(task, {
        onEdit: (taskData) => handleTaskEdit(taskData),
        onDelete: (cardEl) => {
          // Remove from data
          const idx = currentProject.tasks.findIndex(t => t.id === task.id);
          if (idx > -1) currentProject.tasks.splice(idx, 1);
          
          // Remove from DOM
          cardEl.remove();
          
          // Update Badge in Sidebar
          updateProjectBadge(currentProject.id, currentProject.tasks.length);
        }
      });
    taskContainer.appendChild(taskCard.element);
    console.log('Appending task card:', taskCard.element);
    });
  };

  // Override the imported setCurrentProject to add rendering logic
  // (We are wrapping the original to trigger a UI refresh)
  const originalSetCurrentProject = window.setCurrentProject;
  window.setCurrentProject = (projectData) => {
    originalSetCurrentProject(projectData); // Call original to set state
    renderTasksForActiveProject(); // Then render tasks
  };

  // --- Task Handlers ---

  const handleAddTask = (targetProject) => {
    const taskForm = createTaskForm((taskData) => {
      const taskId = `task-${Date.now()}`;
      const newTask = { id: taskId, ...taskData };

      // Initialize tasks array if missing
      if (!targetProject.tasks) targetProject.tasks = [];
      
      // Add to project data
      targetProject.tasks.push(newTask);

      console.log('Adding task to project:', targetProject);
      console.log('Updated tasks:', targetProject.tasks);

      // Update Badge in Sidebar immediately
      updateProjectBadge(targetProject.id, targetProject.tasks.length);

      // If we added a task to the CURRENTLY active project, show it
      if (currentProject && currentProject.id === targetProject.id) {
        renderTasksForActiveProject();
      }
    });
    taskForm.open();
  };

  const handleTaskEdit = (originalTask) => {
    const taskForm = createTaskForm((updatedData) => {
      // Merge updates
      Object.assign(originalTask, updatedData);
      // Re-render
      renderTasksForActiveProject();
    });
    // Open form with existing data
    taskForm.open(originalTask);
  };


  // --- Project Handlers ---

  const handleProjectSubmit = (formData) => {
    if (currentEditingCard) {
      // Update existing
      currentEditingCard.update(formData);
      // If active, update view
      if (currentProject && currentProject.id === currentEditingCard.getData().id) {
        window.setCurrentProject(currentEditingCard.getData());
      }
      currentEditingCard = null;
    } else {
      // Create New
      const newId = crypto.randomUUID();
      const projectData = { ...formData, id: newId, tasks: [] };

      const newCard = createProjectCard(projectData, {
        onDelete: (cardElement) => {
          if (sidebarContainer.contains(cardElement)) {
            sidebarContainer.removeChild(cardElement);
          }
          const mainDisplay = document.querySelector('.card-container'); // Ensure mainDisplay is accessible
          if (currentProject && currentProject.id === newId) {
            mainDisplay.innerHTML = ''; // Clear the main display
            originalSetCurrentProject(null);
          }
        },
        // FIX: We pass the callback here!
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

  // --- Global Button Listeners ---

  // 1. New Project Button
  const projectButton = document.getElementById('project-button');
  if (projectButton) {
    projectButton.addEventListener('click', () => {
      currentEditingCard = null;
      projectForm.open();
    });
  }

  // 2. New Task Button (Sidebar Header)
  // FIX: Corrected ID selector
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
});