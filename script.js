// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function() {
  initializeTheme();
  initializeNavigation();
  initializeSmoothScroll();
  initializeFormHandling();
  initializeAnimations();
});

// Theme Management
function initializeTheme() {
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = themeToggle.querySelector("i");

  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.dataset.theme = savedTheme;
  themeIcon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

  themeToggle.addEventListener("click", () => {
    const newTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = newTheme;
    themeIcon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    localStorage.setItem('theme', newTheme);
    
    // Track theme change
    trackEvent('theme_toggle', { theme: newTheme });
  });
}

// Navigation Management
function initializeNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    
    // Track menu toggle
    trackEvent('menu_toggle', { state: navMenu.classList.contains('active') ? 'open' : 'closed' });
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
}

// Smooth Scrolling
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('.main-header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Track navigation click
        trackEvent('navigation_click', { section: this.getAttribute('href') });
      }
    });
  });
}

// Form Handling
function initializeFormHandling() {
  const inquiryForm = document.getElementById('inquiryForm');
  
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
      };
      
      // Here you would typically send the data to your backend
      // For now, we'll simulate form submission and redirect to WhatsApp
      handleFormSubmission(formData);
    });
  }
}

function handleFormSubmission(formData) {
  // Track form submission
  trackEvent('inquiry_submitted', formData);
  
  // Create WhatsApp message
  const message = `Hello I.Man Integrated Services!%0A%0A*New Service Inquiry*%0A%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Service Needed:* ${formData.service}%0A*Message:* ${formData.message}`;
  
  // Redirect to WhatsApp
  window.open(`https://wa.me/2348123063095?text=${message}`, '_blank');
  
  // Show success message
  showNotification('Inquiry sent successfully! Redirecting to WhatsApp...', 'success');
  
  // Reset form
  document.getElementById('inquiryForm').reset();
}

// Animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        
        // Track section view
        if (entry.target.id) {
          trackEvent('section_view', { section: entry.target.id });
        }
      }
    });
  }, observerOptions);

  // Observe sections for animation
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Observe service cards
  document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });
}

// Notification System
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles if not already added
  if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--container-bg);
        color: var(--text-color);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow);
        border-left: 4px solid;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
      }
      .notification-success { border-left-color: #28a745; }
      .notification-error { border-left-color: #dc3545; }
      .notification-info { border-left-color: #007bff; }
      .notification-warning { border-left-color: #ffc107; }
      .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .notification.show { transform: translateX(0); }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  return icons[type] || 'info-circle';
}

// Analytics Tracking
function trackEvent(eventName, properties = {}) {
  // In a real implementation, you would send this to your analytics service
  console.log(`Event: ${eventName}`, properties);
  
  // Example: Send to Google Analytics (if implemented)
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', eventName, properties);
  // }
}

function trackLinkClick(platform, linkType) {
  trackEvent('link_click', {
    platform: platform,
    type: linkType,
    timestamp: new Date().toISOString()
  });
}

// Initialize link tracking
document.addEventListener('DOMContentLoaded', function() {
  // Track social media clicks
  document.querySelectorAll('a[href*="wa.me"], a[href*="facebook.com"], a[href*="google.com"]').forEach(link => {
    link.addEventListener('click', function() {
      const platform = this.href.includes('wa.me') ? 'whatsapp' : 
                      this.href.includes('facebook.com') ? 'facebook' : 'google';
      trackLinkClick(platform, 'social');
    });
  });
  
  // Track call-to-action clicks
  document.querySelectorAll('.btn, .service-card, .contact-method').forEach(element => {
    element.addEventListener('click', function() {
      const action = this.textContent.trim().substring(0, 50);
      trackLinkClick('website', action);
    });
  });
});

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});

// Add loading state for better UX
function setLoadingState(element, isLoading) {
  if (isLoading) {
    element.classList.add('loading');
    element.disabled = true;
  } else {
    element.classList.remove('loading');
    element.disabled = false;
  }
}