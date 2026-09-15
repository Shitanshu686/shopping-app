/* =========================================================
   SHOP EASE - HERO CAROUSEL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const banner = document.querySelector(".banner");

    if (!banner) {
        console.error("Hero Carousel: .banner not found");
        return;
    }

    const originalImage = banner.querySelector("img");

    if (!originalImage) {
        console.error("Hero Carousel: banner image not found");
        return;
    }

    const originalSrc = originalImage.getAttribute("src");
    const originalAlt = originalImage.getAttribute("alt") || "ShopEase Banner";

    banner.innerHTML = `
        <div class="hero-carousel-track">

            <div class="hero-slide">
                <img src="${originalSrc}" alt="${originalAlt}">
            </div>

            <div class="hero-slide">
                <img src="images/hero-s25-ultra.png" alt="Samsung Galaxy S25 Ultra">
            </div>

            <div class="hero-slide">
                <img src="images/hero-iphone17.png" alt="iPhone 17">
            </div>

            <div class="hero-slide">
                <img src="images/hero-sony-xm6.png" alt="Sony XM6">
            </div>

        </div>

        <button class="hero-prev" aria-label="Previous Slide">&#10094;</button>
        <button class="hero-next" aria-label="Next Slide">&#10095;</button>

        <div class="hero-dots"></div>
    `;

    const track = banner.querySelector(".hero-carousel-track");
    const slides = banner.querySelectorAll(".hero-slide");
    const prevBtn = banner.querySelector(".hero-prev");
    const nextBtn = banner.querySelector(".hero-next");
    const dotsContainer = banner.querySelector(".hero-dots");

    let currentSlide = 0;
    let autoSlide;

    /* Create dots */
    slides.forEach((_, index) => {

        const dot = document.createElement("button");

        dot.classList.add("hero-dot");

        if (index === 0) {
            dot.classList.add("active");
        }

        dot.addEventListener("click", () => {
            goToSlide(index);
            restartAutoSlide();
        });

        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".hero-dot");

    /* Move to slide */
    function goToSlide(index) {

        currentSlide = index;

        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentSlide);
        });
    }

    /* Next */
    function nextSlide() {

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        goToSlide(currentSlide);
    }

    /* Previous */
    function previousSlide() {

        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }

        goToSlide(currentSlide);
    }

    /* Buttons */
    nextBtn.addEventListener("click", () => {
        nextSlide();
        restartAutoSlide();
    });

    prevBtn.addEventListener("click", () => {
        previousSlide();
        restartAutoSlide();
    });

    /* Auto Slide */
    function startAutoSlide() {

        autoSlide = setInterval(() => {
            nextSlide();
        }, 5000);
    }

    function restartAutoSlide() {

        clearInterval(autoSlide);
        startAutoSlide();
    }

    startAutoSlide();

});
