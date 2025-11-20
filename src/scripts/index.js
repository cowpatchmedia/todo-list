import createProjectForm from "./projectForm.js";
import createProjectCard from "./projectCard.js";

import { setCurrentProject, currentProject } from './currentProject.js';
window.setCurrentProject = setCurrentProject;

import "./../stylesheets/styles.css";
import "./../stylesheets/modern-normalize.css";

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('project-container'); // Sidebar
  const mainDisplay = document.querySelector('.card-container'); // Main Active View

  // State to track what we are editing
  let currentEditingCard = null;

  const handleFormSubmit = (formData) => {
    const projectData = {
      ...formData,
      tasks: [], // Initialize tasks array for new projects
    };

    if (currentEditingCard) {
      // Update the card UI / Internal State
      currentEditingCard.update(projectData);

      // Get the ID from the card we just edited
      const editedId = currentEditingCard.getData().id;

      // If there is an active project AND its ID matches the one we just edited...
      if (currentProject && currentProject.id === editedId) {
        // Force the active view to update with the new data (title, etc)
        setCurrentProject(currentEditingCard.getData());
      }

      currentEditingCard = null;
    } else {

      const newCard = createProjectCard(projectData, {
        onDelete: (cardElement) => {

          
          // Remove from Sidebar (Left Panel)
          if (container.contains(cardElement)) {
            container.removeChild(cardElement);
          }

          // Check if this was the Active Project
          // We need to access the data of the card being deleted. 
          // Since 'newCard' is in the closure, we can use it.
          const deletedId = newCard.getData().id;

          if (currentProject && currentProject.id === deletedId) {
            // Clear the main container
            mainDisplay.innerHTML = ''; 
            
            // clear the global state variable
            setCurrentProject(null); 
          }
        },
      });

      newCard.element.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn') || e.target.closest('.actions') || e.target.closest('.set-active-btn')) return;

        currentEditingCard = newCard;
        const currentData = newCard.getData();
        form.open({ ...currentData, _isEdit: true });
      });

      container.appendChild(newCard.element);
    }
  };

  const form = createProjectForm(handleFormSubmit);

  const projectButton = document.getElementById('project-button');
  if (projectButton) {
    projectButton.addEventListener('click', () => {
      currentEditingCard = null; 
      form.open();
    });
  }

  const handleAddTask = (projectData) => {
    const taskForm = createTaskForm((taskData) => {
      // Assign a unique ID to the new task
      const taskId = `task-${Date.now()}`;
      const newTask = { id: taskId, ...taskData };

      // Add the task to the project's tasks array
      projectData.tasks.push(newTask);

      // Update the task count badge
      const projectCard = document.querySelector(`[data-project-id="${projectData.id}"]`);
      if (projectCard) {
        const taskCountBadge = projectCard.querySelector('.task-count-badge');
        if (taskCountBadge) {
          taskCountBadge.textContent = `(${projectData.tasks.length})`;
        }
      }

      // If the project is active, render the new task in the main container
      if (currentProject && currentProject.id === projectData.id) {
        const taskCard = createTaskCard(newTask, {
          onEdit: (updatedTask) => {
            const taskIndex = projectData.tasks.findIndex((task) => task.id === updatedTask.id);
            if (taskIndex !== -1) {
              projectData.tasks[taskIndex] = updatedTask;
              renderTasksForActiveProject();
            }
          },
          onDelete: (taskElement) => {
            const taskIndex = projectData.tasks.findIndex((task) => task.id === newTask.id);
            if (taskIndex !== -1) {
              projectData.tasks.splice(taskIndex, 1);
              taskElement.remove();
              renderTasksForActiveProject();
            }
          },
        });
        document.querySelector('.card-container').appendChild(taskCard.element);
      }
    });

    taskForm.open();
  };
});