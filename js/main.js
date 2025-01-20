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

// Testimonials Slider
class TestimonialsSlider {
    constructor() {
        this.slider = document.querySelector('.testimonials__slider');
        if (!this.slider) return;

        this.track = this.slider.querySelector('.testimonials__track');
        this.slides = this.slider.querySelectorAll('.testimonial__slide');
        this.dotsContainer = this.slider.querySelector('.testimonials__dots');
        this.prevBtn = this.slider.querySelector('.testimonials__btn--prev');
        this.nextBtn = this.slider.querySelector('.testimonials__btn--next');
        
        this.currentSlide = 0;
        this.slidesCount = this.slides.length;
        
        this.init();
    }
    
    init() {
        // Create dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `testimonials__dot${index === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Перейти к отзыву ${index + 1}`);
            this.dotsContainer.appendChild(dot);
            
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Add button listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Update slide positions
        this.updateSlidePositions();
    }
    
    updateSlidePositions() {
        this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        
        // Update dots
        const dots = this.dotsContainer.querySelectorAll('.testimonials__dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlidePositions();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slidesCount) % this.slidesCount;
        this.updateSlidePositions();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slidesCount;
        this.updateSlidePositions();
    }
}

// Tabs functionality
class Tabs {
    constructor() {
        this.tabsContainer = document.querySelector('.tabs');
        if (!this.tabsContainer) return;

        this.tabBtns = this.tabsContainer.querySelectorAll('.tabs__btn');
        this.tabPanes = this.tabsContainer.querySelectorAll('.tabs__pane');
        
        this.init();
    }
    
    init() {
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                this.switchTab(tabId);
            });
        });
    }
    
    switchTab(tabId) {
        // Update buttons
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        // Update panes
        this.tabPanes.forEach(pane => {
            pane.classList.toggle('active', pane.id === tabId);
        });
    }
}

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialsSlider();
    new Tabs();
}); 