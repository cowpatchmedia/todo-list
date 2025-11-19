import loadHome from "./home.js";
import loadAbout from "./about.js";
import loadMenu from "./menu.js";


import "./../stylesheets/styles.css";
import "./../stylesheets/modern-normalize.css";

const content = document.getElementById("content");

// Clear all children
function clearContent() {
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }
}

// Render a module
function render(moduleFn) {
    clearContent();        
    content.appendChild(moduleFn());
}

// home page on load
render(loadHome);

// Add button listeners
document.getElementById("home-btn").addEventListener("click", () => {
    render(loadHome);
});

document.getElementById("menu-btn").addEventListener("click", () => {
    render(loadMenu);
});

document.getElementById("about-btn").addEventListener("click", () => {
    render(loadAbout);
});