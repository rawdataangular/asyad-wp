document.addEventListener("DOMContentLoaded", () => {
  // Reveal animations on scroll
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll(".section, .hero-content");
  sections.forEach((section) => {
    section.classList.add("hidden");
    observer.observe(section);
  });
});
