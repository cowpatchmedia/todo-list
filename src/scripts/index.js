import { setHeaderTitle } from './header.js';

import createProjectForm from "./projectForm.js";
import createProjectCard from "./projectCard.js";


import "./../stylesheets/styles.css";
import "./../stylesheets/modern-normalize.css";

document.addEventListener('DOMContentLoaded', () => {
  setHeaderTitle('todo list');

  // create form and provide an onSubmit callback
  let currentEdit = null; // holds card object when editing

  const form = createProjectForm((data) => {
    const container = document.getElementById('project-container');
    if (!container) return;

    if (currentEdit) {
      // update existing card
      currentEdit.update(data);
      currentEdit = null;
      return;
    }

    // create new card
    const cardObj = createProjectCard(data, {
      onDelete: (el) => {
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }
    });

    // clicking the card (not the actions) should open the form to edit
    cardObj.element.addEventListener('click', (e) => {
      // ignore if clicking action buttons (they stopPropagation already)
      currentEdit = cardObj;
      // open form prefilled for editing
      form.open({ priority: data.priority, dueDate: data.dueDate, notes: data.notes, _isEdit: true });
    });

    container.appendChild(cardObj.element);
  });

  // wire the button to open the form
  const projectButton = document.getElementById('project-button');
  if (projectButton) {
    projectButton.addEventListener('click', () => form.open());
  }
});