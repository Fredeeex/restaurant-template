// ===== Helpers =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// ===== Year =====
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Mobile Nav =====
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

function closeMenu() {
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$(".nav__link", navMenu).forEach(a => a.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    const inside = navMenu.contains(e.target) || navToggle.contains(e.target);
    if (!inside) closeMenu();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

// ===== Smooth scroll with sticky header offset =====
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const header = document.querySelector(".header");
    const headerHeight = header ? header.offsetHeight : 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

// ===== Scroll progress =====
const progressBar = $("#progressBar");
function updateProgress() {
  if (!progressBar) return;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight =
    (document.documentElement.scrollHeight || document.body.scrollHeight) -
    document.documentElement.clientHeight;
  const p = scrollHeight ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${p.toFixed(2)}%`;
}
window.addEventListener("scroll", updateProgress);
window.addEventListener("resize", updateProgress);
updateProgress();

// ===== Reveal =====
const revealEls = $$(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("is-visible"));
}

// ===== Menu data =====
const MENU = {
  breakfast: [
    { name: "Saffron Eggs & Toast", price: "£9.50", desc: "Soft eggs, herb butter, toasted sourdough.", tags: ["new"] },
    { name: "Avocado Citrus Bowl", price: "£8.90", desc: "Avocado, grapefruit, seeds, green dressing.", tags: ["vegan"] },
    { name: "Stone Granola Parfait", price: "£7.20", desc: "Greek yogurt, berries, honey crunch.", tags: [] },
    { name: "Spiced Shakshuka", price: "£10.40", desc: "Tomato pepper base, baked eggs, feta.", tags: ["hot"] },
  ],
  lunch: [
    { name: "Chargrilled Chicken Wrap", price: "£11.20", desc: "Crisp salad, lemon aioli, warm flatbread.", tags: [] },
    { name: "Vegan Mezze Plate", price: "£12.00", desc: "Hummus, roasted veg, olives, pita.", tags: ["vegan"] },
    { name: "Saffron Rice & Salmon", price: "£14.90", desc: "Herb rice, glazed salmon, citrus.", tags: ["new"] },
    { name: "Hot Harissa Burger", price: "£13.80", desc: "Beef patty, harissa mayo, pickles.", tags: ["hot"] },
  ],
  dinner: [
    { name: "Steak & Chimichurri", price: "£19.90", desc: "Pan-seared steak, chimichurri, fries.", tags: [] },
    { name: "Truffle Mushroom Pasta", price: "£16.70", desc: "Cream sauce, truffle notes, parmesan.", tags: ["new"] },
    { name: "Roasted Cauliflower ‘Steak’", price: "£15.20", desc: "Tahini, herbs, crispy chickpeas.", tags: ["vegan"] },
    { name: "Spicy Prawn Skillet", price: "£18.10", desc: "Garlic prawns, chilli, toasted bread.", tags: ["hot"] },
  ],
  drinks: [
    { name: "Citrus Mint Cooler", price: "£4.80", desc: "Fresh mint, lemon, sparkling.", tags: ["new"] },
    { name: "Iced Latte", price: "£4.20", desc: "Smooth espresso, milk, ice.", tags: [] },
    { name: "House Mocktail", price: "£5.50", desc: "Seasonal fruit blend, soda.", tags: [] },
    { name: "Ginger Heat Shot", price: "£3.90", desc: "Ginger, lemon, chilli hint.", tags: ["hot"] },
  ],
};

const menuGrid = $("#menuGrid");
const tabs = $$(".tab");

function tagBadge(tag) {
  const cls = tag === "hot" ? "hot" : tag === "vegan" ? "vegan" : "new";
  const text = tag === "hot" ? "Spicy" : tag === "vegan" ? "Vegan" : "New";
  return `<span class="badge ${cls}">${text}</span>`;
}

function renderMenu(cat) {
  if (!menuGrid) return;
  const items = MENU[cat] || [];
  menuGrid.innerHTML = items.map(item => `
    <article class="dish">
      <div class="dish__top">
        <h3 class="dish__name">${item.name}</h3>
        <span class="dish__price">${item.price}</span>
      </div>
      <p class="dish__desc">${item.desc}</p>
      <div class="dish__tags">
        ${item.tags.map(tagBadge).join("")}
      </div>
    </article>
  `).join("");
}

tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(t => {
      t.classList.remove("is-active");
      t.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
    renderMenu(btn.dataset.cat);
  });
});

// default menu
renderMenu("breakfast");

// ===== Lightbox =====
const lightbox = $("#lightbox");
const lightboxClose = $("#lightboxClose");
const lightboxImg = $("#lightboxImg");
const lightboxCap = $("#lightboxCap");

function openLightbox(n) {
  if (!lightbox) return;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // change the visual slightly per shot (still no images)
  if (lightboxImg) {
    const tints = [
      "rgba(245,158,11,.35)",
      "rgba(56,189,248,.28)",
      "rgba(34,197,94,.22)",
      "rgba(245,158,11,.25)",
      "rgba(56,189,248,.22)",
      "rgba(34,197,94,.18)",
    ];
    const tint = tints[(n-1) % tints.length];
    lightboxImg.style.background =
      `radial-gradient(520px 240px at 30% 35%, ${tint}, transparent 60%),
       radial-gradient(520px 240px at 75% 55%, rgba(56,189,248,.18), transparent 60%),
       radial-gradient(520px 240px at 55% 80%, rgba(34,197,94,.14), transparent 60%),
       linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.02))`;
  }

  if (lightboxCap) lightboxCap.textContent = `Gallery preview #${n}`;
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

const shots = $$(".shot");
shots.forEach(btn => {
  btn.addEventListener("click", () => openLightbox(Number(btn.dataset.shot || "1")));
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
}

// ===== Reviews slider =====
const track = $("#reviewsTrack");
const prevBtn = $("#prevReview");
const nextBtn = $("#nextReview");

let idx = 0;
function setSlide(i) {
  if (!track) return;
  const count = track.children.length;
  idx = (i + count) % count;
  track.style.transform = `translateX(-${idx * 100}%)`;
}

if (prevBtn) prevBtn.addEventListener("click", () => setSlide(idx - 1));
if (nextBtn) nextBtn.addEventListener("click", () => setSlide(idx + 1));

// autoplay
setInterval(() => setSlide(idx + 1), 6500);

// ===== Reservation form validation (demo) =====
const reserveForm = $("#reserveForm");
const reserveNote = $("#reserveNote");

function setError(input, msg) {
  input.classList.add("input--bad");
  const err = input.closest("label")?.querySelector(".err");
  if (err) err.textContent = msg || "";
}
function clearError(input) {
  input.classList.remove("input--bad");
  const err = input.closest("label")?.querySelector(".err");
  if (err) err.textContent = "";
}

if (reserveForm) {
  reserveForm.addEventListener("input", (e) => {
    const el = e.target;
    if (el.matches("input, select, textarea")) {
      clearError(el);
      if (reserveNote) reserveNote.textContent = "";
    }
  });

  reserveForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (reserveNote) reserveNote.textContent = "";

    const name = reserveForm.elements["name"];
    const phone = reserveForm.elements["phone"];
    const date = reserveForm.elements["date"];
    const time = reserveForm.elements["time"];
    const guests = reserveForm.elements["guests"];

    let ok = true;

    if (!name.value.trim() || name.value.trim().length < 2) {
      setError(name, "Enter your name (min 2 chars).");
      ok = false;
    }
    if (!phone.value.trim() || phone.value.trim().length < 7) {
      setError(phone, "Enter a valid phone number.");
      ok = false;
    }
    if (!date.value) {
      setError(date, "Select a date.");
      ok = false;
    }
    if (!time.value) {
      setError(time, "Select a time.");
      ok = false;
    }
    if (!guests.value) {
      setError(guests, "Select number of guests.");
      ok = false;
    }

    if (!ok) {
      if (reserveNote) reserveNote.textContent = "Fix the highlighted fields and try again.";
      return;
    }

    if (reserveNote) reserveNote.textContent = "✅ Reservation captured (demo). Connect to WhatsApp/email later.";
    reserveForm.reset();
  });
}