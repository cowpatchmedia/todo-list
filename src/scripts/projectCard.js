export default function createProjectCard(initialData = {}, { onDelete } = {}) {
  const card = document.createElement('div');
  card.className = 'project-card';

  // Store data. Ensure ID exists (passed from index.js)
  let currentData = { ...initialData };

  function build() {
    card.innerHTML = '';

    // -- HEADER: Title --
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = currentData.title || 'Untitled Project';
    title.style.margin = '0 0 8px 0'; 
    title.style.fontSize = '1.1rem';
    title.style.color = '#6b0f0f';

    // "Set Active" button
    const setActiveButton = document.createElement('button');
    setActiveButton.className = 'set-active-btn';
    setActiveButton.textContent = 'Set Active';
    // ... (your existing styles) ...
    setActiveButton.style.marginLeft = '8px';
    // ...

    setActiveButton.addEventListener('click', (e) => {
      e.stopPropagation(); 
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
    plus.textContent = '+';

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'card-delete'; // Ensure this class matches index.js checks
    del.textContent = '🗑️';

    actions.appendChild(plus);
    actions.appendChild(del);

    meta.appendChild(left);
    meta.appendChild(actions);

    const notes = document.createElement('p');
    notes.className = 'card-notes';
    notes.textContent = currentData.notes || '';

    card.appendChild(titleContainer);
    card.appendChild(meta);
    card.appendChild(notes);

    // -- Events --
    
    del.addEventListener('click', (e) => {
      e.stopPropagation(); 
      // We rely entirely on the callback passed from index.js
      if (typeof onDelete === 'function') {
        onDelete(card); 
      }
    });

    plus.addEventListener('click', (e) => {
      e.stopPropagation();
      plus.classList.toggle('active');
    });
  }

  build();

  return {
    element: card,
    update(newData = {}) {
      // Important: Preserve the ID when updating!
      // newData usually comes from form, which might not have the ID.
      currentData = { ...currentData, ...newData };
      build();
    },
    getData() {
      return currentData;
    }
  };
}