// you&I organize - JavaScript inspired by TidyCasa functionality

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navLeft = document.querySelector('.nav-left');
    const navRight = document.querySelector('.nav-right');
    
    if (navToggle && navContainer) {
        navToggle.addEventListener('click', function() {
            navContainer.classList.toggle('mobile-menu-active');
            navLeft.classList.toggle('active');
            navRight.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navContainer.classList.contains('mobile-menu-active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navContainer.classList.contains('mobile-menu-active')) {
                    navContainer.classList.remove('mobile-menu-active');
                    navLeft.classList.remove('active');
                    navRight.classList.remove('active');
                    const spans = navToggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    });
                }
            }
        });
    });
    
    // Active navigation highlighting based on scroll
    const sections = document.querySelectorAll('section[id]');
    const navMenuLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    function updateActiveNav() {
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navMenuLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Header background on scroll
    const header = document.querySelector('.header');
    
    function updateHeaderBackground() {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeaderBackground);
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeInObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .feature-item');
    animatedElements.forEach(element => {
        fadeInObserver.observe(element);
    });
    
    // Contact Form Handler with Formspree
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Don't prevent default immediately - let's validate first
            
            console.log('Form submission started'); // Debug log
            
            // Get form data
            const formData = new FormData(this);
            
            // Get values directly from formData
            const name = formData.get('name');
            const email = formData.get('email');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Debug logging
            console.log('Form data:', { name, email, service, message });
            
            // Basic validation with detailed feedback
            if (!name || name.trim() === '') {
                e.preventDefault();
                showNotification('Please enter your name.', 'error');
                return;
            }
            if (!email || email.trim() === '') {
                e.preventDefault();
                showNotification('Please enter your email address.', 'error');
                return;
            }
            if (!service || service === '') {
                e.preventDefault();
                showNotification('Please select a service type.', 'error');
                return;
            }
            
            // If we get here, validation passed, prevent default and handle with JS
            e.preventDefault();
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Try direct email instead of problematic Formspree
            const subject = 'New Quote Request - you&I organize';
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone') || 'Not provided';
            const service = formData.get('service');
            const message = formData.get('message') || 'No additional message';
            
            const body = `Hi Marissa,

I would like to request a quote for your organizing services.

Contact Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Service Requested: ${service}

Message:
${message}

Please contact me at your earliest convenience to discuss my organizing needs and provide a quote.

Thank you!
${name}`;
            
            const mailtoLink = `mailto:MMorales.organize@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Show success message and redirect to email
            showNotification('Opening your email client to send the quote request...', 'success');
            
            setTimeout(() => {
                window.location.href = mailtoLink;
                // Also redirect to thank you page after email opens
                setTimeout(() => {
                    window.location.href = 'thank-you.html';
                }, 3000);
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            e.target.value = value;
        });
    });
    
    // Scroll to top functionality
    let scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #57ddff, #3bc9e8);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 18px;
        box-shadow: 0 4px 20px rgba(87, 221, 255, 0.3);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
        } else {
            scrollTopBtn.style.opacity = '0';
        }
    });
    
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotications = document.querySelectorAll('.notification');
    existingNotications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: var(--font-primary);
        font-weight: 500;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .service-card,
    .testimonial-card,
    .feature-item {
        opacity: 0;
        transform: translateY(30px);
    }
`;
document.head.appendChild(style);

console.log('🏠 you&I organize website loaded successfully! Ready to transform spaces!');