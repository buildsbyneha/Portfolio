

document.addEventListener('DOMContentLoaded', function() {
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    
    setTimeout(() => {
        welcomeOverlay.classList.add('fade-out');
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
        }, 500);
    }, 3000);

    initTheme();
    initNavigation();
    initScrollAnimations();
    initEducationAndCertifications();
    initTypingAnimation();

});


// Smooth Scrolling - Fixed version
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Only prevent default for hash links
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
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                return false;
            }
        }
    });
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    document.body.setAttribute('data-theme', 
        document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light'
    );
    themeIcon.className = document.body.getAttribute('data-theme') === 'light' 
        ? 'fas fa-sun' 
        : 'fas fa-moon';
});

// Typing Animation
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
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

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

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


function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}


// Animate Skills Progress Bars
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const skillPercent = item.getAttribute('data-skill');
        const progressBar = item.querySelector('.skill-progress');
        progressBar.style.width = skillPercent + '%';
    });
}

// Animate Stats Counter
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animationsStarted = false;
    
    if (animationsStarted) return;
    animationsStarted = true;
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 800;
        let startTime = null;
        
        function animateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            const current = Math.floor(percentage * target);
            stat.textContent = current;
            
            if (percentage < 1) {
                requestAnimationFrame(animateCounter);
            } else {
                stat.textContent = target;
            }
        }
        
        requestAnimationFrame(animateCounter);
    });
}

// Call this function when about section is in view
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

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            if (entry.target.id === 'skills') {
                animateSkills();
            }
            
            if (entry.target.id === 'about') {
                animateStats();
            }
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});


// Form Submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simple validation
    if (name && email && message) {
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
});

// Notification System
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
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});


// Parallax effect for floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
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
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple animation
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

const skillsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        document.querySelectorAll('.skill-item').forEach((item, index) => {
            setTimeout(() => {
                const percent = item.getAttribute('data-skill');
                item.querySelector('.skill-progress').style.width = percent + '%';
                const text = item.querySelector('.skill-percent');
                if (text) text.textContent = percent + '%';
            }, index * 300);
        });
    }
}, { threshold: 0.3 });

skillsObserver.observe(document.querySelector('.skills-section'));


// Education Timeline Animation
function initEducationTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add staggered animation for timeline dots
                const dot = entry.target.querySelector('.timeline-dot');
                if (dot) {
                    setTimeout(() => {
                        dot.style.transform = 'translateX(-50%) scale(1)';
                        dot.style.boxShadow = '0 0 0 4px var(--background), 0 0 0 6px var(--primary-color)';
                    }, 300);
                }
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    // Initialize timeline items with hidden state
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.2}s`;
        
        const dot = item.querySelector('.timeline-dot');
        if (dot) {
            dot.style.transform = 'translateX(-50%) scale(0)';
            dot.style.transition = 'all 0.4s ease 0.3s';
        }
        
        timelineObserver.observe(item);
    });
}

// Certifications Cards Animation
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

    // Initialize certification cards with hidden state
    certificationCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        certificationsObserver.observe(card);
    });
}

// Certificate View Modal
function initCertificateModal() {
    const viewButtons = document.querySelectorAll('.btn-certificate');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get certification details
            const card = this.closest('.certification-card');
            const title = card.querySelector('.certification-title').textContent;
            const provider = card.querySelector('.certification-provider').textContent;
            const date = card.querySelector('.certification-date').textContent.replace('Issued: ', '');
            const certId = card.querySelector('.certification-id').textContent.replace('ID: ', '');
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'certificate-modal';
            modal.innerHTML = `
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
            
            document.body.appendChild(modal);
            
            // Add modal styles
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                .certificate-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(5px);
                }
                .modal-content {
                    position: relative;
                    max-width: 600px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    border-radius: 16px;
                    padding: 2rem;
                    animation: modalSlideIn 0.3s ease;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--glass-border);
                }
                .modal-header h3 {
                    margin: 0;
                    color: var(--text-dark);
                    font-size: 1.5rem;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: var(--text-light);
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }
                .modal-close:hover {
                    background: var(--surface);
                    color: var(--primary-color);
                }
                .certificate-preview {
                    background: var(--surface);
                    border-radius: 12px;
                    padding: 2rem;
                    text-align: center;
                    margin-bottom: 1.5rem;
                    border: 2px dashed var(--glass-border);
                }
                .certificate-placeholder i {
                    font-size: 3rem;
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                }
                .certificate-placeholder p {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--text-dark);
                }
                .certificate-placeholder small {
                    color: var(--text-light);
                }
                .certificate-info {
                    margin-bottom: 1.5rem;
                }
                .certificate-info p {
                    margin-bottom: 0.5rem;
                    color: var(--text-light);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .certificate-info strong {
                    color: var(--text-dark);
                }
                .status-verified {
                    color: var(--secondary-color);
                    font-weight: 600;
                }
                .modal-footer {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                }
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes modalSlideOut {
                    from {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.9);
                    }
                }
                @media (max-width: 768px) {
                    .modal-footer {
                        flex-direction: column;
                    }
                    .certificate-info p {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.25rem;
                    }
                }
            `;
            document.head.appendChild(styleSheet);
            
            // Close modal functionality
            const closeBtn = modal.querySelector('.modal-close');
            const closeModal = () => {
                modal.style.animation = 'modalSlideOut 0.3s ease';
                setTimeout(() => {
                    modal.remove();
                    styleSheet.remove();
                }, 300);
            };
            
            closeBtn.addEventListener('click', closeModal);
            modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
                if (e.target === modal.querySelector('.modal-overlay')) {
                    closeModal();
                }
            });
            
            // Download button functionality
            modal.querySelector('.download-btn').addEventListener('click', function() {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
                this.disabled = true;
                
                // Simulate download
                setTimeout(() => {
                    showNotification('Certificate downloaded successfully!', 'success');
                    closeModal();
                }, 1500);
            });
            
            // Verify button functionality
            modal.querySelector('.verify-btn').addEventListener('click', function() {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
                this.disabled = true;
                
                // Simulate verification
                setTimeout(() => {
                    showNotification('Certificate verified successfully!', 'success');
                    this.innerHTML = '<i class="fas fa-check"></i> Verified';
                    this.classList.remove('btn-outline');
                    this.classList.add('btn-primary');
                }, 1000);
            });
            
            // Escape key to close modal
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        });
    });
}

// Education Progress Animation
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
    
    scoreElements.forEach((scoreElement, index) => {
        const originalText = scoreElement.textContent;
        const scoreMatch = originalText.match(/(CGPA|Percentage):\s*([\d.]+)/);
        
        if (scoreMatch) {
            const scoreType = scoreMatch[1];
            const targetScore = parseFloat(scoreMatch[2]);
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
                
                scoreElement.innerHTML = `<i class="fas fa-star"></i>${scoreType}: ${displayScore}${scoreType === 'CGPA' ? '/10' : '%'}`;
            }, stepTime);
        }
    });
}

// Notification system (if not already in your main JS)
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
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Initialize all education and certification functionalities
function initEducationAndCertifications() {
    initEducationTimeline();
    initCertificationsAnimation();
    initCertificateModal();
    initEducationProgress();
}

// Call the initialization function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initEducationAndCertifications();
});

// Export functions for use in your main JS file
window.EducationCertifications = {
    init: initEducationAndCertifications,
    onEducationLoad: initEducationTimeline,
    onCertificationsLoad: function() {
        initCertificationsAnimation();
        initCertificateModal();
    }
};