import './style.css';
import { setupQuiz } from './quiz';

// HERO ANIMATION SETUP
const setupHeroAnimation = () => {
    const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const root = document.getElementById('hero-animation');

    if (!canvas || !context || !root) return;

    const startFrame = 33;
    const endFrame = 85;
    const frameCount = endFrame - startFrame + 1;

    const currentFrame = (index: number) => (
        `/hero-frames/${index.toString().padStart(5, '0')}.png`
    );

    // Preload images
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preloadImages = () => {
        for (let i = startFrame; i <= endFrame; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    handleScroll();
                }
            };
            images.push(img);
        }
    };

    const renderFrame = (index: number) => {
        const imageIndex = index - startFrame;
        const image = images[imageIndex];
        if (!image || !image.complete || image.naturalWidth === 0) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const imgWidth = image.width;
        const imgHeight = image.height;
        const screenWidth = canvas.width;
        const screenHeight = canvas.height;

        const ratio = Math.max(screenWidth / imgWidth, screenHeight / imgHeight);
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;

        const x = (screenWidth - newWidth) / 2;
        const y = (screenHeight - newHeight) / 2;

        context.imageSmoothingEnabled = false; // "Hard switch" look
        context.clearRect(0, 0, screenWidth, screenHeight);
        context.drawImage(image, x, y, newWidth, newHeight);
    };

    const handleScroll = () => {
        const rect = root.getBoundingClientRect();
        
        // Duration is the total height of the parent minus the height of the screen (sticky duration)
        const duration = rect.height - window.innerHeight;
        let scrollFraction = -rect.top / duration;

        // Clamp to 0.0 - 1.0
        scrollFraction = Math.max(0, Math.min(1, scrollFraction));
        
        const frameIndex = Math.min(
            endFrame,
            Math.max(startFrame, Math.floor(scrollFraction * (frameCount - 1)) + startFrame)
        );

        requestAnimationFrame(() => renderFrame(frameIndex));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
        handleScroll();
    });

    preloadImages();
};

// Create Starry Background
const createStars = () => {
    const container = document.getElementById('star-container');
    if (!container) return;

    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        star.style.left = `${x}vw`;
        star.style.top = `${y}vh`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        container.appendChild(star);
    }
};

// Rest of the logic (Intersection Observer, Story Expansion, Smooth Scroll)
const setupIntersectionObserver = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const children = entry.target.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .animate-up');
                children.forEach((child, index) => {
                    (child as HTMLElement).style.transitionDelay = `${index * 0.25}s`;
                    child.classList.add('visible');
                });
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.story-section-wrapper, .story-section, .chars, #lessons, #final, .fade-in, .animate-up, .transition-line');
    sections.forEach(section => observer.observe(section));
};

const setupStoryExpansion = () => {
    const expandBtns = document.querySelectorAll('.btn-expand');
    const closeBtns = document.querySelectorAll('.btn-close');
    const backStoryBtns = document.querySelectorAll('.btn-back-story');

    expandBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = (btn as HTMLElement).dataset.target;
            if (targetId) {
                const target = document.getElementById(targetId);
                target?.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    const closePanel = (btn: Element) => {
        const panel = (btn as HTMLElement).closest('.full-story-panel');
        panel?.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => closePanel(btn));
    });

    backStoryBtns.forEach(btn => {
        btn.addEventListener('click', () => closePanel(btn));
    });
};

const setupSmoothScroll = () => {
    const startBtn = document.getElementById('start-journey');
    const topBtn = document.getElementById('return-top');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navMenu = document.getElementById('nav-links');
    const navToggle = document.getElementById('nav-toggle');

    startBtn?.addEventListener('click', () => {
        const aliSection = document.getElementById('ali');
        aliSection?.scrollIntoView({ behavior: 'smooth' });
    });

    topBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = (link as HTMLAnchorElement).getAttribute('href');
            if (targetId) {
                const target = document.querySelector(targetId);
                target?.scrollIntoView({ behavior: 'smooth' });
                
                // Close mobile menu after clicking
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
};

const setupNavbarEffect = () => {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
    // Initial check in case page is refreshed while scrolled
    if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
    }
};

const setupMobileMenu = () => {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-links');

    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu?.classList.toggle('active');
        
        // Prevent scroll when menu is open
        if (navMenu?.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (navMenu?.classList.contains('active') && 
            !navMenu.contains(target) && 
            !navToggle?.contains(target)) {
            navToggle?.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
};

window.addEventListener('DOMContentLoaded', () => {
    setupHeroAnimation();
    createStars();
    setupIntersectionObserver();
    setupStoryExpansion();
    setupSmoothScroll();
    setupQuiz();
    setupNavbarEffect();
    setupMobileMenu();
});

// Update animations for children
const style = document.createElement('style');
style.innerHTML = `
  .reveal-left, .reveal-right, .reveal-up, .animate-up {
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal-left { transform: translateX(-50px); }
  .reveal-right { transform: translateX(50px); }
  .reveal-up, .animate-up { transform: translateY(100px); }

  .visible .reveal-left, .visible .reveal-right, .visible .reveal-up, 
  .visible.reveal-left, .visible.reveal-right, .visible.animate-up, .visible.fade-in {
    opacity: 1; transform: translate(0, 0);
  }

  .fade-in { opacity: 0; transition: opacity 2s ease; }
  .visible.fade-in { opacity: 1; }
`;
document.head.appendChild(style);
