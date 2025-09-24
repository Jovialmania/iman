// Analytics tracking
function trackLinkClick(platform) {
  console.log(`Link clicked: ${platform}`);
}

document.addEventListener("DOMContentLoaded", function() {
  // Initialize analytics tracking for links
  document.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', function() {
      const platform = this.textContent.trim();
      trackLinkClick(platform);
    });
  });

  // Link animations
  const links = document.querySelectorAll(".link");
  links.forEach((link, index) => {
    link.style.opacity = "0";
    setTimeout(() => {
      link.style.transition = "opacity 0.5s ease-in-out";
      link.style.opacity = "1";
    }, 200 * index);
  });

  // Dark mode toggle
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
  });

  // Bio toggle
  const bioToggle = document.querySelector(".bio-toggle");
  const bio = document.querySelector(".bio");
  const bioIcon = bioToggle.querySelector("i");

  bioToggle.addEventListener("click", () => {
    bio.classList.toggle("expanded");
    bioToggle.textContent = bio.classList.contains("expanded") ? "About Us" : "About Us";
    bioIcon.className = bio.classList.contains("expanded") ? "fas fa-chevron-up" : "fas fa-chevron-down";
    bioToggle.setAttribute('aria-expanded', bio.classList.contains("expanded"));
  });

  // Enhanced keyboard navigation
  const focusableElements = document.querySelectorAll('button, a');
  focusableElements.forEach(element => {
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  });

  // Add click animation to links
  links.forEach(link => {
    link.addEventListener("click", function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("div");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add('ripple-effect');
      ripple.setAttribute('role', 'presentation');

      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 1000);
    });
  });
});