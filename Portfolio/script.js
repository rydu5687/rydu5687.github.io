/* =========================================
   PORTFOLIO SCRIPT
========================================= */


/* =========================================
   GLOBAL ELEMENTS
========================================= */

const header = document.querySelector(".site-header");

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".navigation a");

const natureLayer =
    document.getElementById("nature-layer");

const heroImage =
    document.querySelector(".hero-image-container");

const reduceMotion = false;


/* =========================================
   HEADER + ACTIVE NAVIGATION
========================================= */

function updateNavigation() {

    /* Header shrink */

    if (header) {

        if (window.scrollY > 40) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    /* Active navigation link */

    let currentSection = "";


    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 180;

        const sectionBottom =
            sectionTop +
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");


        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}


window.addEventListener(
    "scroll",
    updateNavigation,
    { passive: true }
);


updateNavigation();


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(
        ".section-header, " +
        ".project, " +
        ".about-intro, " +
        ".about-details, " +
        ".contact-section, " +
        ".model-category, " +
        ".vr-detail-grid"
    );


revealElements.forEach((element) => {

    element.classList.add("reveal");

});


if (!reduceMotion) {

    const revealObserver =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add(
                        "visible"
                    );


                    revealObserver.unobserve(
                        entry.target
                    );

                });

            },

            {
                threshold: 0.1
            }

        );


    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach((element) => {

        element.classList.add("visible");

    });

}


/* =========================================
   HERO PARALLAX
========================================= */

function updateHeroParallax() {

    if (!heroImage) {
        return;
    }


    if (reduceMotion) {
        return;
    }


    const scrollAmount =
        window.scrollY;


    if (
        scrollAmount <
        window.innerHeight
    ) {

        heroImage.style.transform =
            `translateY(${scrollAmount * 0.035}px)`;

    }

}


window.addEventListener(
    "scroll",
    updateHeroParallax,
    { passive: true }
);


updateHeroParallax();


/* =========================================
   CURSOR GLOW
========================================= */

if (
    natureLayer &&
    !reduceMotion
) {

    const cursorGlow =
        document.createElement("div");


    cursorGlow.className =
        "cursor-glow";


    natureLayer.appendChild(
        cursorGlow
    );


    document.addEventListener(
        "mousemove",
        (event) => {

            cursorGlow.style.left =
                `${event.clientX}px`;

            cursorGlow.style.top =
                `${event.clientY}px`;

        }
    );

}


/* =========================================
   FLOATING SPORES
========================================= */

function createSpore() {

    if (
        !natureLayer ||
        reduceMotion
    ) {
        return;
    }


    const spore =
        document.createElement("div");


    spore.className =
        "spore";


    /* Random size */

    const size =
        Math.random() * 4 + 2;


    spore.style.width =
        `${size}px`;

    spore.style.height =
        `${size}px`;


    /* Random horizontal position */

    spore.style.left =
        `${Math.random() * 100}%`;


    /* Random animation duration */

    const duration =
        12 + Math.random() * 12;


    spore.style.animationDuration =
        `${duration}s`;


    /* Slight variation in brightness */

    spore.style.opacity =
        `${0.2 + Math.random() * 0.35}`;


    natureLayer.appendChild(
        spore
    );


    /* Remove after animation */

    setTimeout(() => {

        spore.remove();

    }, duration * 1000 + 1000);

}


/* =========================================
   FLOATING LEAVES / FERN-LIKE SHAPES
========================================= */

function createFloatingLeaf() {

    if (
        !natureLayer ||
        reduceMotion
    ) {
        return;
    }


    const leaf =
        document.createElement("div");


    leaf.className =
        "floating-leaf";


    /* Random horizontal position */

    leaf.style.left =
        `${Math.random() * 100}%`;


    /* Random size */

    const scale =
        0.55 +
        Math.random() * 0.8;


    leaf.style.scale =
        scale;


    /* Random animation duration */

    const duration =
        18 +
        Math.random() * 16;


    leaf.style.animationDuration =
        `${duration}s`;


    /* Slight random rotation */

    leaf.style.rotate =
        `${Math.random() * 40 - 20}deg`;


    natureLayer.appendChild(
        leaf
    );


    setTimeout(() => {

        leaf.remove();

    }, duration * 1000 + 1000);

}


