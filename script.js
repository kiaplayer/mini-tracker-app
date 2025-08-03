// Language management
class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.init();
    }

    init() {
        this.loadLanguageFromURL();
        this.loadLanguageFromStorage();
        this.detectBrowserLanguage();
        this.setupEventListeners();
        this.updateLanguage();
    }

    loadLanguageFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && ['en', 'ru'].includes(langParam)) {
            this.currentLang = langParam;
        }
    }

    loadLanguageFromStorage() {
        const savedLang = localStorage.getItem('minitracker_lang');
        if (savedLang && ['en', 'ru'].includes(savedLang)) {
            this.currentLang = savedLang;
        }
    }

    detectBrowserLanguage() {
        if (!localStorage.getItem('minitracker_lang')) {
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('ru')) {
                this.currentLang = 'ru';
            }
        }
    }

    setupEventListeners() {
        // Language switcher buttons
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });

        // Update URL when language changes
        window.addEventListener('popstate', () => {
            this.loadLanguageFromURL();
            this.updateLanguage();
        });
    }

    setLanguage(lang) {
        if (this.currentLang === lang) return;
        
        this.currentLang = lang;
        localStorage.setItem('minitracker_lang', lang);
        
        // Update URL without page reload
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.history.pushState({}, '', url);
        
        this.updateLanguage();
    }

    updateLanguage() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
        
        // Update all translatable elements
        const translatableElements = document.querySelectorAll('[data-en][data-ru]');
        translatableElements.forEach(element => {
            const translation = element.getAttribute(`data-${this.currentLang}`);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update language switcher buttons
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
        });

        // Update page title
        const titleElement = document.querySelector('title');
        if (titleElement) {
            const title = this.currentLang === 'ru' 
                ? 'MiniTracker - Приложение для записи GPS-треков'
                : 'MiniTracker - GPS Track Recording App';
            titleElement.textContent = title;
        }

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            const description = this.currentLang === 'ru'
                ? 'Простое и удобное приложение для записи GPS-треков на iOS. Создавайте маршруты, отслеживайте путешествия и сохраняйте их в формате GPX.'
                : 'Simple and convenient GPS track recording app for iOS. Create routes, track journeys, and save them in GPX format.';
            metaDescription.setAttribute('content', description);
        }

        // Update privacy policy link
        const privacyLink = document.querySelector('.privacy-link');
        if (privacyLink) {
            const href = this.currentLang === 'ru' ? 'privacy-ru.html' : 'privacy-en.html';
            privacyLink.href = href;
        }
    }
}

// Smooth scrolling for anchor links
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements for fade-in animation
        const fadeElements = document.querySelectorAll('.feature-card, .activity-item, .requirement-item');
        fadeElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
}

// Header scroll effect
class HeaderScrollEffect {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add/remove background blur based on scroll position
        if (currentScrollY > 50) {
            this.header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
            }
        } else {
            this.header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.header.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            }
        }

        this.lastScrollY = currentScrollY;
    }
}

// Screenshot hover effect
class ScreenshotEffect {
    constructor() {
        this.init();
    }

    init() {
        const screenshotContainers = document.querySelectorAll('.screenshot-container');
        screenshotContainers.forEach(container => {
            const lightTheme = container.querySelector('.light-theme');
            const darkTheme = container.querySelector('.dark-theme');
            
            if (lightTheme && darkTheme) {
                container.addEventListener('mouseenter', () => {
                    lightTheme.style.opacity = '0';
                    darkTheme.style.opacity = '1';
                });
                
                container.addEventListener('mouseleave', () => {
                    lightTheme.style.opacity = '1';
                    darkTheme.style.opacity = '0';
                });
            }
        });
    }
}

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    preloadResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }
}

// Accessibility improvements
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addSkipLinks();
        this.enhanceKeyboardNavigation();
        this.addAriaLabels();
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1001;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
            skipLink.style.opacity = '1';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
            skipLink.style.opacity = '0';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceKeyboardNavigation() {
        // Add keyboard navigation for language switcher
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach((btn, index) => {
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    }

    addAriaLabels() {
        // Add ARIA labels to interactive elements
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            const lang = btn.dataset.lang;
            btn.setAttribute('aria-label', `Switch to ${lang === 'en' ? 'English' : 'Russian'} language`);
        });

        // Add ARIA labels to screenshots
        const screenshots = document.querySelectorAll('.screenshot');
        screenshots.forEach(img => {
            if (img.classList.contains('light-theme')) {
                img.setAttribute('aria-label', 'MiniTracker app screenshot - light theme');
            } else if (img.classList.contains('dark-theme')) {
                img.setAttribute('aria-label', 'MiniTracker app screenshot - dark theme');
            }
        });
    }
}

// Initialize all classes when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageManager();
    new SmoothScroller();
    new AnimationObserver();
    new HeaderScrollEffect();
    new ScreenshotEffect();
    new PerformanceOptimizer();
    new AccessibilityEnhancer();
});

// Handle page visibility changes for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any animations or heavy operations
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible again
        document.body.classList.remove('page-hidden');
    }
});

// Handle resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Handle resize events after user stops resizing
        const event = new CustomEvent('resizeEnd');
        window.dispatchEvent(event);
    }, 250);
});

// Add loading state management
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove loading spinner if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
});

// Error handling for images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        console.warn('Failed to load image:', e.target.src);
        // You could add a fallback image here
    }
}, true); 