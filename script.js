/* ================================
   AOS INIT & GLOBAL SETUP
================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Check if AOS is loaded
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out'
        });
    } else {
        console.warn('AOS library not loaded');
    }

    // Initialize other components that might depend on DOM
    initCustomCursor();
    initScrollEffects();
});

/* ================================
   ELEMENT CACHING
================================ */
// Moved inside functions or kept global if used in event listeners that run after load
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.cursor-dot');
const bentoItems = document.querySelectorAll('.bento-item');
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

function initCustomCursor() {
    /* ================================
       DISABLE CURSOR ON TOUCH DEVICES
    ================================ */
    if (window.matchMedia('(hover: none)').matches) {
        cursor?.remove();
        cursorDot?.remove();
        return;
    }

    // ... rest of cursor initialization if needed
}

function initScrollEffects() {
    // ... Any scroll init logic
}


/* ================================
   CUSTOM CURSOR + PARALLAX (RAF)
================================ */
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;
let rafId = null;

// Lerp function for smooth interpolation
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!rafId) {
        rafId = requestAnimationFrame(updateCursorAndParallax);
    }
});

function updateCursorAndParallax() {
    rafId = null;

    // Smooth cursor movement with lerp
    currentX = lerp(currentX, mouseX, 0.15);
    currentY = lerp(currentY, mouseY, 0.15);

    // Cursor movement (GPU accelerated)
    if (cursor && cursorDot) {
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        cursorDot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }

    // Enhanced parallax for bento items with depth layers
    bentoItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Vary depth based on item index for multi-layer effect
        const depthFactor = 1 + (index % 3) * 0.3;
        const dx = ((mouseX - centerX) / (50 / depthFactor));
        const dy = ((mouseY - centerY) / (50 / depthFactor));

        // Smooth interpolation
        const currentTransform = item.style.transform || '';
        const targetTransform = `
            perspective(1000px)
            rotateX(${-dy}deg)
            rotateY(${dx}deg)
            translateZ(${depthFactor * 5}px)
        `;

        item.style.transform = targetTransform;
    });

    // Continue animation loop if mouse is still moving
    if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
        rafId = requestAnimationFrame(updateCursorAndParallax);
    }
}

/* ================================
   CURSOR HOVER EFFECT
================================ */
document.querySelectorAll('a, button, .bento-item').forEach(el => {
    el.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
});

/* ================================
   RESET PARALLAX ON LEAVE
================================ */
bentoItems.forEach(item => {
    item.addEventListener('mouseleave', () => {
        // Smooth reset with transition
        item.style.transition = 'transform 0.5s ease-out';
        item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';

        setTimeout(() => {
            item.style.transition = '';
        }, 500);
    });
});

