export let currentProject = null;

export function setCurrentProject(projectData) {
  currentProject = projectData;
  renderCurrentProject();
}

export function renderCurrentProject() {
  const mainContent = document.querySelector('.content');
  if (!currentProject) {
    mainContent.innerHTML = '<div class="empty-state">No project selected.</div>';
    return;
  }
  mainContent.innerHTML = `
    <div class="active-project">
      <h2>${currentProject.title}</h2>
      <p><strong>Priority:</strong> ${currentProject.priority}</p>
      <p><strong>Due Date:</strong> ${
        currentProject.dueDate ? new Date(currentProject.dueDate).toLocaleDateString() : 'No due date'
      }</p>
      <p><strong>Notes:</strong> ${currentProject.notes}</p>
    </div>
  `;
}