/* =========================================
   INITIAL NATURE PARTICLES
========================================= */

if (!reduceMotion) {

    /* Initial spores */

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        setTimeout(
            createSpore,
            i * 300
        );

    }


    /* Initial leaves */

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        setTimeout(
            createFloatingLeaf,
            i * 900
        );

    }


    /* Keep spores appearing */

    setInterval(
        createSpore,
        1800
    );


    /* Keep leaves appearing */

    setInterval(
        createFloatingLeaf,
        5000
    );

}


/* =========================================
   PORTFOLIO CAROUSELS
========================================= */

const carousels =
    document.querySelectorAll(
        ".portfolio-carousel"
    );


carousels.forEach((carousel) => {

    const slides =
        Array.from(
            carousel.querySelectorAll(
                ".carousel-slide"
            )
        );


    const previousButton =
        carousel.querySelector(
            ".carousel-prev"
        );


    const nextButton =
        carousel.querySelector(
            ".carousel-next"
        );


    const currentDisplay =
        carousel.querySelector(
            ".current-slide"
        );


    const totalDisplay =
        carousel.querySelector(
            ".total-slides"
        );


    const indexContainer =
        carousel.querySelector(
            ".carousel-index"
        );


    /* Stop if carousel is incomplete */

    if (
        slides.length === 0 ||
        !previousButton ||
        !nextButton ||
        !indexContainer
    ) {

        return;

    }


    let currentIndex = 0;


    /* =====================================
       TOTAL SLIDE COUNT
    ====================================== */

    if (totalDisplay) {

        totalDisplay.textContent =
            String(slides.length)
                .padStart(2, "0");

    }


    /* =====================================
       BUILD INDEX BUTTONS
    ====================================== */

    slides.forEach(
        (slide, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "carousel-index-button";


            button.textContent =
                slide.dataset.name ||
                `Item ${index + 1}`;


            button.addEventListener(
                "click",
                () => {

                    showSlide(index);

                }
            );


            indexContainer.appendChild(
                button
            );

        }
    );


    const indexButtons =
        Array.from(
            indexContainer.querySelectorAll(
                ".carousel-index-button"
            )
        );


    /* =====================================
       SHOW SLIDE
    ====================================== */

    function showSlide(index) {

        /* Loop backwards */

        if (index < 0) {

            index =
                slides.length - 1;

        }


        /* Loop forwards */

        if (
            index >=
            slides.length
        ) {

            index = 0;

        }


        /* Hide every slide */

        slides.forEach((slide) => {

            slide.classList.remove(
                "active"
            );

        });


        /* Reset index buttons */

        indexButtons.forEach(
            (button) => {

                button.classList.remove(
                    "active"
                );

            }
        );


        /* Show selected slide */

        slides[index].classList.add(
            "active"
        );


        indexButtons[index].classList.add(
            "active"
        );


        currentIndex =
            index;


        /* Update counter */

        if (currentDisplay) {

            currentDisplay.textContent =
                String(index + 1)
                    .padStart(2, "0");

        }

    }


    /* =====================================
       PREVIOUS BUTTON
    ====================================== */

    previousButton.addEventListener(
        "click",
        () => {

            showSlide(
                currentIndex - 1
            );

        }
    );


    /* =====================================
       NEXT BUTTON
    ====================================== */

    nextButton.addEventListener(
        "click",
        () => {

            showSlide(
                currentIndex + 1
            );

        }
    );


    /* =====================================
       KEYBOARD CONTROLS

       Click/focus a carousel and use
       left/right arrow keys.
    ====================================== */

    carousel.tabIndex = 0;


    carousel.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "ArrowLeft"
            ) {

                showSlide(
                    currentIndex - 1
                );

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                showSlide(
                    currentIndex + 1
                );

            }

        }
    );


    /* Start on first slide */

    showSlide(0);

});