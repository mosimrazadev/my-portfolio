  document.addEventListener('DOMContentLoaded', () => {

// ===== NAVBAR ACTIVE LINK + MOBILE MENU =====

const navLinks = document.querySelectorAll(".nav-link");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navLinks");
const menuIcon = menuToggle.querySelector("i");

// ===== TOGGLE MENU =====

menuToggle.addEventListener("click", (e) => {

  e.stopPropagation();

  navMenu.classList.toggle("active");

  // Change icon
  if (navMenu.classList.contains("active")) {

    menuIcon.classList.remove("ri-menu-line");
    menuIcon.classList.add("ri-close-line");
    

  } else {

    menuIcon.classList.remove("ri-close-line");
    menuIcon.classList.add("ri-menu-line");

  }

});

// ===== CLOSE MENU WHEN CLICK NAV LINK =====

navLinks.forEach(link => {

  link.addEventListener("click", () => {

    navLinks.forEach(nav => nav.classList.remove("active"));
    link.classList.add("active");

    navMenu.classList.remove("active");

    menuIcon.classList.remove("ri-close-line");
    menuIcon.classList.add("ri-menu-line");

  });

});

// ===== CLOSE WHEN CLICK OUTSIDE =====

document.addEventListener("click", (e) => {

  const clickedInsideMenu = navMenu.contains(e.target);
  const clickedMenuBtn = menuToggle.contains(e.target);

  if (!clickedInsideMenu && !clickedMenuBtn) {

    navMenu.classList.remove("active");

    menuIcon.classList.remove("ri-close-line");
    menuIcon.classList.add("ri-menu-line");

  }

});

// ===== CLOSE MENU ON SCROLL =====

window.addEventListener("scroll", () => {

  navMenu.classList.remove("active");

  menuIcon.classList.remove("ri-close-line");
  menuIcon.classList.add("ri-menu-line");

});

    // === Load HTML sections dynamically ===
    const sections = [
      { id: "about-section", file: "about" },
      { id: "skills-section", file: "skills" },
      { id: "projects-section", file: "projects" },
      { id: "contact-section", file: "contact" },
      { id: "footer-section", file: "footer" },
    ];

    sections.forEach(({ id, file }) => {
      const container = document.getElementById(id);
      fetch(`pages/${file}.html`)
        .then((res) => {
          if (!res.ok) throw new Error(`${file}.html not found`);
          return res.text();
        })
        .then((html) => {
          container.innerHTML = html;

          // Initialize logic after content loads
          if (file === 'about') initReadMoreToggle();
          if (file === 'skills') initSkillBars();
          if (file === 'projects') initProjectSlider();
          if (file === 'contact') {
            import('/js/form.js')
              .then(module => {
                module.initContactForm();  // call the exported function
              })
              .catch(err => {
                console.error("Failed to load form.js", err);
              });
          }                       
          
        })
        .catch((err) => {
          console.error(err);
          container.innerHTML = `<p style="color:red;">Failed to load ${file}.html</p>`;
        });
    });

    // === Dark Mode Toggle ===
    const toggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');

    const setIcon = (theme) => {
      moonIcon.style.display = theme === 'dark' ? 'none' : 'inline-block';
      sunIcon.style.display = theme === 'dark' ? 'inline-block' : 'none';
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      body.classList.add('dark');
      setIcon('dark');
    } else {
      setIcon('light');
    }

    toggle.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      setIcon(isDark ? 'dark' : 'light');
    });

    // === Typing Effect ===
    const typing = document.getElementById('typing');
    const roles = ["Full Stack Developer", "Web Developer", "React.js Developer", "Software Engineer"];
    let index = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
      const current = roles[index];
      if (deleting) {
        typing.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) {
          deleting = false;
          index = (index + 1) % roles.length;
          setTimeout(typeEffect, 500);
        } else {
          setTimeout(typeEffect, 50);
        }
      } else {
        typing.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(typeEffect, 1000);
        } else {
          setTimeout(typeEffect, 100);
        }
      }
    }

    if (typing) typeEffect();

// === Read More Toggle ===
function initReadMoreToggle() {

  const moreContent = document.getElementById('moreContent');
  const readMoreBtn = document.getElementById('readMoreBtn');
  const aboutContainer = document.querySelector('.about.container');
  const aboutSection = document.getElementById('about');

  if (!moreContent || !readMoreBtn || !aboutContainer) return;

  readMoreBtn.addEventListener('click', () => {

    moreContent.classList.toggle('expanded');
    aboutContainer.classList.toggle('expanded-layout');

    if (moreContent.classList.contains('expanded')) {

      readMoreBtn.textContent = "Read Less";

    } else {

      readMoreBtn.textContent = "Read More";

      // Scroll back to About section smoothly
setTimeout(() => {

  const navbarOffset = 100;

  const top =
    aboutSection.offsetTop - navbarOffset;

  window.scrollTo({
    top,
    behavior: "smooth"
  });

}, 450);

    }

  });

}


// === Skills Bar Animation ===
function initSkillBars() {
  const skillSpans = document.querySelectorAll(".bar span");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute("data-width");

        bar.style.width = width;

        observer.unobserve(bar);
      }
    });
  }, {
    threshold: 0.5
  });

  skillSpans.forEach((bar) => {
    bar.style.width = "0";
    observer.observe(bar);
  });
}



// ===== INFINITE PROJECT SLIDER =====

function initProjectSlider() {

  const container = document.querySelector(".projects-container");

  const prevBtn = document.getElementById("scrollLeft");
  const nextBtn = document.getElementById("scrollRight");

  if (!container || !prevBtn || !nextBtn) return;

  // Duplicate cards
  // Prevent multiple duplication
if (!container.dataset.cloned) {

  const cards = [...container.children];

  // Duplicate 4 times
  for (let i = 0; i < 4; i++) {

    cards.forEach(card => {

      const clone = card.cloneNode(true);

      clone.classList.add("cloned-card");

      container.appendChild(clone);

    });

  }

  container.dataset.cloned = "true";

}

  let animationFrame;
  let speed = 1;



  // Pause on Hover
  container.addEventListener("mouseenter", () => {

    cancelAnimationFrame(animationFrame);

  });

  container.addEventListener("mouseleave", () => {

    autoScroll();

  });

let isInteracting = false;

// Buttons
nextBtn.addEventListener("click", () => {

  isInteracting = true;

  container.scrollBy({
    left: 380,
    behavior: "smooth"
  });

  setTimeout(() => {
    isInteracting = false;
  }, 700);

});

prevBtn.addEventListener("click", () => {

  isInteracting = true;

  container.scrollBy({
    left: -380,
    behavior: "smooth"
  });

  setTimeout(() => {
    isInteracting = false;
  }, 700);

});

  // Smooth Infinite Scroll
function autoScroll() {

  if (!isInteracting) {

    container.scrollLeft += speed;

    if (container.scrollLeft >= container.scrollWidth / 2) {

      container.scrollLeft = 0;

    }

  }

  animationFrame = requestAnimationFrame(autoScroll);

}

  autoScroll();

}
    
  });
