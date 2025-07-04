// Page loader utility
class PageLoader {
    constructor() {
        this.loadedPages = new Map();
        this.currentPage = 'about';
        this.contentContainer = null;
    }

    async init() {
        this.contentContainer = document.querySelector('.content-container');
        await this.loadPage('about', true); // Load about page by default
        this.setupNavigation();
    }

    async loadPage(pageName, setActive = false) {
        // Check if page is already loaded
        if (this.loadedPages.has(pageName)) {
            if (setActive) {
                this.showPage(pageName);
            }
            return this.loadedPages.get(pageName);
        }

        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load ${pageName} page`);
            }
            
            const html = await response.text();
            this.loadedPages.set(pageName, html);
            
            if (setActive) {
                this.showPage(pageName);
            }
            
            return html;
        } catch (error) {
            console.error(`Error loading ${pageName} page:`, error);
            return null;
        }
    }

    showPage(pageName) {
        const pageHtml = this.loadedPages.get(pageName);
        if (!pageHtml) return;

        // Clear current content
        this.contentContainer.innerHTML = pageHtml;
        
        // Update current page
        this.currentPage = pageName;
        
        // Update the article visibility classes
        const article = this.contentContainer.querySelector('article');
        if (article) {
            article.classList.remove('hidden');
            article.classList.add('active');
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('[data-nav-link]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                const pageName = e.target.textContent.toLowerCase();
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active', 'text-accent'));
                e.target.classList.add('active', 'text-accent');
                
                // Load and show the page
                await this.loadPage(pageName);
                
                // Animate page transition
                this.animatePageTransition(pageName);
                
                // Scroll to top
                window.scrollTo(0, 0);
            });
        });
    }

    animatePageTransition(pageName) {
        const currentArticle = this.contentContainer.querySelector('article');
        
        if (currentArticle) {
            // Animate out current page
            gsap.to(currentArticle, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: 'power1.in',
                onComplete: () => {
                    // Show new page
                    this.showPage(pageName);
                    
                    // Animate in new page
                    const newArticle = this.contentContainer.querySelector('article');
                    if (newArticle) {
                        gsap.fromTo(newArticle,
                            { opacity: 0, y: -20 },
                            { opacity: 1, y: 0, duration: 0.4, ease: 'power1.out' }
                        );
                    }
                    
                    // Re-initialize any page-specific functionality
                    this.initializePageFeatures(pageName);
                }
            });
        }
    }

    initializePageFeatures(pageName) {
        // Portfolio page filtering
        if (pageName === 'portfolio') {
            this.initPortfolioFiltering();
        }
        
        // Contact form handling
        if (pageName === 'contact') {
            this.initContactForm();
        }
    }

    initPortfolioFiltering() {
        const filterBtns = document.querySelectorAll('[data-filter-btn]');
        const projectItems = document.querySelectorAll('[data-filter-item]');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const filterValue = this.textContent.toLowerCase();

                filterBtns.forEach(b => b.classList.remove('active', 'bg-accent', 'text-white'));
                this.classList.add('active', 'bg-accent', 'text-white');

                // Animate out items
                gsap.to(projectItems, {
                    opacity: 0,
                    scale: 0.9,
                    duration: 0.3,
                    stagger: 0.05,
                    ease: 'power1.in',
                    onComplete: () => {
                        // Filter and show relevant items
                        projectItems.forEach(item => {
                            const itemCategory = item.dataset.category.toLowerCase();
                            const shouldShow = filterValue === 'all' || itemCategory.includes(filterValue);
                            item.style.display = shouldShow ? '' : 'none';
                        });

                        // Animate in filtered items
                        gsap.to(projectItems, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.3,
                            stagger: 0.05,
                            ease: 'power1.out'
                        });
                    }
                });
            });
        });
    }

    initContactForm() {
        const form = document.querySelector('[data-form]');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Add your form submission logic here
                alert('Form submitted! (This is a demo)');
            });
        }
    }
}

// Initialize page loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const pageLoader = new PageLoader();
    pageLoader.init();
});
