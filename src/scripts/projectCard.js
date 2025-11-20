export default function createProjectCard(initialData = {}, { onDelete } = {}) {
  const card = document.createElement('div');
  card.className = 'project-card';

  // 1. Store data in a variable we can update
  let currentData = { ...initialData };

  function build() {
    card.innerHTML = '';

    // -- HEADER: Title --
    // (Added this so you can see the project name)
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = currentData.title || 'Untitled Project';
    // specific styling for the title to look nice
    title.style.margin = '0 0 8px 0'; 
    title.style.fontSize = '1.1rem';
    title.style.color = '#6b0f0f';

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
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(notes);

    // -- Events --
    
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