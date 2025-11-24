// dataManager.js - Handles data operations for projects and tasks

export function addTaskToProject(project, taskData) {
  if (!project.tasks) project.tasks = [];
  const taskId = `task-${Date.now()}`;
  const newTask = { id: taskId, ...taskData };
  project.tasks.push(newTask);
  return newTask;
}

export function updateTaskInProject(project, taskId, updatedData) {
  const taskIndex = project.tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    Object.assign(project.tasks[taskIndex], updatedData);
  }
}

export function deleteTaskFromProject(project, taskId) {
  const idx = project.tasks.findIndex(t => t.id === taskId);
  if (idx > -1) {
    project.tasks.splice(idx, 1);
  }
}

export function createProject(projectData) {
  const newId = crypto.randomUUID();
  return { ...projectData, id: newId, tasks: [] };
}