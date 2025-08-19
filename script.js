// ===== GLOBAL VARIABLES =====
let currentLanguage = 'en';
let currentSlide = 0;
let carouselInterval;
let currentGalleryPage = 1;
let galleryItemsPerPage = 12;
let currentFilter = 'all';

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

// ===== GALLERY FUNCTIONALITY =====
function initGallery() {
    const filterBtns = document.querySelectorAll('.gallery__filter-btn');
    const galleryItems = document.querySelectorAll('.gallery__item');
    const galleryGrid = document.getElementById('gallery-grid');
    const paginationNumbers = document.getElementById('gallery-numbers');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const loadMoreBtn = document.getElementById('gallery-load-more');
    
    // All gallery items data (simulate more items)
    const allGalleryItems = [
        { category: 'events', title: 'Community Meeting', date: '2016', src: '/assets/gallery/food.jpg' },
        { category: 'support', title: 'Food Distribution', date: '2017', src: '/assets/gallery/food2024.jpg' },
        { category: 'healthcare', title: 'Healthcare Support', date: '2015', src: '/assets/gallery/kid.jpg' },
        { category: 'community', title: 'Community Celebration', date: '2023', src: 'assets/gallery/chris 2017.jpg '},
        { category: 'support', title: 'Youth Training', date: '2023', src: '/images/gallery-5.jpg' },
        { category: 'events', title: 'Certificate Ceremony', date: '2023', src: '/images/gallery-6.jpg' },
        { category: 'community', title: 'Volunteer Activities', date: '2022', src: '/images/gallery-7.jpg' },
        { category: 'support', title: 'Elderly Care', date: '2022', src: '/images/gallery-8.jpg' },
        { category: 'community', title: 'Community Outreach', date: '2017', src: '/assets/img/newyear2017.jpg' },
        { category: 'events', title: 'Holiday Celebration', date: '2022', src: '/images/gallery-10.jpg' },
        { category: 'support', title: 'Food Distribution', date: '2017', src: '/assets/img/newyear2017(2).jpg' },
        { category: 'healthcare', title: 'Medical Care Access', date: '2022', src: '/images/gallery-11.jpg' },
        { category: 'community', title: 'Facility Management', date: '2021', src: '/images/gallery-12.jpg' },
        { category: 'events', title: 'Annual Gathering', date: '2021', src: '/images/gallery-13.jpg' },
        { category: 'support', title: 'Emergency Aid', date: '2021', src: '/images/gallery-14.jpg' },
        { category: 'healthcare', title: 'Health Checkup', date: '2021', src: '/images/gallery-15.jpg' },
        { category: 'community', title: 'Cultural Event', date: '2021', src: '/images/gallery-16.jpg' },
        { category: 'support', title: 'Skills Training', date: '2020', src: '/images/gallery-17.jpg' },
        { category: 'events', title: 'Fundraising Event', date: '2020', src: '/images/gallery-18.jpg' },
        { category: 'community', title: 'Neighborhood Clean-up', date: '2020', src: '/images/gallery-19.jpg' },
        { category: 'healthcare', title: 'Mobile Clinic', date: '2020', src: '/images/gallery-20.jpg' },
             { category: 'support', title: 'Food Distribution', date: '2017', src: '/assets/img/newyear2017(1).jpg' },
        { category: 'support', title: 'Educational Support', date: '2020', src: '/images/gallery-21.jpg' },
        { category: 'events', title: 'Recognition Ceremony', date: '2019', src: '/images/gallery-22.jpg' },
        { category: 'community', title: 'Community Garden', date: '2019', src: '/images/gallery-23.jpg' },
        { category: 'support', title: 'Winter Support', date: '2019', src: '/images/gallery-24.jpg' }
    ];
    
    function getFilteredItems() {
        return currentFilter === 'all' 
            ? allGalleryItems 
            : allGalleryItems.filter(item => item.category === currentFilter);
    }
    
    function renderGalleryItems(items, page = 1) {
        const startIndex = (page - 1) * galleryItemsPerPage;
        const endIndex = startIndex + galleryItemsPerPage;
        const itemsToShow = items.slice(startIndex, endIndex);
        
        if (galleryGrid) {
            galleryGrid.innerHTML = itemsToShow.map(item => `
                <div class="gallery__item" data-category="${item.category}">
                    <img src="${item.src}" alt="${item.title}" class="gallery__img">
                    <div class="gallery__overlay">
                        <h4 class="gallery__title">${item.title}</h4>
                        <p class="gallery__date">${item.date}</p>
                    </div>
                </div>
            `).join('');
            
            // Re-initialize lightbox for new items
            initGalleryLightbox();
        }
    }
    
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / galleryItemsPerPage);
        
        if (paginationNumbers) {
            paginationNumbers.innerHTML = '';
            for (let i = 1; i <= Math.min(totalPages, 5); i++) {
                const btn = document.createElement('button');
                btn.className = `gallery__pagination-number ${i === currentGalleryPage ? 'gallery__pagination-number--active' : ''}`;
                btn.setAttribute('data-page', i);
                btn.textContent = i;
                btn.addEventListener('click', () => {
                    currentGalleryPage = i;
                    const filteredItems = getFilteredItems();
                    renderGalleryItems(filteredItems, currentGalleryPage);
                    updatePagination(filteredItems.length);
                });
                paginationNumbers.appendChild(btn);
            }
        }
        
        // Update prev/next buttons
        if (prevBtn) {
            prevBtn.disabled = currentGalleryPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = currentGalleryPage === totalPages;
        }
    }
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('gallery__filter-btn--active'));
            btn.classList.add('gallery__filter-btn--active');
            
            // Update current filter
            currentFilter = btn.getAttribute('data-filter');
            currentGalleryPage = 1;
            
            // Render filtered items
            const filteredItems = getFilteredItems();
            renderGalleryItems(filteredItems, currentGalleryPage);
            updatePagination(filteredItems.length);
        });
    });
    
    // Pagination navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentGalleryPage > 1) {
                currentGalleryPage--;
                const filteredItems = getFilteredItems();
                renderGalleryItems(filteredItems, currentGalleryPage);
                updatePagination(filteredItems.length);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const filteredItems = getFilteredItems();
            const totalPages = Math.ceil(filteredItems.length / galleryItemsPerPage);
            if (currentGalleryPage < totalPages) {
                currentGalleryPage++;
                renderGalleryItems(filteredItems, currentGalleryPage);
                updatePagination(filteredItems.length);
            }
        });
    }
    
    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            galleryItemsPerPage += 12;
            const filteredItems = getFilteredItems();
            renderGalleryItems(filteredItems, 1);
            updatePagination(filteredItems.length);
            
            // Hide load more if all items are shown
            if (galleryItemsPerPage >= filteredItems.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
    
    // Initial render
    const filteredItems = getFilteredItems();
    renderGalleryItems(filteredItems, currentGalleryPage);
    updatePagination(filteredItems.length);
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
        .testimonial-card,
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

// ===== TESTIMONIALS CAROUSEL (Optional Enhancement) =====
function initTestimonialsCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (testimonialCards.length > 3) {
        // Add carousel functionality for testimonials if there are more than 3
        // This is optional and can be implemented if needed
    }
}

