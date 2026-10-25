const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const themeLabel = themeToggle?.querySelector(".theme-label");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealElements = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const year = document.getElementById("year");

const setTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);

  const isDark = theme === "dark";
  if (themeIcon) themeIcon.textContent = isDark ? "☾" : "☀";
  if (themeLabel) themeLabel.textContent = isDark ? "Dark" : "Light";
  if (themeToggle) themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
};

const savedTheme = localStorage.getItem("portfolio-theme");
setTheme(savedTheme || "dark");

themeToggle?.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme");
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

const closeMenu = () => {
  navMenu?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  document.body.classList.toggle("nav-open", Boolean(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
    window.setTimeout(setActiveLink, 360);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const sections = [...document.querySelectorAll("main section[id]")];
const setActiveLink = () => {
  const scrollPosition = window.scrollY + 130;
  let currentSection = sections[0]?.id;

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    currentSection = sections[sections.length - 1]?.id;
  }

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("active", isActive);
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("load", setActiveLink);

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = encodeURIComponent(formData.get("name") || "");
  const email = encodeURIComponent(formData.get("email") || "");
  const subject = encodeURIComponent(formData.get("subject") || "Portfolio inquiry");
  const message = encodeURIComponent(formData.get("message") || "");

  const mailto = `mailto:hisham.essam.saad@gmail.com?subject=${subject}&body=Name:%20${name}%0AEmail:%20${email}%0A%0A${message}`;

  if (formStatus) {
    formStatus.textContent = "Opening your email app with a prepared draft.";
  }

  window.location.href = mailto;
});

if (year) {
  year.textContent = new Date().getFullYear();
}
