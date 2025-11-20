export default function createProjectCard(data = {}, { onDelete } = {}) {
  const card = document.createElement('div');
  card.className = 'project-card';

  function build(data) {
    card.innerHTML = '';

    const meta = document.createElement('div');
    meta.className = 'meta';

    const left = document.createElement('div');
    left.className = 'meta-left';

    const badge = document.createElement('span');
    badge.className = 'priority-badge';
    badge.textContent = (data.priority || 'Low').toString();

    const due = document.createElement('span');
    due.className = 'due-date';
    due.textContent = data.dueDate ? new Date(data.dueDate).toLocaleDateString() : 'No due date';

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
    del.textContent = '🗑️';

    actions.appendChild(plus);
    actions.appendChild(del);

    meta.appendChild(left);
    meta.appendChild(actions);

    const notes = document.createElement('p');
    notes.textContent = data.notes || '';

    card.appendChild(meta);
    card.appendChild(notes);

    // wire delete
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof onDelete === 'function') {
        onDelete(card);
      } else {
        if (card.parentNode) card.parentNode.removeChild(card);
      }
    });

    // plus is placeholder
    plus.addEventListener('click', (e) => {
      e.stopPropagation();
      plus.classList.toggle('active');
    });
  }

  build(data);

  return {
    element: card,
    update(newData = {}) {
      build(newData);
    }
  };
}
