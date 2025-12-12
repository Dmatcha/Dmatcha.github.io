// Video Background Preloader for Individual Pages
// Include this script in all pages that use video backgrounds

(function() {
    'use strict';

    // Video loading states
    let videosLoaded = 0;
    let totalVideos = 0;
    let loadingTimeout;

    // Find all video backgrounds on the page
    function findVideoBackgrounds() {
        const videos = document.querySelectorAll('.video-bg');
        return Array.from(videos);
    }

    // Create loading overlay
    function createLoadingOverlay() {
        // Remove existing overlay
        const existing = document.querySelector('.video-loading-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'video-loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(45deg, #1a1a2e, #16213e);
            background-size: 400% 400%;
            animation: gradientShift 3s ease infinite;
            z-index: 9999;
            pointer-events: none;
        `;

        // Add gradient animation if not already present
        if (!document.querySelector('#video-loading-styles')) {
            const style = document.createElement('style');
            style.id = 'video-loading-styles';
            style.textContent = `
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);
        }

        // Add loading text
        const loadingText = document.createElement('div');
        loadingText.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: rgba(255, 255, 255, 0.8);
            font-family: sans-serif;
            font-size: 1.2rem;
            text-align: center;
        `;
        loadingText.innerHTML = 'Loading...';

        overlay.appendChild(loadingText);
        document.body.appendChild(overlay);
        
        return overlay;
    }

    // Remove loading overlay
    function removeLoadingOverlay() {
        const overlay = document.querySelector('.video-loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 0.5s ease';
            setTimeout(() => overlay.remove(), 500);
        }
    }

    // Add loading state to video wrapper
    function addLoadingState() {
        const videoWrappers = document.querySelectorAll('.video-wrapper');
        videoWrappers.forEach(wrapper => {
            wrapper.classList.add('video-loading');
        });
    }

    // Remove loading state from video wrapper
    function removeLoadingState() {
        const videoWrappers = document.querySelectorAll('.video-wrapper');
        videoWrappers.forEach(wrapper => {
            wrapper.classList.remove('video-loading');
        });
    }

    // Setup video loading handlers
    function setupVideoLoading(video) {
        const wrapper = video.closest('.video-wrapper');
        if (!wrapper) return;

        return new Promise((resolve) => {
            let hasLoaded = false;

            const onLoad = () => {
                if (!hasLoaded) {
                    hasLoaded = true;
                    videosLoaded++;
                    console.log(`Video loaded: ${video.src || video.currentSrc} (${videosLoaded}/${totalVideos})`);
                    
                    // Remove loading state for this video
                    wrapper.classList.remove('video-loading');
                    
                    if (videosLoaded >= totalVideos) {
                        finishLoading();
                    }
                    resolve();
                }
            };

            const onError = () => {
                if (!hasLoaded) {
                    hasLoaded = true;
                    videosLoaded++;
                    console.warn(`Video failed to load: ${video.src || video.currentSrc}`);
                    
                    // Still remove loading state even if failed
                    wrapper.classList.remove('video-loading');
                    
                    if (videosLoaded >= totalVideos) {
                        finishLoading();
                    }
                    resolve();
                }
            };

            // Check if video is already loaded
            if (video.readyState >= 3) { // HAVE_FUTURE_DATA
                onLoad();
                return;
            }

            // Set up event listeners
            video.addEventListener('loadeddata', onLoad, { once: true });
            video.addEventListener('canplaythrough', onLoad, { once: true });
            video.addEventListener('error', onError, { once: true });

            // Force loading
            video.load();
        });
    }

    // Finish loading process
    function finishLoading() {
        clearTimeout(loadingTimeout);
        removeLoadingOverlay();
        removeLoadingState();
        
        console.log('All videos loaded successfully');
        
        // Add a small delay for smooth transition
        setTimeout(() => {
            document.body.classList.add('videos-ready');
        }, 100);
    }

    // Initialize video loading
    function initializeVideoLoading() {
        const videos = findVideoBackgrounds();
        
        if (videos.length === 0) {
            console.log('No video backgrounds found');
            return;
        }

        totalVideos = videos.length;
        videosLoaded = 0;

        console.log(`Found ${totalVideos} video background(s)`);

        // Add loading states
        addLoadingState();
        createLoadingOverlay();

        // Set up loading timeout (fallback)
        loadingTimeout = setTimeout(() => {
            console.warn('Video loading timeout - showing page anyway');
            finishLoading();
        }, 5000); // 5 second timeout

        // Start loading all videos
        const loadingPromises = videos.map(video => setupVideoLoading(video));
        
        // Wait for all videos to load
        Promise.all(loadingPromises).then(() => {
            if (videosLoaded < totalVideos) {
                finishLoading();
            }
        });
    }

    // CSS for video loading states
    function addLoadingStyles() {
        if (document.querySelector('#video-preloader-styles')) return;

        const style = document.createElement('style');
        style.id = 'video-preloader-styles';
        style.textContent = `
            .video-loading {
                background: linear-gradient(45deg, #1a1a2e, #16213e) !important;
                background-size: 400% 400% !important;
            }
            
            .video-loading::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(26,26,46,0.3), rgba(22,33,62,0.3));
                z-index: 1;
            }
            
            body.videos-ready .video-loading::before {
                display: none;
            }
            
            /* Smooth transition for video opacity */
            .video-bg {
                transition: opacity 0.3s ease;
            }
            
            .video-loading .video-bg {
                opacity: 0;
            }
            
            body.videos-ready .video-loading .video-bg {
                opacity: 0.99;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    function init() {
        addLoadingStyles();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeVideoLoading);
        } else {
            // Small delay to ensure CSS is applied
            setTimeout(initializeVideoLoading, 100);
        }
    }

    // Start initialization
    init();

})();