// ===== CERTIFICATE MODAL VIEWER =====
function initCertificateViewer() {
    const viewBtns = document.querySelectorAll('.certification-card__view-btn');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.certification-card');
            const img = card.querySelector('.certification-card__img');
            const title = card.querySelector('.certification-card__title').textContent;
            
            // Create modal for certificate viewing
            const modal = document.createElement('div');
            modal.className = 'certificate-modal';
            modal.innerHTML = `
                <div class="certificate-modal__content">
                    <div class="certificate-modal__header">
                        <h3>${title}</h3>
                        <button class="certificate-modal__close">&times;</button>
                    </div>
                    <div class="certificate-modal__body">
                        <img src="${img.src}" alt="${title}" class="certificate-modal__image">
                    </div>
                </div>
            `;
            
            // Add styles
            modal.style.cssText = `
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
            
            const content = modal.querySelector('.certificate-modal__content');
            content.style.cssText = `
                background: white;
                border-radius: 12px;
                max-width: 90%;
                max-height: 90%;
                overflow: hidden;
                position: relative;
            `;
            
            const header = modal.querySelector('.certificate-modal__header');
            header.style.cssText = `
                padding: 20px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            const closeBtn = modal.querySelector('.certificate-modal__close');
            closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6b7280;
            `;
            
            const body = modal.querySelector('.certificate-modal__body');
            body.style.cssText = `
                padding: 20px;
                text-align: center;
            `;
            
            const image = modal.querySelector('.certificate-modal__image');
            image.style.cssText = `
                max-width: 100%;
                max-height: 70vh;
                object-fit: contain;
            `;
            
            // Add to DOM
            document.body.appendChild(modal);
            
            // Show modal
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
            
            // Close modal function
            function closeModal() {
                modal.style.opacity = '0';
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                }, 300);
            }
            
            // Event listeners
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // ESC key to close
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        });
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
    initGallery();
    initFAQ();
    initDonationAmounts();
    initContactForm();
    initSmoothScrolling();
    initGalleryLightbox();
    initScrollAnimations();
    initTestimonialsCarousel();
    initCertificateViewer();
    
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

