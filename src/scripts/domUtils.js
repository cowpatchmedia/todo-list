// domUtils.js - Utility functions for DOM manipulation
export const el = (tag, classes = '', text = '', attributes = {}) => {
  const element = document.createElement(tag);
  if (classes) element.className = classes;
  if (text) element.textContent = text;
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
};