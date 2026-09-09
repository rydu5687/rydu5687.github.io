/* =========================================
   PORTFOLIO SCRIPT
========================================= */


/* =========================================
   HEADER + ACTIVE NAVIGATION
========================================= */

const header = document.querySelector(".site-header");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navigation a");

function updatePageNavigation() {

    /* Shrink header after scrolling */
    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }


    /* Highlight current navigation section */
    let currentSection = "";

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 180;

        const sectionBottom =
            sectionTop + section.offsetHeight;

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
    updatePageNavigation,
    { passive: true }
);

updatePageNavigation();


/* =========================================
   SCROLL REVEALS
========================================= */

const revealElements = document.querySelectorAll(
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


/* =========================================
   HERO PARALLAX
========================================= */

const heroImage =
    document.querySelector(
        ".hero-image-container"
    );


function updateHeroParallax() {

    if (!heroImage) {
        return;
    }

    if (
        window.scrollY <
        window.innerHeight
    ) {

        heroImage.style.transform =
            `translateY(${window.scrollY * 0.035}px)`;

    }

}


window.addEventListener(
    "scroll",
    updateHeroParallax,
    { passive: true }
);


/* =========================================
   CURSOR GLOW
========================================= */

const natureLayer =
    document.getElementById(
        "nature-layer"
    );


if (natureLayer) {

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

    if (!natureLayer) {
        return;
    }


    const spore =
        document.createElement("div");

    spore.className = "spore";


    const size =
        Math.random() * 3 + 2;


    spore.style.width =
        `${size}px`;

    spore.style.height =
        `${size}px`;

    spore.style.left =
        `${Math.random() * 100}vw`;

    spore.style.animationDuration =
        `${12 + Math.random() * 12}s`;

    spore.style.animationDelay =
        `${Math.random() * 3}s`;

    spore.style.opacity =
        `${0.15 + Math.random() * 0.35}`;


    natureLayer.appendChild(spore);


    setTimeout(() => {
        spore.remove();
    }, 26000);

}


/* Initial spores */
for (let i = 0; i < 12; i++) {

    setTimeout(
        createSpore,
        i * 400
    );

}


/* Slowly create new spores */
setInterval(
    createSpore,
    2000
);


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


    if (
        slides.length === 0 ||
        !previousButton ||
        !nextButton ||
        !indexContainer
    ) {
        return;
    }


    let currentIndex = 0;


    /* Display automatic total */
    if (totalDisplay) {

        totalDisplay.textContent =
            String(slides.length)
                .padStart(2, "0");

    }


    /* Build index from data-name values */
    slides.forEach(
        (slide, index) => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

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


    function showSlide(index) {

        /* Loop around at either end */
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


        slides[index].classList.add(
            "active"
        );

        indexButtons[index].classList.add(
            "active"
        );


        currentIndex = index;


        if (currentDisplay) {

            currentDisplay.textContent =
                String(index + 1)
                    .padStart(2, "0");

        }

    }


    previousButton.addEventListener(
        "click",
        () => {
            showSlide(currentIndex - 1);
        }
    );


    nextButton.addEventListener(
        "click",
        () => {
            showSlide(currentIndex + 1);
        }
    );


    /* Keyboard navigation */
    carousel.tabIndex = 0;

    carousel.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "ArrowLeft") {
                showSlide(currentIndex - 1);
            }

            if (event.key === "ArrowRight") {
                showSlide(currentIndex + 1);
            }

        }
    );


    /* Initialize first slide */
    showSlide(0);

});