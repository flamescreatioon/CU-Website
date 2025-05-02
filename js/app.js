const hero = document.getElementById("hero");

document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded'); // Debugging log

    const images = [
        'url("assets/IMG_7511.jpg")',
        'url("assets/IMG_7526.jpg")',
        'url("assets/IMG_7827.jpg")',
        'url("assets/IMG_7830.jpg")',
        'url("assets/IMG_8071.jpg")',
        'url("assets/TOK_5197.jpg")',
        'url("assets/TOK_5246.jpg")',
        'url("assets/TOK_5292.jpg")',
        'url("assets/TOK_5327.jpg")',
    ];
    let currentIndex = 0;
    let gradient = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0,0,0,0.7))';

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        hero.style.backgroundImage = `${gradient}, ${images[currentIndex]}`;
    }, 10000);

    // Countdown Timer
    const countdownItems = document.querySelectorAll('.countdown-item');

    if (countdownItems.length === 0) {
        console.log('No countdown items found. Skipping countdown logic.');
    } else {
        console.log('Countdown items found. Initializing countdown.');

        const countdownDate = new Date('July 27, 2025 00:00:00').getTime();

        function updateCountdown() {
            const now = new Date().getTime();
            const timeLeft = countdownDate - now;

            if (timeLeft > 0) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                countdownItems[0].querySelector('.countdown-days').textContent = days;
                countdownItems[1].querySelector('.countdown-hours').textContent = hours;
                countdownItems[2].querySelector('.countdown-minutes').textContent = minutes;
                countdownItems[3].querySelector('.countdown-seconds').textContent = seconds;
            } else {
                // If the countdown is over
                countdownItems.forEach(item => {
                    item.querySelector('.countdown-number').textContent = '0';
                });
                console.log('Countdown completed.');
            }
        }

        // Update countdown every second
        setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call to set the countdown immediately
    }

    // Animate Progress Bar
    const progressBar = document.querySelector('.progress-bar-inner');
    const progressPercentage = progressBar.textContent.trim();

    function animateProgressBar() {
        let width = 0;
        const targetWidth = parseInt(progressPercentage.replace('%', ''), 10);
        const interval = setInterval(() => {
            if (width >= targetWidth) {
                clearInterval(interval);
            } else {
                width++;
                progressBar.style.width = `${width}%`;
                progressBar.textContent = `${width}%`;
            }
        }, 20); // Adjust speed by changing the interval time
    }

    // Animate Project Stats
    const statItems = document.querySelectorAll('.stat-item .stat-number');

    function animateStats() {
        statItems.forEach((stat) => {
            const targetValue = parseInt(stat.textContent.replace(/[^\d]/g, ''), 10);
            let currentValue = 0;
            const increment = Math.ceil(targetValue / 100); // Adjust increment for smoother animation
            const interval = setInterval(() => {
                if (currentValue >= targetValue) {
                    clearInterval(interval);
                    stat.textContent = stat.textContent.includes('₦')
                        ? `₦ ${targetValue.toLocaleString()}`
                        : `${targetValue}`;
                } else {
                    currentValue += increment;
                    stat.textContent = stat.textContent.includes('₦')
                        ? `₦ ${currentValue.toLocaleString()}`
                        : `${currentValue}`;
                }
            }, 20); // Adjust speed by changing the interval time
        });
    }

    // Trigger animations when the section is in view
    const projectSection = document.querySelector('.project-section');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateProgressBar();
                    animateStats();
                    observer.disconnect(); // Stop observing after animation
                }
            });
        },
        { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    observer.observe(projectSection);
});