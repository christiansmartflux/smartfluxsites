// SPA Router - Handles client-side navigation
(function() {
    let currentContent = null;
    let carouselTimeoutId = null;

    // Routes mapping - updated by language system
    function getRoutes() {
        const lang = window.smartfluxLang ? window.smartfluxLang.getCurrentLang() : 'en';
        const suffix = lang === 'nl' ? '-nl.html' : '.html';

        return {
            '/': `/content/home${suffix}`,
            '/about': `/content/about${suffix}`,
            '/case-studies': `/content/case-studies${suffix}`,
            '/services': `/content/services${suffix}`,
            '/werkwijze': `/content/werkwijze${suffix}`,
            '/portfolio': `/content/portfolio${suffix}`,
            '/console': `/content/console${suffix}`,
            '/console-experience': `/content/console-experience${suffix}`,
            '/contact': `/content/contact${suffix}`,
            '/legal/liability-ai-disclaimer': `/content/liability-ai-disclaimer${suffix}`,
            '/legal/data-processing-agreement': `/content/data-processing-agreement${suffix}`,
            '/legal/intellectual-property-rights': `/content/intellectual-property-rights${suffix}`,
            '/legal/service-level-agreement': `/content/service-level-agreement${suffix}`,
            '/legal/usage-api-billing': `/content/usage-api-billing${suffix}`,
            '/legal/terms-of-service': `/content/terms-of-service${suffix}`
        };
    }

    // Function to load content into the main container
    async function loadContent(path) {
        const contentContainer = document.getElementById('content-container');
        if (!contentContainer) return;

        const routes = getRoutes();
        const contentFile = routes[path] || routes['/'];

        try {
            const response = await fetch(`${contentFile}?t=${Date.now()}`);
            if (!response.ok) throw new Error('Page not found');

            const html = await response.text();

            // Remove previous content
            if (currentContent) {
                currentContent.remove();
            }

            // Insert new content
            contentContainer.innerHTML = `<div id="current-page-content">${html}</div>`;

            // Store reference to current content
            currentContent = document.getElementById('current-page-content');

            // Execute any scripts in the loaded content
            const scripts = currentContent.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                // Move script to document head to execute
                document.head.appendChild(newScript);
                script.remove();
            });

            // Update page title based on path
            updatePageTitle(path);

            // Update UI text with current language
            if (window.smartfluxLang) {
                window.smartfluxLang.updateUIText();
            }

            // Handle hash scroll after loading, or scroll to top if no hash
            const hash = window.location.hash;
            if (hash) {
                setTimeout(() => {
                    const element = document.getElementById(hash.slice(1));
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' }); // or start
                    }
                }, 100);
            } else {
                // Scroll to top when navigating to a new page without a hash
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // Highlight current nav link
            const navLinks = document.querySelectorAll('header nav a[href^="/"]:not(.logo-link)');
            navLinks.forEach(link => {
                const linkHref = link.getAttribute('href');
                if (linkHref === path || (path === '/' && linkHref === '/')) {
                    link.classList.add('text-brand-blue');
                    link.classList.remove('text-gray-600');
                } else {
                    link.classList.add('text-gray-600');
                    link.classList.remove('text-brand-blue');
                }
            });

            // Cancel any previous timeouts
            if (carouselTimeoutId) {
                clearTimeout(carouselTimeoutId);
                carouselTimeoutId = null;
            }

            // Initialize carousel if dots nav exists (for home page)
            if (path === '/' && typeof initCarousel === 'function') {
                carouselTimeoutId = setTimeout(() => {
                    initCarousel();
                }, 100);
            }

            // Initialize home case studies carousel if it exists
            if (path === '/' && typeof initHomeCaseStudiesCarousel === 'function') {
                carouselTimeoutId = setTimeout(() => {
                    initHomeCaseStudiesCarousel();
                }, 100);
            }

            // Initialize case studies carousel if it exists
            if (path === '/case-studies' && typeof initCaseStudiesCarousel === 'function') {
                carouselTimeoutId = setTimeout(() => {
                    initCaseStudiesCarousel();
                }, 100);
            }

        } catch (error) {
            console.error('Error loading page:', error);
            contentContainer.innerHTML = '<div id="current-page-content"><h2>Error: Could not load page.</h2></div>';
            currentContent = document.getElementById('current-page-content');
        }
    }

    // Update document title
    function updatePageTitle(path) {
        const titles = {
            '/': 'smartflux - Custom AI Solutions',
            '/about': 'About Us - smartflux',
            '/case-studies': 'Case Studies - smartflux',
            '/services': 'Diensten - smartflux sites',
            '/werkwijze': 'Werkwijze - smartflux sites',
            '/portfolio': 'Portfolio - smartflux sites',
            '/console': 'Console - smartflux',
            '/console-experience': 'Experience the Console - smartflux',
            '/contact': 'Contact - smartflux',
            '/legal/liability-ai-disclaimer': 'Liability & AI Disclaimer - smartflux',
            '/legal/data-processing-agreement': 'Data Processing Agreement (DPA) - smartflux',
            '/legal/intellectual-property-rights': 'Intellectual Property Rights - smartflux',
            '/legal/service-level-agreement': 'Service Level Agreement (SLA) - smartflux',
            '/legal/usage-api-billing': 'Usage & API Billing - smartflux',
            '/legal/terms-of-service': 'Terms of Service - smartflux'
        };
        document.title = titles[path] || titles['/'];
    }

    // Initialize router
    function initRouter() {
        // Intercept navigation link clicks
        document.addEventListener('click', (event) => {
            // Check if clicked element is a navigation link
            if (event.target.matches('a[href^="/"]') || event.target.closest('a[href^="/"]')) {
                const link = event.target.matches('a[href^="/"]') ? event.target : event.target.closest('a[href^="/"]');
                const href = link.getAttribute('href');

                // Only handle internal routes (starting with /)
                const routes = getRoutes();
                if (routes[href] || href === '/' || href.includes('#')) {
                    const currentPath = window.location.pathname;
                    if (href === '/' && currentPath === '/') {
                        // If already on home, scroll to top smoothly
                        document.querySelector('#top').scrollIntoView({ behavior: 'smooth', block: 'start' });
                        return;
                    }
                    event.preventDefault();
                    navigateToHref(href);
                }
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            const path = window.location.pathname;
            loadContent(path);
        });

        // Load initial content based on URL
        const initialPath = window.location.pathname;
        loadContent(initialPath);
    }

    // Navigate to a new page, supporting href with hash
    function navigateToHref(href) {
        // Update browser history with full href (path + hash)
        history.pushState({}, '', href);

        // Extract path for loading content
        const path = new URL(href, window.location.origin).pathname;
        loadContent(path);
    }

    // Navigate to a new page (legacy, without hash)
    function navigateTo(path) {
        navigateToHref(path);
    }

    // Make router available globally for debugging
    window.smartfluxRouter = {
        navigate: navigateTo,
        load: loadContent
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRouter);
    } else {
        initRouter();
    }

})();
