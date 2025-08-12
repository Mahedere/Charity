// ===== GLOBAL VARIABLES =====
let currentLanguage = 'en';
let currentSlide = 0;
let carouselInterval;

// ===== DOM ELEMENTS =====
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const languageToggleDesktop = document.getElementById('language-toggle-desktop');
const languageToggleMobile = document.getElementById('language-toggle-mobile');
const scrollUpBtn = document.getElementById('scroll-up');
const contactForm = document.getElementById('contact-form');
const carouselTrack = document.getElementById('carousel-track');
const carouselIndicators = document.getElementById('carousel-indicators');

// ===== NAVIGATION MENU =====
function showMenu() {
    if (navMenu) {
        navMenu.classList.add('nav__menu--active');
    }
}

function hideMenu() {
    if (navMenu) {
        navMenu.classList.remove('nav__menu--active');
    }
}

// Event listeners for navigation
if (navToggle) {
    navToggle.addEventListener('click', showMenu);
}

if (navClose) {
    navClose.addEventListener('click', hideMenu);
}

// Close menu when clicking on nav links
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', hideMenu);
});

// ===== LANGUAGE TOGGLE =====
function updateLanguageToggleText() {
    const toggleText = currentLanguage === 'en' ? 'አማ' : 'EN';
    
    if (languageToggleDesktop) {
        languageToggleDesktop.querySelector('.language-toggle__text').textContent = toggleText;
    }
    if (languageToggleMobile) {
        languageToggleMobile.querySelector('.language-toggle__text').textContent = toggleText;
    }
}

function updateContent() {
    const elements = document.querySelectorAll('[data-en][data-am]');
    
    elements.forEach(element => {
        const content = currentLanguage === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-am');
        if (content) {
            element.textContent = content;
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.setAttribute('lang', currentLanguage);
    document.documentElement.setAttribute('data-lang', currentLanguage);
    
    updateLanguageToggleText();
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'am' : 'en';
    updateContent();
    
    // Store language preference
    localStorage.setItem('preferred-language', currentLanguage);
    
    // Show notification
    showNotification(
        currentLanguage === 'en' ? 'Language changed to English' : 'ቋንቋ ወደ አማርኛ ተቀይሯል',
        'info'
    );
}

// Event listeners for language toggle
if (languageToggleDesktop) {
    languageToggleDesktop.addEventListener('click', toggleLanguage);
}

if (languageToggleMobile) {
    languageToggleMobile.addEventListener('click', toggleLanguage);
}

// ===== IMAGE CAROUSEL =====
function initCarousel() {
    const images = document.querySelectorAll('.carousel__image');
    const indicators = document.querySelectorAll('.carousel__indicator');
    
    if (images.length === 0) return;
    
    function showSlide(index) {
        // Hide all images
        images.forEach(img => img.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Show current image
        if (images[index]) {
            images[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % images.length;
        showSlide(nextIndex);
    }
    
    function startCarousel() {
        carouselInterval = setInterval(nextSlide, 1500); // Change every 1.5 seconds
    }
    
    function stopCarousel() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }
    
    // Add click event listeners to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopCarousel();
            startCarousel(); // Restart the interval
        });
    });
    
    // Pause carousel on hover
    if (carouselTrack) {
        carouselTrack.addEventListener('mouseenter', stopCarousel);
        carouselTrack.addEventListener('mouseleave', startCarousel);
    }
    
    // Start the carousel
    startCarousel();
}

// ===== SCROLL UP BUTTON =====
function toggleScrollUpButton() {
    if (scrollUpBtn) {
        if (window.scrollY >= 350) {
            scrollUpBtn.classList.add('scrollup--show');
        } else {
            scrollUpBtn.classList.remove('scrollup--show');
        }
    }
}

if (scrollUpBtn) {
    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== HEADER SCROLL EFFECT =====
function handleHeaderScroll() {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY >= 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    }
}

// ===== FAQ FUNCTIONALITY =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('faq__item--active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('faq__item--active');
                    const faqAnswer = faqItem.querySelector('.faq__answer');
                    if (faqAnswer) {
                        faqAnswer.style.maxHeight = '0';
                    }
                    const faqQuestion = faqItem.querySelector('.faq__question');
                    if (faqQuestion) {
                        faqQuestion.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('faq__item--active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });
}

// ===== DONATION AMOUNT SELECTION =====
function initDonationAmounts() {
    const amountBtns = document.querySelectorAll('.amount-btn');
    const customInput = document.querySelector('.donation__custom-input');
    
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            amountBtns.forEach(b => b.classList.remove('amount-btn--active'));
            
            // Add active class to clicked button
            btn.classList.add('amount-btn--active');
            
            // Clear custom input
            if (customInput) {
                customInput.value = '';
            }
        });
    });
    
    if (customInput) {
        customInput.addEventListener('input', () => {
            // Remove active class from all buttons when typing custom amount
            amountBtns.forEach(btn => btn.classList.remove('amount-btn--active'));
        });
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = currentLanguage === 'en' ? 'Sending...' : 'እየላካል...';
            submitBtn.disabled = true;
            
            try {
                // Simulate form submission (replace with actual endpoint)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                showNotification(
                    currentLanguage === 'en' 
                        ? 'Message sent successfully! We\'ll get back to you soon.' 
                        : 'መልእክት በተሳካ ሁኔታ ተልኳል! በቅርቡ እናገኝዎታለን።',
                    'success'
                );
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                // Show error message
                showNotification(
                    currentLanguage === 'en' 
                        ? 'Failed to send message. Please try again.' 
                        : 'መልእክት መላክ አልተሳካም። እባክዎ እንደገና ይሞክሩ።',
                    'error'
                );
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('notification--visible');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('notification--visible');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('header')?.offsetHeight || 70;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                hideMenu();
            }
        });
    });
}

