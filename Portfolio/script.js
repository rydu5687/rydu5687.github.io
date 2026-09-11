/* =========================================
   PORTFOLIO SCRIPT
========================================= */

const header = document.querySelector(".site-header");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navigation a");
const natureLayer = document.getElementById("nature-layer");


/* =========================================
   HEADER + ACTIVE NAVIGATION
========================================= */

function updateNavigation() {
    if (header) {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 180;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {
            currentSection = section.id;
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updateNavigation, { passive: true });
updateNavigation();


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(
    ".section-header, " +
    ".project, " +
    ".about-intro, " +
    ".about-details, " +
    ".contact-section, " +
    ".model-category, " +
    ".vr-detail-grid, " +
    "#environments .portfolio-carousel"
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.1
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});


/* =========================================
   CURSOR GLOW
========================================= */

if (natureLayer) {
    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    natureLayer.appendChild(cursorGlow);

    document.addEventListener("mousemove", (event) => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });
}


/* =========================================
   FLOATING SPORES
========================================= */

function createSpore() {
    if (!natureLayer) return;

    const spore = document.createElement("div");
    spore.className = "spore";

    const size = Math.random() * 4 + 2;
    const duration = 12 + Math.random() * 12;

    spore.style.width = `${size}px`;
    spore.style.height = `${size}px`;
    spore.style.left = `${Math.random() * 100}%`;
    spore.style.animationDuration = `${duration}s`;

    natureLayer.appendChild(spore);

    setTimeout(() => {
        spore.remove();
    }, duration * 1000 + 1000);
}


/* =========================================
   FLOATING LEAVES
========================================= */

function createFloatingLeaf() {
    if (!natureLayer) return;

    const leaf = document.createElement("div");
    leaf.className = "floating-leaf";

    const scale = 0.55 + Math.random() * 0.8;
    const duration = 18 + Math.random() * 16;

    leaf.style.left = `${Math.random() * 100}%`;
    leaf.style.scale = scale;
    leaf.style.rotate = `${Math.random() * 40 - 20}deg`;
    leaf.style.animationDuration = `${duration}s`;

    natureLayer.appendChild(leaf);

    setTimeout(() => {
        leaf.remove();
    }, duration * 1000 + 1000);
}


/* Initial nature effects */

for (let i = 0; i < 18; i++) {
    setTimeout(createSpore, i * 300);
}

for (let i = 0; i < 6; i++) {
    setTimeout(createFloatingLeaf, i * 900);
}

setInterval(createSpore, 1800);
setInterval(createFloatingLeaf, 5000);


/* =========================================
   PORTFOLIO CAROUSELS
========================================= */

const carousels = document.querySelectorAll(".portfolio-carousel");

carousels.forEach((carousel) => {
    const slides = Array.from(
        carousel.querySelectorAll(".carousel-slide")
    );

    const previousButton = carousel.querySelector(".carousel-prev");
    const nextButton = carousel.querySelector(".carousel-next");
    const currentDisplay = carousel.querySelector(".current-slide");
    const totalDisplay = carousel.querySelector(".total-slides");
    const indexContainer = carousel.querySelector(".carousel-index");

    if (
        slides.length === 0 ||
        !previousButton ||
        !nextButton ||
        !indexContainer
    ) {
        return;
    }

    let currentIndex = 0;

    if (totalDisplay) {
        totalDisplay.textContent =
            String(slides.length).padStart(2, "0");
    }

    /* Build the named index buttons automatically. */
    slides.forEach((slide, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "carousel-index-button";
        button.textContent =
            slide.dataset.name || `Item ${index + 1}`;

        button.addEventListener("click", () => {
            showSlide(index);
        });

        indexContainer.appendChild(button);
    });

    const indexButtons = Array.from(
        indexContainer.querySelectorAll(".carousel-index-button")
    );

    function showSlide(index) {
        if (index < 0) {
            index = slides.length - 1;
        }

        if (index >= slides.length) {
            index = 0;
        }

        slides.forEach((slide) => {
            slide.classList.remove("active");
        });

        indexButtons.forEach((button) => {
            button.classList.remove("active");
        });

        slides[index].classList.add("active");
        indexButtons[index].classList.add("active");

        currentIndex = index;

        if (currentDisplay) {
            currentDisplay.textContent =
                String(index + 1).padStart(2, "0");
        }
    }

    previousButton.addEventListener("click", () => {
        showSlide(currentIndex - 1);
    });

    nextButton.addEventListener("click", () => {
        showSlide(currentIndex + 1);
    });

    carousel.tabIndex = 0;

    carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            showSlide(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
            showSlide(currentIndex + 1);
        }
    });

    showSlide(0);
});
