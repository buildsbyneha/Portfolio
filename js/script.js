// =============================================
// DOM Ready and Initialization
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    
    // Welcome overlay timeout
    setTimeout(() => {
        welcomeOverlay.classList.add('fade-out');
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
        }, 500);
    }, 3000);

    // Initialize all components
    initTheme();
    initNavigation();
    initScrollAnimations();
    initEducationAndCertifications();
    initTypingAnimation();
    initFormSubmission();
    initButtonEffects();
    initProjectCardHover();
}

// =============================================
// Theme Management
// =============================================

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        themeIcon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    });
}

// =============================================
// Navigation
// =============================================

function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (navToggle && navMenu) {
        // Toggle menu on button click
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when any nav link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    initSmoothScrolling();
}

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active nav link
                    updateActiveNavLink(this);
                    return false;
                }
            }
        });
    });
}

function updateActiveNavLink(clickedLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    clickedLink.classList.add('active');
}

// =============================================
// Animations & Intersection Observers
// =============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                handleSectionAnimation(entry.target.id);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Special observers for specific sections
    initAboutObserver();
    initSkillsObserver();
}

function handleSectionAnimation(sectionId) {
    switch(sectionId) {
        case 'skills':
            animateSkills();
            break;
        case 'about':
            animateStats();
            break;
    }
}

function initAboutObserver() {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }
}

function initSkillsObserver() {
    const skillsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateSkills();
        }
    }, { threshold: 0.3 });

    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

// =============================================
// Animation Functions
// =============================================

function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        setTimeout(() => {
            const percent = item.getAttribute('data-skill');
            const progressBar = item.querySelector('.skill-progress');
            const percentText = item.querySelector('.skill-percent');
            
            progressBar.style.width = percent + '%';
            if (percentText) {
                percentText.textContent = percent + '%';
            }
        }, index * 300);
    });
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animationsStarted = false;
    
    if (animationsStarted) return;
    animationsStarted = true;
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        animateCounter(stat, target, 800);
    });
}

function animateCounter(element, target, duration) {
    let startTime = null;
    
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        const current = Math.floor(percentage * target);
        element.textContent = current;
        
        if (percentage < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(step);
}

// =============================================
// Typing Animation
// =============================================

function initTypingAnimation() {
    // Initialize your typing animation here
    // Example: new TypeWriter(element, words, wait);
}

class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="highlight">${this.txt}</span>`;

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// =============================================
// Form Handling
// =============================================

function initFormSubmission() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields.', 'error');
        resetSubmitButton(submitBtn, originalText);
        return;
    }
    
    // Form submission logic
    submitForm(form, submitBtn, originalText);
}

function submitForm(form, submitBtn, originalText) {
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showNotification('✅ Message sent successfully! I\'ll reply soon.', 'success');
            form.reset();
        } else {
            throw new Error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showNotification('❌ Failed to send message. Please try again.', 'error');
    })
    .finally(() => {
        resetSubmitButton(submitBtn, originalText);
    });
}

function resetSubmitButton(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

// =============================================
// UI Effects & Interactions
// =============================================

function initButtonEffects() {
    initRippleEffect();
    initParallaxEffect();
}

function initRippleEffect() {
    // Add ripple effect CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .btn {
            position: relative;
            overflow: hidden;
        }
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
}

function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 600ms linear;
        top: ${y}px;
        left: ${x}px;
        width: ${size}px;
        height: ${size}px;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

function initProjectCardHover() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// =============================================
// Notification System
// =============================================

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--secondary-color)' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// =============================================
// Education & Certifications
// =============================================

function initEducationAndCertifications() {
    initEducationTimeline();
    initCertificationsAnimation();
    initCertificateModal();
    initEducationProgress();
}

function initEducationTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateTimelineItem(entry.target);
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach((item, index) => {
        setupTimelineItem(item, index);
        timelineObserver.observe(item);
    });
}

function setupTimelineItem(item, index) {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.6s ease ${index * 0.2}s`;
    
    const dot = item.querySelector('.timeline-dot');
    if (dot) {
        dot.style.transform = 'translateX(-50%) scale(0)';
        dot.style.transition = 'all 0.4s ease 0.3s';
    }
}

function animateTimelineItem(item) {
    item.style.opacity = '1';
    item.style.transform = 'translateY(0)';
    
    const dot = item.querySelector('.timeline-dot');
    if (dot) {
        setTimeout(() => {
            dot.style.transform = 'translateX(-50%) scale(1)';
            dot.style.boxShadow = '0 0 0 4px var(--background), 0 0 0 6px var(--primary-color)';
        }, 300);
    }
}

