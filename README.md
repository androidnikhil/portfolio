# Portfolio Website - Modular Structure

This portfolio website has been restructured to use a modular approach where each navigation section is separated into its own file for better maintainability and organization.

## File Structure

```
portfolio/
├── index.html                 # Main HTML file with layout and navigation
├── assets/
│   ├── css/
│   │   └── style.css         # Main styles
│   ├── js/
│   │   ├── script.js         # Core functionality (sidebar, form validation)
│   │   └── pageLoader.js     # Dynamic page loading system
│   └── images/               # All image assets
├── pages/                    # Individual page components
│   ├── about.html           # About page content
│   ├── resume.html          # Resume page content
│   ├── portfolio.html       # Portfolio page content
│   ├── blog.html            # Blog page content
│   └── contact.html         # Contact page content
└── README.md               # This file
```

## Features

### Dynamic Page Loading
- Pages are loaded dynamically using JavaScript fetch API
- Smooth animations between page transitions using GSAP
- Caching system to avoid reloading the same page multiple times

### Modular Architecture
- Each navigation section is in its own HTML file in the `pages/` directory
- Common layout elements (sidebar, navigation) remain in the main `index.html`
- JavaScript functionality is split into logical modules

### Page-Specific Features
- **Portfolio**: Interactive filtering system for projects
- **Contact**: Form validation and submission handling
- **All Pages**: Smooth animations and responsive design

## How It Works

1. **Initial Load**: The `about.html` page loads by default
2. **Navigation**: Clicking nav links triggers the page loader to fetch and display the corresponding page
3. **Caching**: Once a page is loaded, it's cached in memory for faster subsequent access
4. **Animations**: GSAP handles smooth transitions between pages

## Development

### Adding New Pages
1. Create a new HTML file in the `pages/` directory
2. Add the navigation link to the navbar in `index.html`
3. The page loader will automatically handle the new page

### Modifying Existing Pages
- Edit the corresponding file in the `pages/` directory
- Changes will be reflected when the page is loaded/reloaded

### Adding Page-Specific Functionality
- Add your JavaScript code to the `initializePageFeatures()` method in `pageLoader.js`
- Use the page name to conditionally execute code for specific pages

## Browser Compatibility
- Modern browsers with ES6+ support
- Fetch API support required
- GSAP 3.12+ for animations

## Performance Benefits
- Smaller initial page load (only loads about page initially)
- Lazy loading of other pages
- Cached pages for faster navigation
- Reduced HTML duplication
