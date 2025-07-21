// CNDA Charity Website JavaScript
// Modern ES6+ JavaScript with accessibility and performance optimizations

class CNDAWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupLazyLoading();
    this.setupSmoothScrolling();
    this.setupFormHandling();
    this.setupFAQ();
    this.setupDonationAmounts();
    this.setupBackToTop();
    this.setupMobileMenu();
  }

  setupEventListeners() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', () => {
      console.log('CNDA Website initialized');
    });

    // Handle window resize
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    // Handle scroll events
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 16));
  }

  setupIntersectionObserver() {
    // Animate elements when they come into view
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements that should animate in
    const animateElements = document.querySelectorAll(
      '.program-card, .story-card, .stat, .gallery__item'
    );
    
    animateElements.forEach(el => {
      observer.observe(el);
    });
  }

  setupLazyLoading() {
    // Native lazy loading fallback for older browsers
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        img.src = img.dataset.src || img.src;
      });
    } else {
      // Fallback for browsers that don't support native lazy loading
      const lazyImages = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

  setupSmoothScrolling() {
    // Enhanced smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without triggering scroll
          history.pushState(null, null, targetId);
          
          // Close mobile menu if open
          this.closeMobileMenu();
        }
      });
    });
  }

  setupFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactForm(contactForm);
      });

      // Real-time validation
      const inputs = contactForm.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
    }
  }

  handleContactForm(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual backend integration)
    setTimeout(() => {
      this.showNotification('Thank you! Your message has been sent successfully.', 'success');
      form.reset();
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);

    // In a real implementation, you would send the data to your backend:
    /*
    fetch('/api/contact', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.showNotification('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
      } else {
        this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
      }
    })
    .catch(error => {
      this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
    */
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    this.clearFieldError(field);

    // Validation rules
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    
    // Insert error message after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq__question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        const answer = question.nextElementSibling;
        
        // Close all other FAQ items
        faqQuestions.forEach(otherQuestion => {
          if (otherQuestion !== question) {
            otherQuestion.setAttribute('aria-expanded', 'false');
            const otherAnswer = otherQuestion.nextElementSibling;
            otherAnswer.classList.remove('active');
          }
        });
        
        // Toggle current FAQ item
        question.setAttribute('aria-expanded', !isExpanded);
        answer.classList.toggle('active');
        
        // Scroll to question if opening
        if (!isExpanded) {
          setTimeout(() => {
            question.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }, 300);
        }
      });
    });
  }

  setupDonationAmounts() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customInput = document.querySelector('.donation__custom-input');
    
    amountButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        amountButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Clear custom input
        if (customInput) {
          customInput.value = '';
        }
        
        // Store selected amount (for future payment processing)
        const amount = button.dataset.amount;
        this.selectedDonationAmount = amount;
        
        console.log(`Selected donation amount: $${amount}`);
      });
    });
    
    if (customInput) {
      customInput.addEventListener('input', () => {
        // Remove active class from all preset buttons
        amountButtons.forEach(btn => btn.classList.remove('active'));
        
        // Store custom amount
        this.selectedDonationAmount = customInput.value;
      });
    }
  }

  setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  setupMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        navClose.focus();
      });
    }
    
    if (navClose) {
      navClose.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu && navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
          this.closeMobileMenu();
        }
      }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
  }

  closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu) {
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
      
      // Return focus to toggle button
      if (navToggle) {
        navToggle.focus();
      }
    }
  }

  handleScroll() {
    const scrollY = window.scrollY;
    const header = document.querySelector('.header');
    const backToTopButton = document.getElementById('back-to-top');
    
    // Header scroll effect
    if (header) {
      if (scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    
    // Back to top button visibility
    if (backToTopButton) {
      if (scrollY > 500) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    }
    
    // Update active navigation link
    this.updateActiveNavLink();
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  handleResize() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    notification.innerHTML = `
      <span class="notification__message">${message}</span>
      <button class="notification__close" aria-label="Close notification">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    const autoHideTimer = setTimeout(() => {
      this.hideNotification(notification);
    }, 5000);
    
    // Manual close
    const closeButton = notification.querySelector('.notification__close');
    closeButton.addEventListener('click', () => {
      clearTimeout(autoHideTimer);
      this.hideNotification(notification);
    });
  }

  hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // Utility functions
  debounce(func, wait) {
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

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// Initialize the website
const cndaWebsite = new CNDAWebsite();

// Additional CSS for animations and notifications (to be added to style.css)
const additionalStyles = `
/* Animation styles */
.program-card,
.story-card,
.stat,
.gallery__item {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;
}

.program-card.animate-in,
.story-card.animate-in,
.stat.animate-in,
.gallery__item.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Header scroll effect */
.header.scrolled {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-md);
}

/* Form error styles */
.form__input.error,
.form__textarea.error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.field-error {
  color: #ef4444;
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-1);
  display: block;
}

/* Notification styles */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 400px;
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: 10000;
  transform: translateX(100%);
  transition: transform var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
}

.notification.show {
  transform: translateX(0);
}

.notification--success {
  background-color: #10b981;
  color: white;
}

.notification--error {
  background-color: #ef4444;
  color: white;
}

.notification--info {
  background-color: var(--color-primary);
  color: white;
}

.notification__close {
  background: none;
  border: none;
  color: inherit;
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color var(--transition-fast);
}

.notification__close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Active navigation link */
.nav__link.active {
  color: var(--color-primary);
}

.nav__link.active::after {
  width: 100%;
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);