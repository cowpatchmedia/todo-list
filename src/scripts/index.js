import { setHeaderTitle } from './header.js';
import createProjectForm from "./projectForm.js";
import createProjectCard from "./projectCard.js";

import "./../stylesheets/styles.css";
import "./../stylesheets/modern-normalize.css";

document.addEventListener('DOMContentLoaded', () => {
  setHeaderTitle('todo list');
  const container = document.getElementById('project-container');

  // State to track what we are editing
  let currentEditingCard = null;

  const handleFormSubmit = (formData) => {
    if (currentEditingCard) {
      // 1. Update logic
      currentEditingCard.update(formData); 
      currentEditingCard = null; 
    } else {
      // 2. Create logic
      const newCard = createProjectCard(formData, {
        onDelete: (cardElement) => cardElement.remove()
      });

      // Bind the click event HERE
      newCard.element.addEventListener('click', (e) => {
        // Prevent triggering if we clicked a delete button inside the card
        if (e.target.closest('.delete-btn') || e.target.closest('.actions')) return;

        currentEditingCard = newCard;
        
        // CRITICAL FIX: Get the *current* data from the card object
        // You must ensure createProjectCard returns an object with a getData() method
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
      currentEditingCard = null; // Ensure we are in "Create" mode
      form.open();
    });
  }
});