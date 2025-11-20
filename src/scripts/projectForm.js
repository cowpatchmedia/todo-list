import { el } from './domUtils.js';

export default function createProjectForm(onSubmit = () => {}) {
  // 1. Create DOM Elements using helper to reduce noise
  const overlay = el('div', 'project-modal-overlay');
  const modal = el('div', 'project-modal');
  const header = el('div', 'modal-header');
  const form = el('form', 'project-form');
  
  // -- Header Elements --
  // The Display Title
  const displayTitle = el('h3', 'modal-title-display', 'New Project');
  displayTitle.tabIndex = 0; // Make focusable
  
  // The Editable Input (Hidden by default in CSS or via JS)
  const titleInput = el('input', 'modal-title-input', '', { 
    type: 'text', 
    name: 'title', 
    placeholder: 'Project Name' 
  });
  titleInput.style.display = 'none'; // Initially hidden

  const closeBtn = el('button', 'modal-close', '✕', { 'aria-label': 'Close' });

  header.append(displayTitle, titleInput, closeBtn);

  // -- Form Body --
  // We removed the separate "Title" group because the Header IS the title now.
  
  // Priority & Date Row
  const row1 = el('div', 'form-row');
  
  const grpPriority = el('div', 'form-group');
  const labelPriority = el('label', '', 'Priority');
  const selectPriority = el('select', '', '', { name: 'priority' });
  ['low', 'medium', 'high', 'top'].forEach(val => {
    const opt = el('option', '', val.charAt(0).toUpperCase() + val.slice(1), { value: val });
    selectPriority.appendChild(opt);
  });
  grpPriority.append(labelPriority, selectPriority);

  const grpDate = el('div', 'form-group');
  const labelDate = el('label', '', 'Due Date');
  const inputDate = el('input', '', '', { type: 'date', name: 'dueDate' });
  grpDate.append(labelDate, inputDate);

  row1.append(grpPriority, grpDate);

  // Notes
  const grpNotes = el('div', 'form-group');
  const labelNotes = el('label', '', 'Notes');
  const textareaNotes = el('textarea', '', '', { name: 'notes' });
  grpNotes.append(labelNotes, textareaNotes);

  // Actions
  const actions = el('div', 'actions');
  const cancelBtn = el('button', 'btn secondary', 'Cancel', { type: 'button' });
  const addBtn = el('button', 'btn', 'Add', { type: 'submit' }); // type submit triggers form event
  actions.append(cancelBtn, addBtn);

  // Assemble
  form.append(row1, grpNotes, actions);
  modal.append(header, form);
  overlay.append(modal);

  // -- Logic: Editable Title Switching --
  const showInput = () => {
    displayTitle.style.display = 'none';
    titleInput.style.display = 'block';
    titleInput.focus();
  };

  const showDisplay = () => {
    // If input is empty, revert to default text
    displayTitle.textContent = titleInput.value.trim() || 'New Project';
    titleInput.style.display = 'none';
    displayTitle.style.display = 'block';
  };

  displayTitle.addEventListener('click', showInput);
  displayTitle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showInput();
    }
  });

  // When leaving the input, switch back to H3
  titleInput.addEventListener('blur', showDisplay);
  // Allow pressing Enter in the title input to finish editing title (but not submit form yet)
  titleInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      titleInput.blur();
    }
  });


  // -- Logic: Open/Close --
  const close = () => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    form.reset();
  };

  const open = (initialData = null) => {
    if (initialData) {
      // Edit Mode
      titleInput.value = initialData.title || '';
      displayTitle.textContent = initialData.title || 'New Project';
      selectPriority.value = initialData.priority || 'low';
      inputDate.value = initialData.dueDate || '';
      textareaNotes.value = initialData.notes || '';
      addBtn.textContent = 'Update';
      
      // Logic decision: Do you want to start in "View" mode or "Edit" mode?
      // Usually, when editing, we show the H3.
      showDisplay(); 
    } else {
      // Create Mode
      form.reset();
      titleInput.value = '';
      displayTitle.textContent = 'New Project';
      addBtn.textContent = 'Add';
      // Logic decision: New projects usually start with the title focused
      showInput(); 
    }
    document.body.appendChild(overlay);
  };

  // -- Events --
  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
      title: titleInput.value.trim() || 'New Project',
      priority: selectPriority.value,
      dueDate: inputDate.value,
      notes: textareaNotes.value
    };
    
    onSubmit(formData);
    close();
  });

  return { open, close, element: overlay };
}