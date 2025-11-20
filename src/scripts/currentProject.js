// currentProject.js

export let currentProject = null;

export function setCurrentProject(projectData) {
  currentProject = projectData;
  renderCurrentProject();
}

export function renderCurrentProject() {
  const mainContent = document.querySelector('.content');
  
  if (!currentProject) {
    mainContent.innerHTML = '<div class="empty-state">Please create a new project.</div>';
    return;
  }

  // We render the Project Details AND an empty container for the tasks
  mainContent.innerHTML = `
    <div class="active-project">
      <h2 class="project-title-large">${currentProject.title}</h2>
      <div class="project-meta">
        <p><strong>Priority:</strong> <span class="priority-text">${currentProject.priority}</span></p>
        <p><strong>Due:</strong> ${
          currentProject.dueDate ? new Date(currentProject.dueDate).toLocaleDateString() : 'None'
        }</p>
      </div>
      <p class="project-notes">${currentProject.notes || 'No notes'}</p>
    </div>
    
    <div class="card-container"></div>
  `;
}