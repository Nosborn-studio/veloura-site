async function loadComponent(name){

  try{

    const response = await fetch(`./components/${name}.html?v=${Date.now()}`);

    if(!response.ok){
      console.warn(`Component not found: ${name}`);
      return;
    }

    const html = await response.text();

    const element = document.querySelector(`[data-component="${name}"]`);

    if(element){
      element.innerHTML = html;
    }

  }catch(error){

    console.error(`Error loading component: ${name}`, error);

  }

}

const components = [
  "loader",
  "navbar",
  "hero",
  "marquee",
  "cinematic-transition",
  "menu",
  "tasting-menu",
  "wine-pairing",
  "cinematic-gallery",
  "experience",
  "signature",
  "chef",
  "awards",
  "gallery",
  "editorial",
  "social-proof",
  "testimonials",
  "reservation-flow",
  "private-events",
  "reservations",
  "location",
  "faq",
  "final-cinematic-cta",
  "footer"
];

async function initComponents(){

  for(const component of components){
    await loadComponent(component);
  }

  initApp();

}

const translations = {

  es:{
    heroBadge:"Fine Dining Experience",
    heroTitle:"Fine Dining<br><em>Reimagined.</em>",
    heroText:"Una experiencia gastronómica premium donde el diseño, la cocina de autor y la atmósfera cinematográfica se combinan para crear noches imposibles de olvidar.",
    heroCta:"Reservar experiencia",
    heroMenu:"Ver menú"
  },

  en:{
    heroBadge:"Fine Dining Experience",
    heroTitle:"Fine Dining<br><em>Reimagined.</em>",
    heroText:"A premium dining experience where design, signature cuisine and cinematic atmosphere combine to create unforgettable nights.",
    heroCta:"Book experience",
    heroMenu:"View menu"
  }

};

function setLang(lang){

  localStorage.setItem("lang", lang);

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {

    const key = el.getAttribute("data-i18n");

    if(translations[lang]?.[key]){
      el.innerHTML = translations[lang][key];
    }

  });

}

function initLoader(){

  const loader = document.getElementById("loader");

  if(!loader) return;

  const removeLoader = () => {

    loader.style.opacity = "0";
    loader.style.transform = "scale(1.06)";
    loader.style.pointerEvents = "none";

    setTimeout(() => {
      loader.remove();
    }, 800);

  };

  window.addEventListener("load", () => {
    setTimeout(removeLoader, 700);
  });

  setTimeout(removeLoader, 2400);

}

function initNavbar(){

  const nav = document.getElementById("navbar-container");

  if(!nav) return;

  const updateNav = () => {
    nav.classList.toggle("nav-scrolled", window.scrollY > 40);
  };

  updateNav();

  window.addEventListener("scroll", updateNav, {
    passive:true
  });

}

function initMobileMenu(){

  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if(!btn || !menu) return;

  btn.addEventListener("click", () => {

    btn.classList.toggle("menu-open");
    menu.classList.toggle("active");

    document.body.classList.toggle("overflow-hidden");

  });

  document.querySelectorAll(".mobile-link").forEach(link => {

    link.addEventListener("click", () => {

      menu.classList.remove("active");
      btn.classList.remove("menu-open");

      document.body.classList.remove("overflow-hidden");

    });

  });

}

function initFaq(){

  document.querySelectorAll(".faq-toggle").forEach(button => {

    button.addEventListener("click", () => {

      const item = button.parentElement;
      const content = item.querySelector(".faq-content");
      const icon = item.querySelector(".faq-icon");

      if(!content) return;

      if(content.style.maxHeight){

        content.style.maxHeight = null;

        if(icon){
          icon.style.transform = "rotate(0deg)";
        }

      }else{

        content.style.maxHeight = content.scrollHeight + "px";

        if(icon){
          icon.style.transform = "rotate(45deg)";
        }

      }

    });

  });

}

