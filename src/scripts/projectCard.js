export default function createProjectCard(initialData = {}, { onDelete } = {}) {
  const card = document.createElement('div');
  card.className = 'project-card';

  // 1. Store data in a variable we can update
  let currentData = { ...initialData };

  function build() {
    card.innerHTML = '';

    // -- HEADER: Title --
    // (Added this so user can see the project name)
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = currentData.title || 'Untitled Project';
    
    // specific styling for the title to look nice
    title.style.margin = '0 0 8px 0'; 
    title.style.fontSize = '1.1rem';
    title.style.color = '#6b0f0f';

    // Add "Set Active" button next to the title
    const setActiveButton = document.createElement('button');
    setActiveButton.className = 'set-active-btn';
    setActiveButton.textContent = 'Set Active';
    setActiveButton.style.marginLeft = '8px';
    setActiveButton.style.padding = '4px 8px';
    setActiveButton.style.fontSize = '0.9rem';
    setActiveButton.style.cursor = 'pointer';
    setActiveButton.style.border = '1px solid #6b0f0f';
    setActiveButton.style.background = '#fbf6ef';
    setActiveButton.style.color = '#6b0f0f';
    setActiveButton.style.borderRadius = '4px';

    setActiveButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering card edit
      if (typeof window.setCurrentProject === 'function') {
        window.setCurrentProject(currentData);
      }
    });

    const titleContainer = document.createElement('div');
    titleContainer.style.display = 'flex';
    titleContainer.style.alignItems = 'center';
    titleContainer.appendChild(title);
    titleContainer.appendChild(setActiveButton);

    const meta = document.createElement('div');
    meta.className = 'meta';

    const left = document.createElement('div');
    left.className = 'meta-left';

    const badge = document.createElement('span');
    badge.className = `priority-badge priority-${currentData.priority || 'low'}`;
    badge.textContent = (currentData.priority || 'Low');
    // Capitalize first letter for display
    badge.textContent = badge.textContent.charAt(0).toUpperCase() + badge.textContent.slice(1);

    const due = document.createElement('span');
    due.className = 'due-date';
    due.textContent = currentData.dueDate ? new Date(currentData.dueDate).toLocaleDateString() : 'No due date';

    left.appendChild(badge);
    left.appendChild(due);

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'card-plus';
    plus.setAttribute('aria-label', 'Expand / add');
    plus.textContent = '+';

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'card-delete';
    del.setAttribute('aria-label', 'Delete project');
    del.textContent = '🗑️'; // Trash icon

    actions.appendChild(plus);
    actions.appendChild(del);

    meta.appendChild(left);
    meta.appendChild(actions);

    const notes = document.createElement('p');
    notes.className = 'card-notes';
    notes.textContent = currentData.notes || '';

    // Append order: Title -> Meta -> Notes
    card.appendChild(titleContainer);
    card.appendChild(meta);
    card.appendChild(notes);

    // -- Events --
    
    // Make current project.
    makeCurrent.addEventListener('click', (e) => {
    e.stopPropagation();
    setCurrentProject(currentData);
    });

    // Delete
    del.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop card click (edit)
      if (typeof onDelete === 'function') {
        onDelete(card);
      } else {
        card.remove();
      }
    });

    // Plus (Placeholder)
    plus.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop card click (edit)
      plus.classList.toggle('active');
      console.log('Add task for:', currentData.title);
    });
  }

  // Add overlay for "make current project?"
  const makeCurrent = document.createElement('div');
  makeCurrent.className = 'make-current-overlay';
  makeCurrent.textContent = 'Make current project?';

  // Show overlay only on hover
  card.appendChild(makeCurrent);

  // Overlay click: set as current project
  makeCurrent.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent edit
    if (typeof window.setCurrentProject === 'function') {
      window.setCurrentProject(currentData);
    }
  });

  // Initial build
  build();

  return {
    element: card,
    // 2. Update method: saves new data and rebuilds UI
    update(newData = {}) {
      currentData = { ...currentData, ...newData };
      build();
    },
    // 3. CRITICAL: Expose current data for the Edit Form
    getData() {
      return currentData;
    }
  };
}