// Language System for SmartFlux SPA
(function() {
    // Translation data
    const translations = {
        en: {
            // Navigation
            nav_home: 'Home',
            nav_case_studies: 'Case Studies',
            nav_about: 'About Us',
            nav_contact: 'Contact',
            nav_services: 'Services',
            nav_services_main: 'Our Services',
            nav_werkwijze: 'How We Work',
            nav_portfolio: 'Portfolio',
            nav_console_cta: 'Get in touch',

            // Footer
            footer_quick_links: 'Quick Links',
            footer_location: 'Location',
            footer_hours: 'Hours',
            footer_contact: 'Contact',
            footer_hours_days: 'Monday—Friday',
            footer_hours_time: '8am — 6pm',
            footer_designed_by: 'Website designed and operated by smartflux',
            footer_rights: '© 2025 smartflux. All rights reserved.',
            footer_legal: 'Legal',
            legal_terms_of_service: 'Terms of Service',
            legal_liability_disclaimer: 'Liability & AI Disclaimer',
            legal_dpa: 'Data Processing Agreement',
            legal_ip_rights: 'Intellectual Property Rights',
            legal_sla: 'Service Level Agreement',
            legal_usage_api_billing: 'Usage & API Billing'
        },
        nl: {
            // Navigation
            nav_home: 'Home',
            nav_case_studies: 'Case Studies',
            nav_about: 'Over Ons',
            nav_contact: 'Contact',
            nav_services: 'Diensten',
            nav_services_main: 'Onze Diensten',
            nav_werkwijze: 'Werkwijze',
            nav_portfolio: 'Portfolio',
            nav_console_cta: 'Neem contact op',

            // Footer
            footer_quick_links: 'Snelle Links',
            footer_location: 'Locatie',
            footer_hours: 'Openingstijden',
            footer_contact: 'Contact',
            footer_hours_days: 'Maandag—Vrijdag',
            footer_hours_time: '8:00 — 18:00',
            footer_designed_by: 'Website ontworpen en beheerd door smartflux',
            footer_rights: '© 2025 smartflux. Alle rechten voorbehouden.',
            footer_legal: 'Juridisch',
            legal_terms_of_service: 'Algemene Voorwaarden',
            legal_liability_disclaimer: 'Aansprakelijkheid & AI Disclaimer',
            legal_dpa: 'Verwerkersovereenkomst',
            legal_ip_rights: 'Intellectuele Eigendomsrechten',
            legal_sla: 'Service Level Agreement',
            legal_usage_api_billing: 'Gebruik & API-facturatie'
        }
    };

    // Get current language from localStorage or default to 'nl'
    let currentLang = localStorage.getItem('smartflux_lang') || 'nl';

    // Function to get translation
    function t(key) {
        return translations[currentLang][key] || translations.en[key] || key;
    }

    // Function to set language
    function setLanguage(lang) {
        if (!translations[lang]) return;

        currentLang = lang;
        localStorage.setItem('smartflux_lang', lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update UI elements
        updateUIText();
        updateLanguageButton();

        // Reload current page content with new language
        if (window.smartfluxRouter) {
            const currentPath = window.location.pathname;
            window.smartfluxRouter.load(currentPath);
        }
    }

    // Function to toggle language
    function toggleLanguage() {
        const newLang = currentLang === 'en' ? 'nl' : 'en';
        setLanguage(newLang);
    }

    // Function to update UI text elements
    function updateUIText() {
        // Update navigation
        const navElements = {
            'nav-home': 'nav_home',
            'nav-case-studies': 'nav_case_studies',
            'nav-about': 'nav_about',
            'nav-contact': 'nav_contact',
            'nav-console': 'nav_console'
        };

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                element.textContent = translations[currentLang][key];
            }
        });
    }

    // Function to update language button
    function updateLanguageButton() {
        const buttons = [document.getElementById('lang-toggle'), document.getElementById('lang-toggle-mobile')].filter(Boolean);
        if (!buttons.length) return;

        buttons.forEach(button => {
            const code = button.querySelector('.lang-code');
            if (!code) return;
            if (currentLang === 'en') {
                code.textContent = 'NL'; // show target language
                button.title = 'Switch to Dutch';
            } else {
                code.textContent = 'EN'; // show target language
                button.title = 'Schakel naar Engels';
            }
        });
    }

    // Function to get content file path based on language
    function getContentPath(path) {
        const routes = {
            '/': currentLang === 'nl' ? 'content/home-nl.html' : 'content/home.html',
            '/about': currentLang === 'nl' ? 'content/about-nl.html' : 'content/about.html',
            '/case-studies': currentLang === 'nl' ? 'content/case-studies-nl.html' : 'content/case-studies.html',
            '/services': currentLang === 'nl' ? 'content/services-nl.html' : 'content/services.html',
            '/werkwijze': currentLang === 'nl' ? 'content/werkwijze-nl.html' : 'content/werkwijze.html',
            '/portfolio': currentLang === 'nl' ? 'content/portfolio-nl.html' : 'content/portfolio.html',
            '/contact': currentLang === 'nl' ? 'content/contact-nl.html' : 'content/contact.html'
        };

        return routes[path] || (currentLang === 'nl' ? 'content/home-nl.html' : 'content/home.html');
    }

    // Initialize language system
    function initLanguageSystem() {
        // Set initial language
        document.documentElement.lang = currentLang;
        updateUIText();
        updateLanguageButton();

        // Add event listener to language toggle button
        const langToggles = [document.getElementById('lang-toggle'), document.getElementById('lang-toggle-mobile')].filter(Boolean);
        langToggles.forEach(btn => btn.addEventListener('click', () => {
            toggleLanguage();
            const menu = document.getElementById('mobile-menu');
            const menuToggle = document.getElementById('mobile-menu-toggle');
            if (menu && !menu.classList.contains('hidden')) {
                menu.classList.add('hidden');
                if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
            }
        }));
    }

    // Make functions globally available
    window.smartfluxLang = {
        t: t,
        setLanguage: setLanguage,
        toggleLanguage: toggleLanguage,
        getCurrentLang: () => currentLang,
        getContentPath: getContentPath,
        updateUIText: updateUIText
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageSystem);
    } else {
        initLanguageSystem();
    }

})();
