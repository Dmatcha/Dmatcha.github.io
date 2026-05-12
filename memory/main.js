// AFTS Website - Main JavaScript

// Toggle sidebar on mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebar && overlay) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}

// Initialize navigation expand/collapse
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        if (item.querySelector('.chevron')) {
            item.addEventListener('click', function(e) {
                // Only toggle if it's a parent with children (has chevron)
                const children = this.nextElementSibling;
                if (children && children.classList.contains('nav-children')) {
                    e.preventDefault();
                    this.classList.toggle('expanded');
                }
            });
        }
    });
}

// Highlight active page in navigation
function highlightActivePage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-item, .nav-child');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.endsWith(href)) {
            link.classList.add('active');

            // Expand parent if it's a child
            const parent = link.closest('.nav-children');
            if (parent) {
                const parentItem = parent.previousElementSibling;
                if (parentItem && parentItem.classList.contains('nav-item')) {
                    parentItem.classList.add('expanded');
                }
            }
        }
    });
}

// Search functionality (placeholder for future implementation)
function initializeSearch() {
    const searchTrigger = document.querySelector('.search-trigger');

    if (searchTrigger) {
        searchTrigger.addEventListener('click', function() {
            // Future: Implement modal search
            alert('Search functionality will be implemented in a future update.');
        });
    }

    // Keyboard shortcut for search
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchModal = document.querySelector('.search-modal');
            if (searchModal) {
                searchModal.classList.add('open');
            }
        }

        if (e.key === 'Escape') {
            const searchModal = document.querySelector('.search-modal');
            if (searchModal) {
                searchModal.classList.remove('open');
            }
        }
    });
}

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update URL without scrolling
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// Copy code blocks functionality
function initializeCodeCopy() {
    document.querySelectorAll('pre').forEach(pre => {
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
        copyBtn.title = 'Copy code';

        copyBtn.addEventListener('click', async function() {
            const code = pre.querySelector('code');
            if (code) {
                try {
                    await navigator.clipboard.writeText(code.textContent);
                    copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    copyBtn.classList.add('copied');

                    setTimeout(() => {
                        copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                        copyBtn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            }
        });

        pre.style.position = 'relative';
        pre.appendChild(copyBtn);
    });
}

// Initialize all functionality on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    highlightActivePage();
    initializeSearch();
    initializeSmoothScroll();
    initializeCodeCopy();
});