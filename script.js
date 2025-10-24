// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const loginBtn = document.getElementById('loginBtn');
const generateVideoBtn = document.getElementById('generateVideoBtn');
const generateCartoonBtn = document.getElementById('generateCartoonBtn');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const loadingModal = document.getElementById('loadingModal');
const successModal = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');

// Mobile Menu
function createMobileMenu() {
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <nav class="mobile-menu-nav">
            <a href="#generate-video" onclick="closeMobileMenu()">Generate Video</a>
            <a href="#generate-cartoon" onclick="closeMobileMenu()">Create Cartoon</a>
            <a href="#login" onclick="closeMobileMenu()">Login</a>
        </nav>
    `;
    document.body.appendChild(mobileMenu);
    return mobileMenu;
}

const mobileMenu = createMobileMenu();

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
}

// Modal Functions
function showModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showLoading(message = 'Generating your video...') {
    const loadingText = loadingModal.querySelector('.loading-text');
    loadingText.textContent = message;
    showModal(loadingModal);
}

function showSuccess(message) {
    successMessage.textContent = message;
    showModal(successModal);
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loadingModal) {
        hideModal(loadingModal);
    }
    if (e.target === successModal) {
        hideModal(successModal);
    }
});

// Close success modal
closeSuccessBtn.addEventListener('click', () => {
    hideModal(successModal);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formData) {
    const errors = [];
    
    if (!formData.prompt || formData.prompt.trim().length < 10) {
        errors.push('Please provide a detailed description (at least 10 characters)');
    }
    
    if (formData.email && !validateEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    return errors;
}

// Show errors
function showErrors(errors) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <style>
            .error-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9));
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 1002;
                max-width: 300px;
                backdrop-filter: blur(10px);
                animation: slideIn 0.3s ease;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        </style>
        <strong>Error:</strong><br>
        ${errors.join('<br>')}
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Generate Video
generateVideoBtn.addEventListener('click', async () => {
    const prompt = document.getElementById('video-prompt').value.trim();
    const duration = document.getElementById('video-duration').value;
    const style = document.getElementById('video-style').value;
    
    const errors = validateForm({ prompt });
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    showLoading('Generating your AI video...');
    
    try {
        // Simulate API call
        await simulateVideoGeneration({
            prompt,
            duration,
            style,
            type: 'video'
        });
        
        showSuccess('Your video has been generated successfully! You can download it from your dashboard.');
        
        // Clear form
        document.getElementById('video-prompt').value = '';
        
    } catch (error) {
        showErrors(['Failed to generate video. Please try again.']);
    } finally {
        hideModal(loadingModal);
    }
});

// Generate Cartoon
generateCartoonBtn.addEventListener('click', async () => {
    const prompt = document.getElementById('cartoon-prompt').value.trim();
    const characters = document.getElementById('cartoon-characters').value.trim();
    const style = document.getElementById('cartoon-style').value;
    
    const errors = validateForm({ prompt });
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    showLoading('Creating your cartoon video...');
    
    try {
        // Simulate API call
        await simulateVideoGeneration({
            prompt,
            characters,
            style,
            type: 'cartoon'
        });
        
        showSuccess('Your cartoon has been created successfully! You can download it from your dashboard.');
        
        // Clear form
        document.getElementById('cartoon-prompt').value = '';
        document.getElementById('cartoon-characters').value = '';
        
    } catch (error) {
        showErrors(['Failed to create cartoon. Please try again.']);
    } finally {
        hideModal(loadingModal);
    }
});

// Login
loginSubmitBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    const errors = validateForm({ email });
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    if (!password || password.length < 6) {
        showErrors(['Password must be at least 6 characters long']);
        return;
    }
    
    showLoading('Logging you in...');
    
    try {
        // Simulate login
        await simulateLogin(email, password);
        
        showSuccess('Login successful! Welcome back.');
        
        // Update UI
        loginBtn.textContent = 'Account';
        loginBtn.href = '#account';
        
        // Clear form
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        
    } catch (error) {
        showErrors(['Invalid email or password. Please try again.']);
    } finally {
        hideModal(loadingModal);
    }
});

// Simulate API calls (replace with real API calls)
async function simulateVideoGeneration(data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate random success/failure
    if (Math.random() > 0.1) { // 90% success rate
        return { success: true, id: 'video_' + Date.now() };
    } else {
        throw new Error('Generation failed');
    }
}

async function simulateLogin(email, password) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate authentication
    if (email && password.length >= 6) {
        return { success: true, user: { email } };
    } else {
        throw new Error('Invalid credentials');
    }
}

// Add some interactivity
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add typing effect to hero title (optional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 1s ease-in';
            heroTitle.style.opacity = '1';
        }, 500);
    }
    
    // Add scroll animations
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
    
    // Observe sections for scroll animations
    document.querySelectorAll('.generate-section, .features').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        hideModal(loadingModal);
        hideModal(successModal);
        closeMobileMenu();
    }
    
    // Ctrl/Cmd + K to focus search (if you add search later)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Focus search input
    }
});

// Performance optimization - debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Parallax effect for background
window.addEventListener('scroll', debounce(() => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.background');
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}, 10));

// Add loading states to buttons
function setButtonLoading(button, loading = true) {
    if (loading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="loading-spinner-small"></span> Processing...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText;
    }
}

// Add small loading spinner style
const style = document.createElement('style');
style.textContent = `
    .loading-spinner-small {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }
`;
document.head.appendChild(style);

// Console Easter egg
console.log('%c🎬 Welcome to VidCrafter!', 'font-size: 20px; color: #8b5cf6; font-weight: bold;');
console.log('%cCreate amazing videos with AI! 🚀', 'font-size: 14px; color: #06b6d4;');