/* ================================
   RIPPLE CLICK EFFECT
================================ */
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - 50}px`;
    ripple.style.top = `${e.clientY - 50}px`;
    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 1000);
});

/* ================================
   SMOOTH SCROLL (CUSTOM EASING)
================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        e.preventDefault();

        const start = window.pageYOffset;
        const end = target.getBoundingClientRect().top + start;
        const distance = end - start;
        const duration = 900;
        let startTime = null;

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }

        function animateScroll(time) {
            if (!startTime) startTime = time;
            const progress = Math.min((time - startTime) / duration, 1);
            window.scrollTo(0, start + distance * easeInOutQuad(progress));
            if (progress < 1) requestAnimationFrame(animateScroll);
        }

        requestAnimationFrame(animateScroll);
        mobileMenu?.classList.add('hidden');
    });
});

/* ================================
   NAVBAR SCROLL EFFECT
================================ */
window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('nav-blur', window.scrollY > 50);
    navbar.classList.toggle('shadow-lg', window.scrollY > 50);
});

/* ================================
   MOBILE MENU TOGGLE
================================ */
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
        mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
    });

    // Close mobile menu when clicking links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-download-btn');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        });
    });
}

// Smooth scroll with polyfill for Safari
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            }
        }
    });
});

/* ================================
   INTERSECTION OBSERVER (BENTO)
================================ */
const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Staggered animation for visual appeal
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 50);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

bentoItems.forEach(item => observer.observe(item));

/* ================================
   RANDOM FLOAT ICON ANIMATION - ENHANCED
================================ */
const iconAnimations = [
    { name: 'icon-float-1', duration: [3, 5], delay: [0, 2] },
    { name: 'icon-float-2', duration: [3.5, 5.5], delay: [0, 1.5] },
    { name: 'icon-float-3', duration: [2.5, 4.5], delay: [0, 2] },
    { name: 'icon-float-4', duration: [3, 5], delay: [0, 1.8] },
    { name: 'icon-swing', duration: [4, 6], delay: [0, 2.5] }
];

function randomizeIconAnimation(icon) {
    const animation = iconAnimations[Math.floor(Math.random() * iconAnimations.length)];
    const duration = animation.duration[0] + Math.random() * (animation.duration[1] - animation.duration[0]);
    const delay = animation.delay[0] + Math.random() * (animation.delay[1] - animation.delay[0]);

    icon.style.animation = 'none';
    requestAnimationFrame(() => {
        icon.style.animation = `${animation.name} ${duration}s ease-in-out ${delay}s infinite`;
    });
}

// Initialize all icons with random animations
const allIcons = document.querySelectorAll('.bento-item i');
allIcons.forEach((icon, index) => {
    setTimeout(() => randomizeIconAnimation(icon), index * 100);
});

// Periodically randomize icon animations for dynamic effect
setInterval(() => {
    const icons = document.querySelectorAll('.bento-item i');
    if (!icons.length) return;

    const icon = icons[Math.floor(Math.random() * icons.length)];
    randomizeIconAnimation(icon);
}, 2500);

/* ================================
   HORIZONTAL SCROLL TEXT EFFECT - SCROLL-BASED (Feature Line Only)
================================ */
const featureLine = document.getElementById('line4');
console.log('Looking for #line4...', featureLine);

if (featureLine) {
    console.log('✓ Feature line found! Starting scroll effect...');
    let currentOffset = 0;
    let targetOffset = 0;
    let scrollAnimationFrame = null;

    function updateFeatureLineScroll() {
        scrollAnimationFrame = null;

        const rect = featureLine.getBoundingClientRect();
        const containerTop = rect.top;
        const containerHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate scroll progress based on container position
        const scrollRange = windowHeight + containerHeight;
        const scrollProgress = (windowHeight - containerTop) / scrollRange;

        // Calculate target offset based on scroll progress
        const scrollSpeed = 2000; // Increased for very visible effect
        targetOffset = scrollProgress * scrollSpeed;

        // Smooth lerp interpolation
        currentOffset = lerp(currentOffset, targetOffset, 0.15);

        // Apply transform (scroll left)
        featureLine.style.transform = `translateX(-${currentOffset}px)`;

        // Debug logging
        if (Math.random() < 0.05) { // Log 5% of the time
            console.log(`Progress: ${(scrollProgress * 100).toFixed(1)}% | Offset: ${currentOffset.toFixed(0)}px`);
        }
    }

    // Throttled scroll handler
    function onPageScroll() {
        if (!scrollAnimationFrame) {
            scrollAnimationFrame = requestAnimationFrame(updateFeatureLineScroll);
        }
    }

    // Add scroll listener
    window.addEventListener('scroll', onPageScroll, { passive: true });
    console.log('✓ Scroll listener added');

    // Initial update
    updateFeatureLineScroll();
    console.log('✓ Initial scroll update complete');
} else {
    console.error('✗ Feature line #line4 NOT FOUND!');
}

/* ================================
   FAQ / DT TOGGLE
================================ */
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    item.addEventListener('click', () => {
        // Close other FAQ items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

// Download button interactions
const downloadButtons = document.querySelectorAll('.download-btn, .mobile-download-btn, button:has(.fa-download)');
downloadButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        // Simulate download action
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Downloading...</span>';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
            alert('Download started! This is a demo.');
        }, 1500);
    });
});