function initLenis(){

  if(typeof Lenis === "undefined") return;

  const lenis = new Lenis({
    duration:1.05,
    smoothWheel:true,
    smoothTouch:false,
    wheelMultiplier:0.9
  });

  function raf(time){

    lenis.raf(time);

    requestAnimationFrame(raf);

  }

  requestAnimationFrame(raf);

}

function initParticles(){

  const canvas = document.getElementById("particles-canvas");

  if(!canvas) return;

  const ctx = canvas.getContext("2d");

  let width = window.innerWidth;
  let height = window.innerHeight;

  let particles = [];

  function resize(){

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(
      window.devicePixelRatio,
      0,
      0,
      window.devicePixelRatio,
      0,
      0
    );

  }

  function createParticles(){

    particles = [];

    const isMobile = width < 768;
    const amount = isMobile ? 18 : 46;

    for(let i = 0; i < amount; i++){

      particles.push({
        x:Math.random() * width,
        y:Math.random() * height,
        size:Math.random() * 1 + .2,
        speedX:(Math.random() - .5) * .14,
        speedY:(Math.random() - .5) * .14,
        opacity:Math.random() * .15 + .04
      });

    }

  }

  function draw(){

    ctx.clearRect(0,0,width,height);

    particles.forEach(p => {

      p.x += p.speedX;
      p.y += p.speedY;

      if(p.x < 0) p.x = width;
      if(p.x > width) p.x = 0;

      if(p.y < 0) p.y = height;
      if(p.y > height) p.y = 0;

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        p.size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `rgba(196,163,255,${p.opacity})`;

      ctx.fill();

    });

    requestAnimationFrame(draw);

  }

  resize();
  createParticles();
  draw();

  window.addEventListener("resize", () => {

    resize();
    createParticles();

  }, {
    passive:true
  });

}

function initReservationForm(){

  const form = document.getElementById("reservation-form");

  if(!form) return;

  form.addEventListener("submit", e => {

    e.preventDefault();

    const name = document.getElementById("res-name").value.trim();
    const countryCode = document.getElementById("res-country-code").value.trim();
    const phoneRaw = document.getElementById("res-phone").value.trim();
    const phoneClean = phoneRaw.replace(/\D/g, "");
    const fullClientPhone = `+${countryCode} ${phoneClean}`;

    const day = document.getElementById("res-day").value;
    const time = document.getElementById("res-time").value;
    const guests = document.getElementById("res-guests").value;
    const experience = document.getElementById("res-experience").value;
    const message = document.getElementById("res-message").value.trim();

    const suggestedReply = `
Hola ${name}, muchas gracias por confiar en Veloura Dining.

Te confirmamos que tenemos disponibilidad para tu reserva:

Día: ${day}
Horario: ${time}
Invitados: ${guests}
Experiencia: ${experience}

Tu turno queda registrado y anotado. 
Te esperamos para vivir una experiencia premium.

Veloura Dining
`;

    const text = `
Nueva solicitud de reserva — Veloura Dining

Datos del cliente:
Nombre: ${name}
WhatsApp: ${fullClientPhone}

Reserva solicitada:
Día: ${day}
Horario: ${time}
Invitados: ${guests}
Experiencia: ${experience}

Mensaje del cliente:
${message || "Sin mensaje adicional."}

----------------------------

Respuesta sugerida para enviar al cliente:

${suggestedReply}
`;

    const encodedText = encodeURIComponent(text);

    const restaurantPhone = "54912747";

    window.open(
      `https://wa.me/${restaurantPhone}?text=${encodedText}`,
      "_blank"
    );

  });

}

function initApp(){

  const savedLang = localStorage.getItem("lang");

  const browserLang =
    navigator.language.startsWith("es")
      ? "es"
      : "en";

  setLang(savedLang || browserLang);

  initLoader();
  initNavbar();
  initMobileMenu();
  initFaq();
  initLenis();
  initParticles();
  initReservationForm();

}

document.addEventListener(
  "DOMContentLoaded",
  initComponents
);