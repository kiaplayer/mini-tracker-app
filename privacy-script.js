// Privacy Policy Language Switcher
class PrivacyLanguageManager {
    constructor() {
        this.currentLang = this.detectCurrentLanguage();
        this.init();
    }

    detectCurrentLanguage() {
        // Сначала проверяем localStorage для сохраненного языка
        const savedLang = localStorage.getItem('minitracker_lang');
        if (savedLang) {
            return savedLang;
        }

        // Определяем текущий язык по URL
        const currentPath = window.location.pathname;
        if (currentPath.includes('privacy-ru.html')) {
            return 'ru';
        } else if (currentPath.includes('privacy-en.html')) {
            return 'en';
        }
        
        // По умолчанию английский
        return 'en';
    }

    init() {
        this.setupLanguageButtons();
        this.updateActiveButton();
        this.updateBackLink();
    }

    setupLanguageButtons() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetLang = button.getAttribute('data-lang');
                this.switchLanguage(targetLang);
            });
        });
    }

    updateActiveButton() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            const buttonLang = button.getAttribute('data-lang');
            if (buttonLang === this.currentLang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    switchLanguage(targetLang) {
        if (targetLang === this.currentLang) {
            return; // Уже на нужном языке
        }

        // Сохраняем выбранный язык в localStorage
        localStorage.setItem('minitracker_lang', targetLang);

        // Обновляем текущий язык
        this.currentLang = targetLang;

        // Обновляем ссылку "Back to home" с новым языком
        this.updateBackLink();

        // Определяем целевую страницу
        let targetPage;
        if (targetLang === 'ru') {
            targetPage = 'privacy-ru.html';
        } else {
            targetPage = 'privacy-en.html';
        }

        // Перенаправляем на соответствующую страницу
        window.location.href = targetPage;
    }

    updateBackLink() {
        const backLink = document.querySelector('.back-link');
        if (backLink) {
            // Добавляем параметр языка к ссылке на главную
            const homeUrl = this.currentLang === 'ru' ? 'index.html?lang=ru' : 'index.html?lang=en';
            backLink.href = homeUrl;
        }
    }
}

// Header scroll effect
class HeaderScrollEffect {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }
}

// Accessibility enhancements
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addSkipLinks();
        this.enhanceKeyboardNavigation();
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
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.opacity = '1';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.opacity = '0';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    enhanceKeyboardNavigation() {
        // Улучшаем навигацию с клавиатуры для кнопок переключения языка
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PrivacyLanguageManager();
    new HeaderScrollEffect();
    new AccessibilityEnhancer();
}); 