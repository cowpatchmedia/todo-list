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

// Helper function to create a button
export function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.addEventListener('click', onClick);
    return button;
}

// Helper function to create a card
export function createCard(title, description, className) {
    const card = document.createElement('div');
    card.className = className;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = description;

    card.appendChild(titleElement);
    card.appendChild(descriptionElement);

    return card;
}