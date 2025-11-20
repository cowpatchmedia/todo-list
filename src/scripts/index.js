import createProjectForm from "./projectForm.js";
import createProjectCard from "./projectCard.js";
// Assuming setCurrentProject can handle 'null' to clear the screen
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
    if (currentEditingCard) {
      // --- UPDATE EXISTING ---
      
      // 1. Update the card UI / Internal State
      currentEditingCard.update(formData);

      // 2. Fix for Issue #1: Check ID instead of Title
      // Get the ID from the card we just edited
      const editedId = currentEditingCard.getData().id;

      // If there is an active project AND its ID matches the one we just edited...
      if (currentProject && currentProject.id === editedId) {
        // Force the active view to update with the new data (title, etc)
        setCurrentProject(currentEditingCard.getData());
      }

      currentEditingCard = null;
    } else {
      // --- CREATE NEW ---

      // 1. Assign a Unique ID. This is crucial for tracking!
      const newId = crypto.randomUUID(); // or Date.now().toString()
      const dataWithId = { ...formData, id: newId };

      const newCard = createProjectCard(dataWithId, {
        onDelete: (cardElement) => {
          // --- Fix for Issue #2: Handling Deletion ---
          
          // 1. Remove from Sidebar (Left Panel)
          if (container.contains(cardElement)) {
            container.removeChild(cardElement);
          }

          // 2. Check if this was the Active Project
          // We need to access the data of the card being deleted. 
          // Since 'newCard' is in the closure, we can use it.
          const deletedId = newCard.getData().id;

          if (currentProject && currentProject.id === deletedId) {
            // Clear the main container
            mainDisplay.innerHTML = ''; 
            
            // Optional: clear the global state variable
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
});