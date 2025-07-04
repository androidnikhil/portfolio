// Main portfolio JavaScript functionality

'use strict';

// Element toggle function
const elementToggleFunc = function (elem) { 
    elem.classList.toggle("active"); 
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize sidebar functionality
    initSidebar();
    
    // Initialize form validation
    initContactForm();
});

function initSidebar() {
    const sidebar = document.querySelector('[data-sidebar]');
    const sidebarBtn = document.querySelector('[data-sidebar-btn]');

    // Sidebar toggle functionality for mobile
    if (sidebarBtn) {
        sidebarBtn.addEventListener("click", function () { 
            elementToggleFunc(sidebar); 
        });
    }
}

function initContactForm() {
    // Contact form variables
    const form = document.querySelector("[data-form]");
    const formInputs = document.querySelectorAll("[data-form-input]");
    const formBtn = document.querySelector("[data-form-btn]");

    if (form && formInputs.length > 0 && formBtn) {
        // Add event to all form input field
        for (let i = 0; i < formInputs.length; i++) {
            formInputs[i].addEventListener("input", function () {
                // Check form validation
                if (form.checkValidity()) {
                    formBtn.removeAttribute("disabled");
                } else {
                    formBtn.setAttribute("disabled", "");
                }
            });
        }

        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            alert('Form submitted! (This is a demo)');
        });
    }
}