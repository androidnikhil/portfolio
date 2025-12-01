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
            this.loadProjects();
        }
        
        // Contact form handling
        if (pageName === 'contact') {
            this.initContactForm();
        }

        // Blog page handling
        if (pageName === 'blog') {
            this.initBlogLinks();
        }

        // Blog detail page handling
        if (pageName.startsWith('blog-')) {
            this.initBlogDetail();
            this.initAccordion();
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
        const formBtn = document.querySelector('[type="submit"]');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Check Honeypot
                const honeypot = form.querySelector('[name="_gotcha"]');
                if (honeypot && honeypot.value) {
                    // If honeypot is filled, it's a bot. Silently fail or show generic error.
                    console.log('Bot detected via honeypot.');
                    return;
                }

                // Show loading state
                const originalBtnText = formBtn.innerHTML;
                formBtn.innerHTML = '<span>Sending...</span>';
                formBtn.disabled = true;

                // Replace these with your actual Service ID and Template ID
                const serviceID = 'service_8li7jzn';
                const templateID = 'template_69yq1ef';

                emailjs.sendForm(serviceID, templateID, form)
                    .then(() => {
                        formBtn.innerHTML = '<span>Message Sent!</span>';
                        alert('Message sent successfully!');
                        form.reset();
                        
                        setTimeout(() => {
                            formBtn.innerHTML = originalBtnText;
                            formBtn.disabled = false;
                        }, 3000);
                    }, (err) => {
                        formBtn.innerHTML = '<span>Failed!</span>';
                        alert(JSON.stringify(err));
                        console.error('EmailJS Error:', err);
                        
                        setTimeout(() => {
                            formBtn.innerHTML = originalBtnText;
                            formBtn.disabled = false;
                        }, 3000);
                    });
            });
        }
    }

    initBlogLinks() {
        const blogLinks = document.querySelectorAll('[data-blog-link]');
        blogLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const pageName = link.dataset.blogLink;
                await this.loadPage(pageName);
                this.animatePageTransition(pageName);
                window.scrollTo(0, 0);
            });
        });
    }

    initBlogDetail() {
        const backBtn = document.querySelector('[data-back-to-blog]');
        if (backBtn) {
            backBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.loadPage('blog');
                this.animatePageTransition('blog');
                window.scrollTo(0, 0);
            });
        }
    }

    initAccordion() {
        const accordionBtns = document.querySelectorAll('[data-accordion-btn]');
        
        accordionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('ion-icon');
                
                // Check if currently open
                const isOpen = !content.classList.contains('hidden');
                
                if (isOpen) {
                    // Close
                    gsap.to(content, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            content.classList.add('hidden');
                            content.style.height = ''; // Reset height
                        }
                    });
                    gsap.to(icon, { rotation: 0, duration: 0.3 });
                } else {
                    // Open
                    content.classList.remove('hidden');
                    gsap.fromTo(content, 
                        { height: 0, opacity: 0 },
                        { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' }
                    );
                    gsap.to(icon, { rotation: 180, duration: 0.3 });
                }
            });
        });
    }

    async loadProjects() {
        try {
            const response = await fetch('assets/data/projects.json');
            if (!response.ok) {
                throw new Error('Failed to load projects data');
            }
            const projects = await response.json();
            this.renderProjects(projects);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    renderProjects(projects) {
        const projectList = document.querySelector('.project-list');
        if (!projectList) return;

        projectList.innerHTML = projects.map(project => `
            <li class="project-item active" data-filter-item data-category="${project.category.toLowerCase()}">
                <a href="${project.link}" target="_blank" class="block group">
                    <figure class="project-img relative rounded-xl overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105">
                        <div class="project-item-icon-box absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <ion-icon name="eye-outline"></ion-icon>
                        </div>
                        <img src="${project.image}" alt="${project.title}" loading="lazy" class="w-full h-auto object-cover">
                    </figure>
                    <h3 class="project-title text-lg font-semibold mt-4">${project.title}</h3>
                    <p class="project-category text-sm text-gray-500">${project.category}</p>
                    <p class="text-xs text-gray-400 mt-1">${project.techStack}</p>
                </a>
            </li>
        `).join('');

        // Re-initialize filtering after rendering
        this.initPortfolioFiltering();
    }
}

// Initialize page loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const pageLoader = new PageLoader();
    pageLoader.init();
});
