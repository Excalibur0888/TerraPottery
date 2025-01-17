// Header Scroll Effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;

    // Highlight active menu item
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav__link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + section.getAttribute('id')) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Проверяем, что href не пустой и не равен "#"
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                document.body.classList.remove('menu-open');
            }
        }
    });
});

// Burger Menu
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav__list');
const body = document.body;

burger?.addEventListener('click', () => {
    body.classList.toggle('menu-open');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (body.classList.contains('menu-open') && 
        !e.target.closest('.nav__list') && 
        !e.target.closest('.burger')) {
        body.classList.remove('menu-open');
    }
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav__link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        body.classList.remove('menu-open');
    });
});

// Slider
const slider = document.querySelector('.slider');
if (slider) {
    const track = slider.querySelector('.slider__track');
    const items = slider.querySelectorAll('.slider__item');
    const prevBtn = slider.querySelector('.slider__btn--prev');
    const nextBtn = slider.querySelector('.slider__btn--next');
    
    let currentSlide = 0;
    const slideWidth = 100; // percentage
    const maxSlide = items.length - 1;
    
    // Auto slide
    let autoSlideInterval;
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    };
    
    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };
    
    // Update slider position with animation
    const updateSlider = () => {
        track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
    };
    
    // Next slide
    const nextSlide = () => {
        currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
        updateSlider();
    };
    
    // Previous slide
    const prevSlide = () => {
        currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
        updateSlider();
    };
    
    // Event listeners
    prevBtn?.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });
    
    nextBtn?.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });
    
    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        stopAutoSlide();
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    });
    
    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };
    
    // Start auto slide
    startAutoSlide();
    
    // Pause auto slide when hovering over slider
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
} 