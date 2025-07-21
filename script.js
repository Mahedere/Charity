class CNDAWebsite {
    constructor() {
        this.currentLanguage = 'en';
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupMobileNavigation();
        this.setupLanguageToggle();
        this.setupSmoothScroll();
        this.setupScrollEffects();
        this.setupForms();
        this.setupFAQ();
        this.setupScrollUp();
        this.setupDonationButtons();
        this.initializeLanguage();
    }

    setupMobileNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navClose = document.getElementById('nav-close');
        const navLinks = document.querySelectorAll('.nav__link');

        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        if (navClose) {
            navClose.addEventListener('click', () => this.closeMobileMenu());
        }

        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        document.addEventListener('click', (e) => {
            if (navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const body = document.body;

        if (navMenu) {
            this.isMenuOpen = !this.isMenuOpen;
            
            if (this.isMenuOpen) {
                navMenu.classList.add('nav__menu--active');
                body.style.overflow = 'hidden';
            } else {
                navMenu.classList.remove('nav__menu--active');
                body.style.overflow = '';
            }
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const body = document.body;

        if (navMenu) {
            this.isMenuOpen = false;
            navMenu.classList.remove('nav__menu--active');
            body.style.overflow = '';
        }
    }

    setupLanguageToggle() {
        const languageToggleMobile = document.getElementById('language-toggle-mobile');
        const languageToggleDesktop = document.getElementById('language-toggle-desktop');

        if (languageToggleMobile) {
            languageToggleMobile.addEventListener('click', () => this.toggleLanguage());
        }

        if (languageToggleDesktop) {
            languageToggleDesktop.addEventListener('click', () => this.toggleLanguage());
        }
    }

    initializeLanguage() {
        const savedLanguage = localStorage.getItem('cnda-language') || 'en';
        this.setLanguage(savedLanguage);
    }

    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'en' ? 'am' : 'en';
        this.setLanguage(newLanguage);
        localStorage.setItem('cnda-language', newLanguage);
    }

    setLanguage(language) {
        this.currentLanguage = language;
        document.documentElement.setAttribute('data-lang', language);
        document.documentElement.setAttribute('lang', language === 'am' ? 'am' : 'en');

        const elementsWithLangData = document.querySelectorAll('[data-en], [data-am]');
        
        elementsWithLangData.forEach(element => {
            const englishText = element.getAttribute('data-en');
            const amharicText = element.getAttribute('data-am');
            
            if (language === 'en' && englishText) {
                element.textContent = englishText;
            } else if (language === 'am' && amharicText) {
                element.textContent = amharicText;
            }
        });

        this.updateLanguageToggleButtons(language);
        this.updateFormPlaceholders(language);
    }

    updateLanguageToggleButtons(language) {
        const toggleButtons = document.querySelectorAll('.language-toggle__text');
        const newText = language === 'en' ? 'አማ' : 'EN';
        
        toggleButtons.forEach(button => {
            button.textContent = newText;
        });
    }

    updateFormPlaceholders(language) {
        const placeholders = {
            en: {
                name: 'Your Name',
                email: 'Your Email',
                subject: 'Subject',
                message: 'Your Message',
                customAmount: 'Custom amount'
            },
            am: {
                name: 'የእርስዎ ስም',
                email: 'የእርስዎ ኢሜይል',
                subject: 'ርዕስ',
                message: 'የእርስዎ መልእክት',
                customAmount: 'የተለየ መጠን'
            }
        };

        const inputs = [
            { selector: 'input[name="name"]', key: 'name' },
            { selector: 'input[name="email"]', key: 'email' },
            { selector: 'input[name="subject"]', key: 'subject' },
            { selector: 'textarea[name="message"]', key: 'message' },
            { selector: '.donation__custom-input', key: 'customAmount' }
        ];

        inputs.forEach(input => {
            const element = document.querySelector(input.selector);
            if (element && placeholders[language][input.key]) {
                element.placeholder = placeholders[language][input.key];
            }
        });
    }

    setupSmoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => this.handleScroll());
        
        if ('IntersectionObserver' in window) {
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

            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(section);
            });
        }
    }

    setupForms() {
        this.setupContactForm();
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmission(contactForm);
            });
        }
    }

    handleContactFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (!submitButton) return;

        const originalText = submitButton.textContent;
        const loadingText = this.currentLanguage === 'en' ? 'Sending...' : 'እየላካል...';
        
        submitButton.textContent = loadingText;
        submitButton.disabled = true;
        
        setTimeout(() => {
            const successMessage = this.currentLanguage === 'en' 
                ? 'Thank you! Your message has been sent successfully.'
                : 'አመሰግናለሁ! መልእክትዎ በተሳካ ሁኔታ ተልኳል።';
            
            this.showNotification(successMessage, 'success');
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }

    setupFAQ() {
        const faqQuestions = document.querySelectorAll('.faq__question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.closest('.faq__item');
                const answer = faqItem.querySelector('.faq__answer');
                const icon = question.querySelector('.faq__icon');
                const isOpen = question.getAttribute('aria-expanded') === 'true';
                
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== question) {
                        const otherItem = otherQuestion.closest('.faq__item');
                        const otherAnswer = otherItem.querySelector('.faq__answer');
                        const otherIcon = otherQuestion.querySelector('.faq__icon');
                        
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        otherAnswer.style.maxHeight = '0';
                        otherIcon.textContent = '+';
                        otherItem.classList.remove('faq__item--active');
                    }
                });
                
                if (isOpen) {
                    question.setAttribute('aria-expanded', 'false');
                    answer.style.maxHeight = '0';
                    icon.textContent = '+';
                    faqItem.classList.remove('faq__item--active');
                } else {
                    question.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    icon.textContent = '−';
                    faqItem.classList.add('faq__item--active');
                }
            });
        });
    }

    setupScrollUp() {
        const scrollUpButton = document.getElementById('scroll-up');
        
        if (scrollUpButton) {
            scrollUpButton.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    setupDonationButtons() {
        const amountButtons = document.querySelectorAll('.amount-btn');
        const customAmountInput = document.querySelector('.donation__custom-input');

        amountButtons.forEach(button => {
            button.addEventListener('click', () => {
                amountButtons.forEach(btn => btn.classList.remove('amount-btn--active'));
                button.classList.add('amount-btn--active');
                
                if (customAmountInput) {
                    customAmountInput.value = '';
                }
            });
        });

        if (customAmountInput) {
            customAmountInput.addEventListener('input', () => {
                amountButtons.forEach(btn => btn.classList.remove('amount-btn--active'));
            });
        }
    }

    showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('notification--visible');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('notification--visible');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    handleScroll() {
        const header = document.querySelector('.header');
        const scrollUpButton = document.getElementById('scroll-up');
        const scrollY = window.scrollY;

        if (header) {
            if (scrollY > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = '#ffffff';
                header.style.backdropFilter = 'none';
            }
        }

        if (scrollUpButton) {
            if (scrollY > 500) {
                scrollUpButton.classList.add('scrollup--show');
            } else {
                scrollUpButton.classList.remove('scrollup--show');
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CNDAWebsite();
});

window.addEventListener('load', () => {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.style.display = 'none';
    });
});