document.addEventListener('DOMContentLoaded', function() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // We'll update galleryItems after rendering
    let galleryItems = document.querySelectorAll('.gallery-item');
    
    // Helper to get visible items
    let visibleItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Lightbox functionality
    // Use gallery-config.json for static pagination
    var galleryData = [];
    var nextPage = 1;
    const pageSize = 10;

    // 1. Lazy Loading Images: use loading="lazy" on <img>
    // 2. Optimize Image Sizes: use Cloudinary transformation for thumbnails
    // 3. Minify and Bundle CSS/JS: (manual build step, not in JS)
    // 4. Defer Non-Essential JS: add defer to script tags in HTML (see gallery.html)
    // 6. Reduce DOM Size: only render visible items (pagination already does this)
    // 7. Cache JSON Data: use localStorage for gallery-config.json
    // 8. Preload Key Resources: add <link rel="preload"> in HTML (see gallery.html)
    // 10. Remove Unused CSS/JS: (manual, not in JS)

    // --- Caching gallery-config.json in localStorage ---
    function fetchAllGalleryData() {
        const cached = localStorage.getItem('gallery-config');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                galleryData = data.gallery.items.filter(item => item.imageSrc);
                nextPage = 1;
                renderGalleryItems(getCurrentPageItems(), true);
                addLoadMoreButton();
                // Also fetch in background to update cache
                fetchAndCacheGalleryData();
                return;
            } catch (e) {
                // Ignore and fetch fresh
            }
        }
        fetchAndCacheGalleryData();
    }
    function fetchAndCacheGalleryData() {
        fetch('gallery-config.json')
            .then(resp => resp.json())
            .then(data => {
                localStorage.setItem('gallery-config', JSON.stringify(data));
                galleryData = data.gallery.items.filter(item => item.imageSrc);
                nextPage = 1;
                renderGalleryItems(getCurrentPageItems(), true);
                addLoadMoreButton();
            })
            .catch(e => {
                console.error('Failed to load gallery-config.json:', e);
            });
    }

    // --- Render gallery items with lazy loading and optimized thumbnails ---
    function renderGalleryItems(data, clear = false) {
        const galleryContainer = document.getElementById('gallery-container');
        galleryContainer.innerHTML = '';
        data.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-category', item.category);
            galleryItem.setAttribute('data-id', item.id);
            // Use Cloudinary transformation for thumbnail (width 400, auto format, quality 70)
            let thumbUrl = item.imageSrc;
            if (thumbUrl && thumbUrl.includes('cloudinary.com')) {
                thumbUrl = thumbUrl.replace('/upload/', '/upload/w_600,f_auto,q_70/');
            }
            galleryItem.innerHTML = `
                <img src="${thumbUrl}" alt="${item.altText}" loading="lazy">
                <div class="gallery-item-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;
            galleryContainer.appendChild(galleryItem);
        });
        // Re-query gallery items and reattach event listeners
        galleryItems = document.querySelectorAll('.gallery-item');
        // Update visibleItems function to use the new galleryItems
        visibleItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');
        galleryItems.forEach(item => {
            item.addEventListener('click', function () {
                const visible = visibleItems();
                currentIndex = visible.indexOf(this);
                if (currentIndex !== -1) {
                    updateLightboxContent(this);
                    lightbox.classList.add('active');
                }
            });
        });
    }

    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption h3');
    const lightboxDesc = lightbox.querySelector('.lightbox-caption p');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    
    // Attach click listeners to initial gallery items (if any)
    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const visible = visibleItems();
            currentIndex = visible.indexOf(this);

            if (currentIndex !== -1) {
                updateLightboxContent(this);
                lightbox.classList.add('active');
            }
        });
    });

    function updateLightboxContent(item) {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-item-overlay h3');
        const desc = item.querySelector('.gallery-item-overlay p');

        lightboxImg.src = img ? img.src : '';
        lightboxCaption.textContent = caption ? caption.textContent : 'No Title';
        lightboxDesc.textContent = desc ? desc.textContent : 'No Description';
    }
    
    // Close lightbox
    lightboxClose.addEventListener('click', function () {
        lightbox.classList.remove('active');
    });
    
    // Click outside to close
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
    
    // Previous image
    lightboxPrev.addEventListener('click', function() {
        const visible = visibleItems();
        currentIndex = (currentIndex - 1 + visible.length) % visible.length;
        
        const item = visible[currentIndex];
        const img = item.querySelector('img');
        // Use correct selectors for overlay
        const caption = item.querySelector('.gallery-item-overlay h3');
        const desc = item.querySelector('.gallery-item-overlay p');
        
        lightboxImg.src = img ? img.src : '';
        lightboxCaption.textContent = caption ? caption.textContent : 'No Title';
        lightboxDesc.textContent = desc ? desc.textContent : 'No Description';
    });
    
    // Next image
    lightboxNext.addEventListener('click', function() {
        const visible = visibleItems();
        currentIndex = (currentIndex + 1) % visible.length;
        
        const item = visible[currentIndex];
        const img = item.querySelector('img');
        // Use correct selectors for overlay
        const caption = item.querySelector('.gallery-item-overlay h3');
        const desc = item.querySelector('.gallery-item-overlay p');
        
        lightboxImg.src = img ? img.src : '';
        lightboxCaption.textContent = caption ? caption.textContent : 'No Title';
        lightboxDesc.textContent = desc ? desc.textContent : 'No Description';
    });

    // Helper to get current page items for pagination
    function getCurrentPageItems() {
        return galleryData.slice(0, nextPage * pageSize);
    }

    // Add this function to fix the ReferenceError
    function addLoadMoreButton() {
        let btn = document.getElementById('load-more-btn');
        if (!btn) return;
        btn.style.display = (galleryData.length > nextPage * pageSize) ? 'block' : 'none';
        btn.onclick = loadMoreImages;
    }

    // Add this function to fix the ReferenceError
    function loadMoreImages() {
        nextPage++;
        renderGalleryItems(getCurrentPageItems(), true);
        addLoadMoreButton();
    }

    // Try to load images from the folder configuration
    fetchAllGalleryData();
});
