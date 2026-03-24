/**
 * Dammie Optimus Solutions - Contact Form Handler
 * Mocked implementation for demonstration
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initContactForm();
    initSmoothScroll();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuBtn || !navLinks) return;
    
    menuBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', isOpen);
        
        // Animate hamburger
        const spans = menuBtn.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
    
    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

/**
 * Contact Form Handler
 * Mocks form submission for demonstration
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const formSuccess = document.getElementById('formSuccess');
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate
        if (!data.name || !data.email || !data.message) {
            showError('Please fill in all required fields');
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Mock API call - simulate network delay
            await mockSubmitForm(data);
            
            // Show success message
            formSuccess.classList.add('show');
            form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 5000);
            
        } catch (error) {
            showError('Something went wrong. Please try again.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

/**
 * Mock Form Submission
 * Simulates API call with delay
 */
function mockSubmitForm(data) {
    return new Promise((resolve) => {
        console.log('Form submission:', data);
        
        // Simulate network delay
        setTimeout(() => {
            // In production, this would be a real API call
            // Example:
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });
            
            resolve({
                success: true,
                message: 'Form submitted successfully'
            });
        }, 1500);
    });
}

/**
 * Show Error Message
 */
function showError(message) {
    // Remove existing error
    const existingError = document.querySelector('.form-error');
    if (existingError) existingError.remove();
    
    // Create error element
    const errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.style.cssText = `
        padding: var(--space-md);
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid var(--error);
        border-radius: var(--radius-md);
        color: var(--error);
        font-weight: 500;
    `;
    errorEl.textContent = message;
    
    // Insert after form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(errorEl, form.nextSibling);
    
    // Auto-remove after 5 seconds
    setTimeout(() => errorEl.remove(), 5000);
}

/**
 * Smooth Scroll for Navigation Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Navbar Scroll Effect
 */
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    }
});
