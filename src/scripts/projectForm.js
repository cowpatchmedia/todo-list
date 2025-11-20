export default function createProjectForm(onSubmit = () => {}) {
  // Returns an object with open(initialData) and close() methods.
  const overlay = document.createElement('div');
  overlay.className = 'project-modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'project-modal';

  // header
  const header = document.createElement('div');
  header.className = 'modal-header';
  const h3 = document.createElement('h3');
  h3.textContent = 'New Project';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.setAttribute('aria-label', 'Close form');
  closeBtn.textContent = '✕';
  // make the header title keyboard-focusable and clickable to focus the form title field
  h3.tabIndex = 0;
  h3.setAttribute('role', 'button');
  header.appendChild(h3);
  header.appendChild(closeBtn);

  // form body
  const form = document.createElement('form');
  form.className = 'project-form';
  form.addEventListener('submit', (e) => e.preventDefault());

  // title input shown above priority
  const titleGroup = document.createElement('div');
  titleGroup.className = 'form-group';
  const titleLabel = document.createElement('label');
  titleLabel.textContent = 'Title';
  const titleField = document.createElement('input');
  titleField.type = 'text';
  titleField.name = 'title';
  titleField.className = 'modal-title-input';
  titleGroup.appendChild(titleLabel);
  titleGroup.appendChild(titleField);

  // row: priority + due date
  const row1 = document.createElement('div');
  row1.className = 'form-row';

  const grpPriority = document.createElement('div');
  grpPriority.className = 'form-group';
  const labelPriority = document.createElement('label');
  labelPriority.textContent = 'Priority';
  const select = document.createElement('select');
  select.name = 'priority';
  ['low','medium','high','top'].forEach((val) => {
    const opt = document.createElement('option');
    opt.value = val;
    opt.textContent = val.charAt(0).toUpperCase() + val.slice(1);
    select.appendChild(opt);
  });
  grpPriority.appendChild(labelPriority);
  grpPriority.appendChild(select);

  const grpDate = document.createElement('div');
  grpDate.className = 'form-group';
  const labelDate = document.createElement('label');
  labelDate.textContent = 'Due date';
  const inputDate = document.createElement('input');
  inputDate.type = 'date';
  inputDate.name = 'dueDate';
  grpDate.appendChild(labelDate);
  grpDate.appendChild(inputDate);

  row1.appendChild(grpPriority);
  row1.appendChild(grpDate);

  // notes textarea
  const notesGroup = document.createElement('div');
  notesGroup.className = 'form-group';
  const notesLabel = document.createElement('label');
  notesLabel.textContent = 'Notes';
  const textarea = document.createElement('textarea');
  textarea.name = 'notes';
  notesGroup.appendChild(notesLabel);
  notesGroup.appendChild(textarea);

  // actions
  const actions = document.createElement('div');
  actions.className = 'actions';
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn secondary';
  cancelBtn.textContent = 'Cancel';
  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn';
  addBtn.textContent = 'Add';
  actions.appendChild(cancelBtn);
  actions.appendChild(addBtn);

  form.appendChild(titleGroup);
  form.appendChild(row1);
  form.appendChild(notesGroup);
  form.appendChild(actions);

  modal.appendChild(header);
  modal.appendChild(form);
  overlay.appendChild(modal);

  // events
  function close() {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }
  function open(initialData = null) {
    // populate fields if initialData provided
    if (initialData) {
      select.value = initialData.priority || 'low';
      inputDate.value = initialData.dueDate || '';
      textarea.value = initialData.notes || '';
      h3.textContent = initialData.title || 'Edit Project';
      titleField.value = initialData.title || '';
      addBtn.textContent = initialData._isEdit ? 'Save' : 'Update';
    } else {
      // reset
      select.value = 'low';
      inputDate.value = '';
      textarea.value = '';
      h3.textContent = 'New Project';
      titleField.value = '';
      addBtn.textContent = 'Add';
    }

    document.body.appendChild(overlay);
    // focus the first control asynchronously to avoid interfering
    // with the original click event that opened the form.
    setTimeout(() => select.focus(), 0);
  }

  closeBtn.addEventListener('click', close);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  addBtn.addEventListener('click', () => {
    const data = {
      title: (titleField && titleField.value) ? titleField.value.trim() : '',
      priority: select.value,
      dueDate: inputDate.value || null,
      notes: textarea.value || ''
    };
    try {
      onSubmit(data);
    } finally {
      close();
    }
  });
  // clicking the header (except the close button) focuses the title input
  header.addEventListener('click', (e) => {
    if (e.target === closeBtn) return;
    e.stopPropagation();
    titleField.focus();
    titleField.select();
  });

  // keyboard activation (Enter / Space) on the title element also focuses the input
  h3.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      titleField.focus();
      titleField.select();
    }
  });

  return { open, close, element: overlay };
}
