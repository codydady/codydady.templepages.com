// Dynamic Blog JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializePostCards();
    initializeScrollEffects();
    initializeContactForm();
    initializeNavigation();
    initializeThemeToggle();
});

/**
 * Initialize post card interactions
 */
function initializePostCards() {
    const postCards = document.querySelectorAll('.post-card, .viewport-post-card');
    
    postCards.forEach(card => {
        // Add click animation
        card.addEventListener('click', function(e) {
            // Create ripple effect
            createRippleEffect(e, this);
            
            // Small delay for animation before navigation
            setTimeout(() => {
                if (this.onclick) {
                    this.onclick();
                }
            }, 150);
        });
        
        // Add enhanced hover effects for viewport cards
        if (card.classList.contains('viewport-post-card')) {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.02)';
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.zIndex = 'auto';
            });
        } else {
            // Original post card hover effects
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.01)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        }
    });
}

/**
 * Create ripple effect on click
 */
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    
    // Add ripple keyframes if not exists
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Initialize scroll effects
 */
function initializeScrollEffects() {
    // Skip scroll effects for no-scroll pages
    if (document.body.classList.contains('no-scroll')) {
        return;
    }
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Fade in animation for elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.feature-card, .topic-card, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Initialize contact form functionality
 */
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name') || document.getElementById('name').value;
        const email = formData.get('email') || document.getElementById('email').value;
        const subject = formData.get('subject') || document.getElementById('subject').value;
        const message = formData.get('message') || document.getElementById('message').value;
        
        // Validate form
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Initialize navigation enhancements
 */
function initializeNavigation() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add active state to navigation based on scroll position
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id], main');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Navbar transparency effect (skip for no-scroll pages)
    const navbar = document.querySelector('.navbar');
    if (navbar && navbar.classList.contains('fixed-top') && !document.body.classList.contains('no-scroll')) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(33, 37, 41, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.backgroundColor = 'var(--bs-dark)';
                navbar.style.backdropFilter = 'none';
            }
        });
    }
}

/**
 * Add CSS for slide-in animation
 */
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialize tooltips and popovers if Bootstrap is available
 */
if (typeof bootstrap !== 'undefined') {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

/**
 * Initialize theme toggle functionality
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeText = document.getElementById('themeText');
    
    if (!themeToggle || !themeText) return;
    
    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    function setTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeText.textContent = 'Dark Theme';
            themeToggle.querySelector('i').className = 'fas fa-moon me-2';
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeText.textContent = 'Light Theme';
            themeToggle.querySelector('i').className = 'fas fa-sun me-2';
        }
    }
}

/**
 * Add loading state for page transitions
 */
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (link && !link.getAttribute('href').startsWith('#') && !link.getAttribute('href').startsWith('mailto:')) {
        // Add loading overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
            font-size: 1.2rem;
        `;
        overlay.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
        
        document.body.appendChild(overlay);
        
        // Remove overlay if page doesn't change (e.g., external links)
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 3000);
    }
});
