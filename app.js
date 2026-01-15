/*
  Miko Dental prototype interactions
  - Sticky nav shadow
  - Mobile slide menu
  - Modal forms (Netlify form)
  - GSAP hero animations
  - Scroll reveal (AOS-like) via IntersectionObserver
  - Carousel controls + autoplay
  - Subtle parallax on hero video
*/

(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sticky navbar style
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("nav--scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const burger = document.getElementById("burger");
  const mobile = document.getElementById("mobileMenu");
  const mobileClose = document.getElementById("mobileClose");

  const openMobile = () => {
    if (!mobile || !burger) return;
    mobile.classList.add("is-open");
    mobile.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeMobile = () => {
    if (!mobile || !burger) return;
    mobile.classList.remove("is-open");
    mobile.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burger?.addEventListener("click", () => {
    if (!mobile) return;
    mobile.classList.contains("is-open") ? closeMobile() : openMobile();
  });
  mobileClose?.addEventListener("click", closeMobile);
  mobile?.addEventListener("click", (e) => {
    // click outside panel closes
    if (e.target === mobile) closeMobile();
  });
  mobile?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobile));

  // Modals
  const modalProgramare = document.getElementById("modalProgramare");
  const modalProfil = document.getElementById("modalProfil");

  const openModal = (which) => {
    const modal = which === "profil" ? modalProfil : modalProgramare;
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // focus first focusable
    setTimeout(() => {
      const focusable = modal.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      focusable?.focus?.();
    }, 0);
  };

  const closeModals = () => {
    [modalProgramare, modalProfil].forEach((m) => {
      if (!m) return;
      m.classList.remove("is-open");
      m.setAttribute("aria-hidden", "true");
    });
    document.body.style.overflow = "";
  };

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    const opener = t.closest("[data-open-modal]");
    if (opener) {
      const which = opener.getAttribute("data-open-modal");
      if (which === "profil") {
        const profileKey = opener.getAttribute("data-profile") || "";
        hydrateProfile(profileKey);
        openModal("profil");
      } else {
        openModal("programare");
      }
      return;
    }

    if (t.closest("[data-close-modal]")) {
      closeModals();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModals();
      closeMobile();
    }
  });

  // Doctor profile content (demo)
  const profileTitle = document.getElementById("profileTitle");
  const profileSub = document.getElementById("profileSub");
  const profileBio = document.getElementById("profileBio");
  const profileList = document.getElementById("profileList");

  const PROFILES = {
    atanasiu: {
      title: "Dr. Șerban Atanasiu",
      sub: "Implantologie • Chirurgie",
      bio: "Focus pe implantologie rapidă și chirurgie ghidată, cu protocoale moderne orientate către confort și predictibilitate.",
      bullets: ["Planificare digitală", "Protocoale rapide (Fast&Fixed)", "Materiale premium"],
    },
    boja: {
      title: "Dr. Costin Boja",
      sub: "Endodonție • Microscopie",
      bio: "Endodonție de precizie la microscop pentru salvarea dinților și rezultate stabile pe termen lung.",
      bullets: ["Microscop endodontic", "Tratament atraumatic", "Control riguros al calității"],
    },
    maasarani: {
      title: "Dr. Adel Maasarani",
      sub: "Stomatologie • Estetică",
      bio: "Estetică dentară și soluții personalizate pentru un zâmbet natural, armonios și sănătos.",
      bullets: ["Design de zâmbet", "Fațete & albire", "Finisaje premium"],
    },
    sbingu: {
      title: "Dr. Mihaela Sbingu",
      sub: "Stomatologie generală",
      bio: "Stomatologie generală cu abordare empatică, orientată către prevenție, confort și educația pacientului.",
      bullets: ["Consultații complete", "Prevenție și igienizare", "Plan pe etape"],
    },
  };

  function hydrateProfile(key) {
    const data = PROFILES[key] || {
      title: "Profil medic",
      sub: "Demo",
      bio: "Conținut demonstrativ pentru prototip.",
      bullets: ["Echipă multidisciplinară", "Tehnologie premium", "Rezultate predictibile"],
    };

    if (profileTitle) profileTitle.textContent = data.title;
    if (profileSub) profileSub.textContent = data.sub;
    if (profileBio) profileBio.textContent = data.bio;
    if (profileList) {
      profileList.innerHTML = "";
      data.bullets.forEach((b) => {
        const li = document.createElement("li");
        li.textContent = b;
        profileList.appendChild(li);
      });
    }
  }

  // Scroll reveal
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // Service card videos: play when visible (keeps page feeling premium without autoplaying everything)
  const serviceVideos = Array.from(document.querySelectorAll(".serviceCard__media video"));
  if (serviceVideos.length) {
    // Ensure they are configured for silent autoplay when allowed
    serviceVideos.forEach((v) => {
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
    });

    const vio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target;
          if (!(v instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting) {
            v.play().catch(() => {
              // Autoplay may be blocked; user interaction can start it.
            });
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.35 }
    );
    serviceVideos.forEach((v) => vio.observe(v));
  }

  // GSAP hero stagger
  if (!prefersReduced && window.gsap) {
    const tl = window.gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".nav", { y: -18, opacity: 0, duration: 0.7 })
      .from(".hero__badge", { y: 14, opacity: 0, duration: 0.6 }, "-=0.25")
      .from(".hero__title", { y: 18, opacity: 0, duration: 0.7 }, "-=0.35")
      .from(".hero__subtitle", { y: 18, opacity: 0, duration: 0.6 }, "-=0.45")
      .from(".hero__ctas", { y: 16, opacity: 0, duration: 0.6 }, "-=0.35")
      .from(".hero__micro", { y: 16, opacity: 0, duration: 0.6 }, "-=0.35");
  }

  // Hero parallax (subtle)
  const heroVideo = document.querySelector(".hero__video");
  if (!prefersReduced && heroVideo) {
    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        heroVideo.style.transform = `scale(1.06) translate(${x * 10}px, ${y * 8}px)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener(
      "scroll",
      () => {
        const s = Math.min(window.scrollY / 800, 1);
        heroVideo.style.filter = `saturate(${1.05 - s * 0.08}) contrast(${1.05 - s * 0.05})`;
      },
      { passive: true }
    );
  }

  // Carousel
  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const track = carousel.querySelector("[data-carousel-track]");
    const btnPrev = carousel.querySelector("[data-carousel-prev]");
    const btnNext = carousel.querySelector("[data-carousel-next]");
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    const items = Array.from(carousel.querySelectorAll("[data-doc]"));
    const dotButtons = [];

    const getStep = () => {
      const first = items[0];
      if (!first) return 320;
      const rect = first.getBoundingClientRect();
      return rect.width + 14; // gap
    };

    const scrollToIndex = (idx) => {
      if (!track) return;
      track.scrollTo({ left: idx * getStep(), behavior: "smooth" });
    };

    const setActiveDot = (idx) => {
      dotButtons.forEach((b, i) => b.classList.toggle("is-active", i === idx));
    };

    if (dotsWrap && items.length) {
      items.forEach((_, i) => {
        const b = document.createElement("button");
        b.className = "dotBtn";
        b.type = "button";
        b.setAttribute("aria-label", `Slide ${i + 1}`);
        b.addEventListener("click", () => scrollToIndex(i));
        dotsWrap.appendChild(b);
        dotButtons.push(b);
      });
      setActiveDot(0);
    }

    btnPrev?.addEventListener("click", () => {
      if (!track) return;
      track.scrollBy({ left: -getStep(), behavior: "smooth" });
    });
    btnNext?.addEventListener("click", () => {
      if (!track) return;
      track.scrollBy({ left: getStep(), behavior: "smooth" });
    });

    // Update dots on scroll
    let scrollTimer = 0;
    track?.addEventListener(
      "scroll",
      () => {
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(() => {
          const idx = Math.round((track.scrollLeft || 0) / getStep());
          setActiveDot(Math.max(0, Math.min(idx, items.length - 1)));
        }, 80);
      },
      { passive: true }
    );

    // Autoplay
    if (!prefersReduced && track && items.length > 1) {
      let idx = 0;
      setInterval(() => {
        // if user is interacting with scroll, avoid fighting
        if (document.activeElement === track) return;
        idx = (idx + 1) % items.length;
        scrollToIndex(idx);
      }, 4200);
    }
  }

  // Fix: prevent accidental drag select on buttons
  document.querySelectorAll("button").forEach((b) => b.setAttribute("draggable", "false"));
})();