// ===== GALLERY LIGHTBOX =====
function initGalleryLightbox() {
    const galleryImages = document.querySelectorAll('.gallery__img');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            // Create lightbox overlay
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox-overlay';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}" class="lightbox-image">
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            
            // Add styles
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            const content = lightbox.querySelector('.lightbox-content');
            content.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
            `;
            
            const image = lightbox.querySelector('.lightbox-image');
            image.style.cssText = `
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            `;
            
            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 30px;
                cursor: pointer;
                padding: 5px 10px;
            `;
            
            // Add to DOM
            document.body.appendChild(lightbox);
            
            // Show lightbox
            setTimeout(() => {
                lightbox.style.opacity = '1';
            }, 10);
            
            // Close lightbox function
            function closeLightbox() {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    if (lightbox.parentNode) {
                        lightbox.parentNode.removeChild(lightbox);
                    }
                }, 300);
            }
            
            // Event listeners
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
            
            // ESC key to close
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
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
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .program-card,
        .story-card,
        .event-card,
        .certification-card,
        .value-card,
        .stats__card
    `);
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== INITIALIZATION =====
function init() {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== currentLanguage) {
        currentLanguage = savedLanguage;
        updateContent();
    }
    
    // Initialize all functionality
    initCarousel();
    initFAQ();
    initDonationAmounts();
    initContactForm();
    initSmoothScrolling();
    initGalleryLightbox();
    initScrollAnimations();
    
    // Set up scroll event listeners
    window.addEventListener('scroll', () => {
        toggleScrollUpButton();
        handleHeaderScroll();
    });
    
    // Initial calls
    toggleScrollUpButton();
    handleHeaderScroll();
    
    console.log('CNDA Website initialized successfully!');
}

// ===== DOM CONTENT LOADED =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ===== WINDOW LOAD EVENT =====
window.addEventListener('load', () => {
    // Hide any loading spinners or show content
    document.body.classList.add('loaded');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}