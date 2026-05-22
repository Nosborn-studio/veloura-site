async function loadComponent(name){
  const response = await fetch(`./components/${name}.html`);
  const html = await response.text();
  const element = document.querySelector(`[data-component="${name}"]`);
  if(element) element.innerHTML = html;
}

async function initComponents(){
  const components = [
    "loader",
    "navbar",
    "hero",
    "marquee",
    "cinematic-transition",
    "tasting-menu",
    "menu",
    "experience",
    "chef",
    "awards",
    "gallery",
    "editorial",
    "social-proof",
    "testimonials",
    "reservations",
    "private-events",
    "location",
    "faq",
    "final-cta",
    "footer"
  ];

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
    if(translations[lang]?.[key]) el.innerHTML = translations[lang][key];
  });
}

function initLoader(){
  const loader = document.getElementById("loader");

  if(loader){
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.transform = "scale(1.08)";
      loader.style.pointerEvents = "none";

      setTimeout(() => {
        loader.remove();
      }, 800);
    }, 1300);
  }
}

function initNavbar(){
  const nav = document.getElementById("navbar-container");
  if(!nav) return;

  window.addEventListener("scroll", () => {
    nav.classList.toggle("nav-scrolled", window.scrollY > 40);
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

      if(content.style.maxHeight){
        content.style.maxHeight = null;
        icon.style.transform = "rotate(0deg)";
      }else{
        content.style.maxHeight = content.scrollHeight + "px";
        icon.style.transform = "rotate(45deg)";
      }
    });
  });
}

function initLenis(){
  if(typeof Lenis === "undefined") return;

  const lenis = new Lenis({
    duration:1.15,
    smoothWheel:true,
    smoothTouch:false
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

    ctx.setTransform(window.devicePixelRatio,0,0,window.devicePixelRatio,0,0);
  }

  function createParticles(){
    particles = [];
    const amount = width < 768 ? 24 : 55;

    for(let i = 0; i < amount; i++){
      particles.push({
        x:Math.random() * width,
        y:Math.random() * height,
        size:Math.random() * 1.1 + .2,
        speedX:(Math.random() - .5) * .18,
        speedY:(Math.random() - .5) * .18,
        opacity:Math.random() * .18 + .05
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
      ctx.arc(p.x,p.y,p.size,0,Math.PI * 2);
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
  });
}

function initCursorGlow(){
  const glow = document.getElementById("cursor-glow");
  if(!glow || window.innerWidth < 768) return;

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate(){
    currentX += (mouseX - currentX) * .08;
    currentY += (mouseY - currentY) * .08;

    glow.style.left = currentX + "px";
    glow.style.top = currentY + "px";

    requestAnimationFrame(animate);
  }

  animate();
}

function initMagnetic(){
  if(window.innerWidth < 768) return;

  document.querySelectorAll("a, button").forEach(el => {
    el.classList.add("magnetic");

    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();

      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * .12}px, ${y * .12}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0px,0px)";
    });
  });
}

function initTilt(){
  if(window.innerWidth < 768) return;

  document.querySelectorAll(".card-hover").forEach(card => {
    card.classList.add("tilt-active");

    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;

      card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
      card.style.setProperty("--my", `${(y / rect.height) * 100}%`);

      card.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.01)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initGsap(){
  if(typeof gsap === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.from("nav", {
    y:-40,
    opacity:0,
    duration:1,
    ease:"power3.out",
    delay:.3
  });

  gsap.from(".hero-item", {
    y:50,
    opacity:0,
    duration:1.1,
    stagger:.12,
    ease:"power3.out",
    delay:1
  });

  gsap.utils.toArray("section:not(#inicio)").forEach(section => {
    gsap.from(section, {
      scrollTrigger:{
        trigger:section,
        start:"top 85%",
        once:true
      },
      y:60,
      opacity:0,
      duration:.9,
      ease:"power3.out"
    });
  });

  gsap.utils.toArray(".card-hover").forEach(card => {
    gsap.from(card, {
      scrollTrigger:{
        trigger:card,
        start:"top 92%",
        once:true
      },
      y:35,
      opacity:0,
      duration:.8,
      ease:"power3.out"
    });
  });

  gsap.utils.toArray(".parallax-slow").forEach(el => {
    gsap.to(el, {
      y:-80,
      ease:"none",
      scrollTrigger:{
        trigger:el,
        start:"top bottom",
        end:"bottom top",
        scrub:true
      }
    });
  });

  gsap.utils.toArray(".parallax-medium").forEach(el => {
    gsap.to(el, {
      y:-140,
      ease:"none",
      scrollTrigger:{
        trigger:el,
        start:"top bottom",
        end:"bottom top",
        scrub:true
      }
    });
  });

  gsap.utils.toArray(".parallax-fast").forEach(el => {
    gsap.to(el, {
      y:-220,
      ease:"none",
      scrollTrigger:{
        trigger:el,
        start:"top bottom",
        end:"bottom top",
        scrub:true
      }
    });
  });

  gsap.to(".hero-content", {
    y:-120,
    ease:"none",
    scrollTrigger:{
      trigger:"#inicio",
      start:"top top",
      end:"bottom top",
      scrub:true
    }
  });
}

function initApp(){
  const savedLang = localStorage.getItem("lang");
  const browserLang = navigator.language.startsWith("es") ? "es" : "en";

  setLang(savedLang || browserLang);

  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      setLang(btn.getAttribute("data-lang"));
    });
  });

  initLoader();
  initNavbar();
  initMobileMenu();
  initFaq();
  initLenis();
  initParticles();
  initCursorGlow();
  initMagnetic();

  setTimeout(() => {
    initGsap();
    initTilt();
  }, 300);
}

document.addEventListener("DOMContentLoaded", initComponents);