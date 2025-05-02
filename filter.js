document.addEventListener('DOMContentLoaded', function() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
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
    });
    
    // Lightbox functionality
    

    const galleryData = [
        // The structure will be populated from the server
        // Example structure for reference:
        // {
        //     id: 1,
        //     category: "reunions",
        //     imageSrc: "images/gallery/reunions/2020_reunion.jpg",
        //     altText: "2020 Class Reunion",
        //     title: "2020 Class Reunion",  
        //     description: "Alumni gathering at the school auditorium"
        // }
    ];
    
    // Function to load gallery images from a folder
    let loadedGalleryData = []; // Declare a variable to store the response globally

    function loadImagesFromFolder() {
        // In a real-world scenario, you would have a server-side script
        // that reads the folder and returns the list of images
        fetch('gallery-config.json')
            .then(response => response.json())
            .then(data => {
                // Store the loaded data globally
                loadedGalleryData = data;

                // Store the loaded data in galleryData
                galleryData.length = 0; // Clear existing data
                Array.prototype.push.apply(galleryData, data);
                
                // Render the gallery with the new data
                renderGalleryItems();
            })
            .catch(error => {
                console.error('Error loading gallery data:', error);
                // Fallback to demo data if loading fails
            });
    }

   

   

    function renderGalleryItems(data = galleryData) {
        const galleryContainer = document.getElementById('gallery-container');
        galleryContainer.innerHTML = ''; // Clear existing content

        data.forEach(item => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-category', item.category);
            galleryItem.setAttribute('data-id', item.id);

            galleryItem.innerHTML = `
                <img src="${item.imageSrc}" alt="${item.altText}">
                <div class="gallery-item-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;

            galleryContainer.appendChild(galleryItem);
        });

        // Re-query gallery items and reattach event listeners
        const galleryItems = document.querySelectorAll('.gallery-item');
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
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let currentIndex = 0;
    const visibleItems = () => Array.from(galleryItems).filter(item => item.style.display !== 'none');
    
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
        const caption = item.querySelector('.gallery-caption h3');
        const desc = item.querySelector('.gallery-caption p');
        
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption.textContent;
        lightboxDesc.textContent = desc.textContent;
    });
    
    // Next image
    lightboxNext.addEventListener('click', function() {
        const visible = visibleItems();
        currentIndex = (currentIndex + 1) % visible.length;
        
        const item = visible[currentIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption h3');
        const desc = item.querySelector('.gallery-caption p');
        
        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption.textContent;
        lightboxDesc.textContent = desc.textContent;
    });

    document.addEventListener('DOMContentLoaded', function() {
        // Try to load images from the folder configuration
        loadImagesFromFolder();
        
    });