function initCertificationsAnimation() {
    const certificationCards = document.querySelectorAll('.certification-card');
    
    const certificationsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    certificationCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        certificationsObserver.observe(card);
    });
}

function initCertificateModal() {
    const viewButtons = document.querySelectorAll('.btn-certificate');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', handleCertificateView);
    });
}

function handleCertificateView(e) {
    e.preventDefault();
    
    const card = e.currentTarget.closest('.certification-card');
    const title = card.querySelector('.certification-title').textContent;
    const provider = card.querySelector('.certification-provider').textContent;
    const date = card.querySelector('.certification-date').textContent.replace('Issued: ', '');
    const certId = card.querySelector('.certification-id').textContent.replace('ID: ', '');
    
    createCertificateModal(title, provider, date, certId);
}

function createCertificateModal(title, provider, date, certId) {
    const modal = document.createElement('div');
    modal.className = 'certificate-modal';
    modal.innerHTML = createModalHTML(title, provider, date, certId);
    
    document.body.appendChild(modal);
    setupModalEvents(modal);
}

function createModalHTML(title, provider, date, certId) {
    return `
        <div class="modal-overlay">
            <div class="modal-content glass">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="certificate-preview">
                        <div class="certificate-placeholder">
                            <i class="fas fa-award"></i>
                            <p>Certificate Preview</p>
                            <small>${provider} - ${date}</small>
                        </div>
                    </div>
                    <div class="certificate-info">
                        <p><strong>Issued by:</strong> ${provider}</p>
                        <p><strong>Issued on:</strong> ${date}</p>
                        <p><strong>Certificate ID:</strong> ${certId}</p>
                        <p><strong>Status:</strong> <span class="status-verified">Verified</span></p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary download-btn">
                        <i class="fas fa-download"></i>
                        Download Certificate
                    </button>
                    <button class="btn btn-outline verify-btn">
                        <i class="fas fa-shield-alt"></i>
                        Verify Credential
                    </button>
                </div>
            </div>
        </div>
    `;
}

function setupModalEvents(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    const downloadBtn = modal.querySelector('.download-btn');
    const verifyBtn = modal.querySelector('.verify-btn');
    
    const closeModal = () => removeModal(modal);
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    downloadBtn.addEventListener('click', () => handleDownload(downloadBtn, closeModal));
    verifyBtn.addEventListener('click', () => handleVerification(verifyBtn));
    
    // Escape key listener
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function removeModal(modal) {
    modal.style.animation = 'modalSlideOut 0.3s ease';
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 300);
}

function handleDownload(button, closeModal) {
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
    button.disabled = true;
    
    setTimeout(() => {
        showNotification('Certificate downloaded successfully!', 'success');
        closeModal();
    }, 1500);
}

function handleVerification(button) {
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    button.disabled = true;
    
    setTimeout(() => {
        showNotification('Certificate verified successfully!', 'success');
        button.innerHTML = '<i class="fas fa-check"></i> Verified';
        button.classList.remove('btn-outline');
        button.classList.add('btn-primary');
    }, 1000);
}

function initEducationProgress() {
    const educationSection = document.getElementById('education');
    
    const progressObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateEducationScores();
        }
    }, { threshold: 0.5 });
    
    if (educationSection) {
        progressObserver.observe(educationSection);
    }
}

function animateEducationScores() {
    const scoreElements = document.querySelectorAll('.education-score');
    
    scoreElements.forEach((scoreElement) => {
        const originalText = scoreElement.textContent;
        const scoreMatch = originalText.match(/(CGPA|Percentage):\s*([\d.]+)/);
        
        if (scoreMatch) {
            const scoreType = scoreMatch[1];
            const targetScore = parseFloat(scoreMatch[2]);
            animateScoreCounter(scoreElement, scoreType, targetScore);
        }
    });
}

function animateScoreCounter(element, scoreType, targetScore) {
    let currentScore = 0;
    const duration = 1500;
    const steps = 60;
    const increment = targetScore / steps;
    const stepTime = duration / steps;
    
    const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(timer);
        }
        
        const displayScore = scoreType === 'CGPA' 
            ? currentScore.toFixed(1)
            : Math.round(currentScore);
        
        element.innerHTML = `<i class="fas fa-star"></i>${scoreType}: ${displayScore}${scoreType === 'CGPA' ? '/10' : '%'}`;
    }, stepTime);
}

// =============================================
// Export for global access (if needed)
// =============================================

window.EducationCertifications = {
    init: initEducationAndCertifications,
    onEducationLoad: initEducationTimeline,
    onCertificationsLoad: function() {
        initCertificationsAnimation();
        initCertificateModal();
    }
};