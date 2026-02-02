const heroText = document.getElementById("heroText");

const bg = document.getElementById("backgroundImage");
const overlay = document.getElementById("backgroundOverlay");

const portfolio = document.getElementById("portfolio");
const about = document.getElementById("aboutMe");
const contact = document.getElementById("contact");

const burgerMenu = document.getElementById('burgerMenu');
const navElements = document.getElementById('navElements');

burgerMenu.addEventListener('click', () => {
  burgerMenu.classList.toggle('open');
  navElements.classList.toggle('open');
});

const clamp = (v, min = 0, max = 1) => Math.min(Math.max(v, min), max);

const heroObserver = new IntersectionObserver(
  ([entry]) => {
    heroText.classList.toggle("is-visible", entry.isIntersecting);
  },
  { threshold: 0.6 },
);

const heroSection = document.getElementById("hero");
heroObserver.observe(heroSection);

/* On Appear Effect */
window.addEventListener('DOMContentLoaded', () => {
  const heroText = document.getElementById('heroText');
  setTimeout(() => {
    heroText.classList.add('loaded');
  }, 100);
});

/* Scroll Effect */
window.addEventListener("scroll", () => {
  const vh = window.innerHeight;
  const viewportCenter = vh / 2;

  /* ================= MASTER PROGRESS (PORTFOLIO) ================= */

  const portfolioRect = portfolio.getBoundingClientRect();
  const portfolioCenter = portfolioRect.top + portfolioRect.height / 8;

  let masterProgress = (vh - portfolioCenter) / (vh / 2);
  masterProgress = clamp(masterProgress);

  /* ================= HERO TEXT ================= */

  const heroMaxBlur = 20;
  heroText.style.opacity = 1 - masterProgress;
  heroText.style.filter = `blur(${heroMaxBlur * masterProgress}px)`;

  /* ================= BACKGROUND BLUR ================= */

  const bgMaxBlur = 24;
  bg.style.filter = `blur(${bgMaxBlur * masterProgress}px)`;

  /* ================= ABOUT → SMOOTH UNBLUR ================= */

  const aboutRect = about.getBoundingClientRect();
  const aboutTriggerStart = viewportCenter + 200;
  const aboutTriggerEnd = viewportCenter - 50;

  let aboutProgress =
    (aboutRect.top - aboutTriggerEnd) / (aboutTriggerStart - aboutTriggerEnd);

  aboutProgress = clamp(aboutProgress);

  const effectiveBlur = bgMaxBlur * masterProgress * aboutProgress;
  bg.style.filter = `blur(${effectiveBlur}px)`;

  /* ================= ABOUT → MOBILE OVERLAY (NEU) ================= */
  
  // Nur für Mobile (max-width: 768px)
  if (window.innerWidth <= 768) {
    const aboutOverlay = document.getElementById('backgroundOverlayAbout');
    
    const aboutOverlayTriggerStart = viewportCenter + 200;
    const aboutOverlayTriggerEnd = viewportCenter - 100;

    let aboutOverlayRawProgress =
      (aboutOverlayTriggerStart - aboutRect.top) / 
      (aboutOverlayTriggerStart - aboutOverlayTriggerEnd);

    aboutOverlayRawProgress = clamp(aboutOverlayRawProgress);

    // Smooth transition
    aboutOverlayProgress += (aboutOverlayRawProgress - aboutOverlayProgress) * 0.12;

    aboutOverlay.style.background = `rgba(0, 0, 0, ${0.75 * aboutOverlayProgress})`;
  }

  /* ================= CONTACT → OVERLAY (SMOOTH LOCK + RELEASE) ================= */

  const contactRect = contact.getBoundingClientRect();
  const triggerStart = viewportCenter + 250;
  const triggerEnd = viewportCenter - 80;

  let rawProgress =
    (triggerStart - contactRect.top) / (triggerStart - triggerEnd);

  rawProgress = clamp(rawProgress);

  const scrollingDown = window.scrollY > lastScrollY;

  if (scrollingDown) {
    contactOverlayProgress = Math.max(contactOverlayProgress, rawProgress);
  } else {
    contactOverlayProgress += (rawProgress - contactOverlayProgress) * 0.12;
  }

  overlay.style.background = `rgba(0,0,0,${0.75 * contactOverlayProgress})`;

  lastScrollY = window.scrollY;
});

let contactOverlayProgress = 0;
let aboutOverlayProgress = 0; // ← NEU
let lastScrollY = window.scrollY;

// Portfolio-JSON-KOPPLUNG //

// Product Design Banner

async function loadProduct() {
  const res = await fetch("about.json");
  const data = await res.json();

  const productContainer = document.getElementById("productWrapper");

  data.productCards.forEach((item) => {
    const productBlock = document.createElement("article");
    productBlock.className = "product-block";

    productBlock.innerHTML = `
      <div> <img src=${item.imageurl}></div>
      <h4>${item.heading}</h4>
    `;


    productContainer.appendChild(productBlock);
  });

  observeAboutBlocks();
}

loadProduct();

// Graphic / Brand Design Banner

async function loadGraphic() {
  const res = await fetch("about.json");
  const data = await res.json();

  const graphicContainer = document.getElementById("graphicWrapper");

  data.graphicCards.forEach((item) => {
    const graphicBlock = document.createElement("article");
    graphicBlock.className = "graphic-block";

    graphicBlock.innerHTML = `
      <div> <img src=${item.imageurl}></div>
      <h4>${item.heading}</h4>
    `;

    graphicContainer.appendChild(graphicBlock);
  });

  observeAboutBlocks();
}

loadGraphic();


// ABOUT ME-JSON-KOPPLUNG //

async function loadAbout() {
  const res = await fetch("about.json");
  const data = await res.json();

  const aboutContainer = document.getElementById("aboutContent");

  data.aboutMeItems.forEach((item) => {
    const block = document.createElement("article");
    block.className = "about-block";

    block.innerHTML = `
      <h3>${item.emoji} ${item.heading}</h3>
      <p>${item.text}</p>
    `;

    aboutContainer.appendChild(block);
  });

  observeAboutBlocks();
}

loadAbout();

// IntersectionObserver //

function observeAboutBlocks() {
  const blocks = document.querySelectorAll(".about-block");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        } else {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      // root: null,
      // rootMargin: "-120px 0px -120px 0px", // 👈 NAVBAR-KOMPENSATION
      // threshold: 0.15,
    },
  );

  blocks.forEach((block) => observer.observe(block));
}
