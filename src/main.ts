import './style.css';
import { setupQuiz } from './quiz';

// HERO ANIMATION SETUP
const setupHeroAnimation = () => {
    const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const root = document.getElementById('hero-animation');

    if (!canvas || !context || !root) return;

    const startFrame = 1;
    const endFrame = 85;
    const frameCount = endFrame - startFrame + 1;

    const currentFrame = (index: number) => (
        `/hero-frames-v2/${index.toString().padStart(5, '0')}.png`
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
                if (loadedCount === 1) {
                    // Render first frame as soon as it's ready
                    renderFrame(startFrame);
                }
                if (loadedCount === frameCount) {
                    handleScroll();
                }
            };
            images.push(img);
        }
    };

    const updateCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    const renderFrame = (index: number) => {
        const imageIndex = index - startFrame;
        const image = images[imageIndex];
        if (!image || !image.complete || image.naturalWidth === 0) return;

        const imgWidth = image.width;
        const imgHeight = image.height;
        const screenWidth = canvas.width;
        const screenHeight = canvas.height;

        const ratio = Math.max(screenWidth / imgWidth, screenHeight / imgHeight);
        const newWidth = imgWidth * ratio;
        const newHeight = imgHeight * ratio;

        const x = (screenWidth - newWidth) / 2;
        const y = (screenHeight - newHeight) / 2;

        context.imageSmoothingEnabled = true; // Set to true for smoother transitions
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
        updateCanvasSize();
        handleScroll();
    });

    updateCanvasSize();
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
        if (aliSection) {
            const targetPosition = aliSection.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1500; // 1.5 seconds for a cinematic but snappier feel
            let startTime: number | null = null;

            const animation = (currentTime: number) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                
                // Quadratic ease-in-out for smooth start and end
                const ease = (t: number, b: number, c: number, d: number) => {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                };

                const nextScroll = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, nextScroll);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };

            requestAnimationFrame(animation);
        }
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

// FLIPBOOK LOGIC
const setupFlipbook = () => {
    const openBtn = document.getElementById('open-ebook');
    const closeBtn = document.getElementById('close-ebook');
    const overlay = document.getElementById('ebook-overlay');
    const flipbookEl = document.getElementById('flipbook');
    const loading = document.getElementById('ebook-loading');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const currentNum = document.getElementById('current-page-num');
    const totalNum = document.getElementById('total-pages-num');

    if (!openBtn || !overlay || !flipbookEl) return;

    let pageFlip: any = null;
    let isInitialized = false;

    const initPageFlip = async () => {
        if (isInitialized) return;
        
        loading?.style.setProperty('display', 'block');
        
        try {
            // @ts-ignore
            const pdfjsLib = window['pdfjsLib'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            const loadingTask = pdfjsLib.getDocument('/ebook.pdf');
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            if (totalNum) totalNum.textContent = numPages.toString();

            // Render all pages to canvases
            for (let i = 1; i <= numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                
                const pageDiv = document.createElement('div');
                pageDiv.className = 'page';
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                await page.render({ canvasContext: context!, viewport }).promise;
                pageDiv.appendChild(canvas);
                flipbookEl.appendChild(pageDiv);
            }

            // Initialize StPageFlip
            const isMobile = window.innerWidth <= 768;
            // @ts-ignore
            pageFlip = new St.PageFlip(flipbookEl, {
                width: isMobile ? 320 : 600, // base page width
                height: isMobile ? 480 : 800, // base page height
                size: "stretch",
                minWidth: 315,
                maxWidth: 1000,
                minHeight: 420,
                maxHeight: 1350,
                maxShadowOpacity: 0.5,
                showCover: true,
                mobileScrollSupport: true,
                usePortrait: isMobile,
                flippingTime: 800
            });

            pageFlip.loadFromHTML(document.querySelectorAll('.page'));

            // Handlers
            pageFlip.on('flip', (e: any) => {
                if (currentNum) currentNum.textContent = (e.data + 1).toString();
            });

            prevBtn?.addEventListener('click', () => pageFlip.flipPrev());
            nextBtn?.addEventListener('click', () => pageFlip.flipNext());

            flipbookEl.classList.add('loaded');
            loading?.style.setProperty('display', 'none');
            isInitialized = true;

        } catch (error) {
            console.error("Flipbook Error:", error);
            if (loading) loading.innerHTML = `<p style="color:red">Failed to load manuscript. Please try again.</p>`;
        }
    };

    openBtn.addEventListener('click', () => {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (!isInitialized) initPageFlip();
    });

    closeBtn?.addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Fullscreen support
    document.getElementById('fullscreen-ebook')?.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            overlay.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
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
    setupFlipbook();
});

// Update animations for children
const style = document.createElement('style');
style.innerHTML = `
  .reveal-left, .reveal-right, .reveal-up, .animate-up {
    opacity: 0;
    transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal-left { transform: translateX(-100px); }
  .reveal-right { transform: translateX(100px); }
  .reveal-up, .animate-up { transform: translateY(100px); }

  .visible .reveal-left, .visible .reveal-right, .visible .reveal-up, 
  .visible.reveal-left, .visible.reveal-right, .visible.animate-up, .visible.fade-in {
    opacity: 1; transform: translate(0, 0);
  }

  .fade-in { opacity: 0; transition: opacity 2s ease; }
  .visible.fade-in { opacity: 1; }
`;
document.head.appendChild(style);
