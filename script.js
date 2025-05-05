document.addEventListener('DOMContentLoaded', () => {
    console.log('Birthday website loaded!');

    // --- 1. Welcome Section: Confetti --- 
    const confettiButton = document.getElementById('confetti-button');
    const confettiCanvas = document.getElementById('confetti-canvas');

    if (confettiButton && confettiCanvas) {
        const confettiSettings = { 
            target: confettiCanvas.id, 
            max: 150,          // Max confetti particles
            size: 1.5,         // Confetti size
            animate: true,      // Enable animation
            props: ['circle', 'square', 'triangle', 'line'], // Shapes
            colors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]], // Example colors
            clock: 25,         // Animation speed
            rotate: true,       // Allow rotation
            width: window.innerWidth,
            height: window.innerHeight,
            start_from_edge: true,
            respawn: false
        };
        const confetti = new ConfettiGenerator(confettiSettings);

        confettiButton.addEventListener('click', () => {
            console.log('Confetti button clicked! (Special Message trigger)');
            confetti.render();
            openSpecialMessageModal();
            // Optional: Hide button after clicking or change text
            // confettiButton.style.display = 'none'; 
        });

        // Initial small burst on load?
        // setTimeout(() => confetti.render(), 500); 
    }

    // --- 1b. Custom Cursor Particle Trail --- 
    const createParticle = (x, y) => {
        const particle = document.createElement('div');
        particle.className = 'particle-trail';
        document.body.appendChild(particle);

        // Set initial position
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Randomize appearance slightly (optional)
        const size = Math.random() * 5 + 5; // Size between 5px and 10px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        // Random color from a predefined palette
        const colors = ['#ffcc00', '#ff6699', '#66ffcc', '#cc99ff', '#ffffff'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Animate and remove the particle
        requestAnimationFrame(() => {
            // Make it fade and potentially shrink/move
            particle.style.opacity = 0;
            particle.style.transform = `translate(-50%, -50%) scale(0.5)`; // Center + shrink
        });

        // Remove the particle from the DOM after the animation
        setTimeout(() => {
            particle.remove();
        }, 500); // Match the transition duration in CSS
    };

    let mouseMoveTimeout;
    window.addEventListener('mousemove', (e) => {
        // Throttle particle creation slightly
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => {
            createParticle(e.clientX, e.clientY);
        }, 25); // Adjust frequency (milliseconds)
    });

    // --- 1c. Background Music Playlist --- 
    const audio = document.getElementById('background-audio');
    const muteButton = document.getElementById('mute-toggle');
    const prevButton = document.getElementById('prev-track');
    const nextButton = document.getElementById('next-track');

    // ===> REPLACE WITH YOUR ACTUAL MP3 FILENAMES <===
    const playlist = [
        '(अंतरा 1).mp3', 
        'song2.mp3', 
        'another_track.mp3'
        // Add more song file paths here
    ];
    let currentTrackIndex = 0;
    let isPlaying = false; // Tracks whether audio is currently playing or supposed to be

    function loadTrack(index) {
        if (index < 0 || index >= playlist.length || !audio) return;
        currentTrackIndex = index;
        audio.src = playlist[currentTrackIndex];
        audio.load(); // Important to load the new source
        console.log(`Loading track ${currentTrackIndex}: ${playlist[currentTrackIndex]}`);
        
        // Attempt to play if it was playing before or if user initiated action
        if (isPlaying) {
            playCurrentTrack();
        }
    }

    function playCurrentTrack() {
         if (!audio) return;
         audio.play().then(() => {
            console.log(`Playing: ${playlist[currentTrackIndex]}`);
            isPlaying = true;
            updateMuteButton(); 
        }).catch(error => {
            console.warn('Audio play failed:', error);
            isPlaying = false; // Playback failed
            // Might need user interaction first time
             updateMuteButton(); 
        });
    }

    function updateMuteButton() {
        if (!muteButton || !audio) return;
        if (audio.muted || !isPlaying) { // Show unmute if muted OR not successfully playing
            muteButton.textContent = '🔊 Unmute';
        } else {
            muteButton.textContent = '🔇 Mute';
        }
    }

    if (audio && muteButton && prevButton && nextButton && playlist.length > 0) {
        // Load the first track initially
        loadTrack(currentTrackIndex);
        // Set initial muted state (recommended due to autoplay policies)
        audio.muted = true; 
        updateMuteButton();

        // Mute Button Logic
        muteButton.addEventListener('click', () => {
            if (audio.muted) {
                audio.muted = false;
                // Only set isPlaying if the audio actually starts or resumes
                playCurrentTrack(); // Try to play when unmuting
            } else {
                audio.muted = true;
                // Don't necessarily stop playback, just mute
            }
            updateMuteButton();
        });

        // Next Button Logic
        nextButton.addEventListener('click', () => {
            const nextIndex = (currentTrackIndex + 1) % playlist.length; // Wrap around
            loadTrack(nextIndex);
        });

        // Previous Button Logic
        prevButton.addEventListener('click', () => {
            const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length; // Wrap around
            loadTrack(prevIndex);
        });

        // Autoplay next track when current one ends
        audio.addEventListener('ended', () => {
            console.log(`Track ended: ${playlist[currentTrackIndex]}`);
            nextButton.click(); // Simulate click on next button
        });
        
        // Handle potential play errors or needing interaction
        audio.addEventListener('error', (e) => {
            console.error("Audio Error:", audio.error);
            isPlaying = false;
            updateMuteButton();
            // Maybe display a message to the user?
        });

    }

    // --- 2. Fireworks Celebration --- 
    const fireworksContainer = document.getElementById('slider-fireworks-canvas'); // Get the NEW canvas
    const fireworksButton = document.getElementById('fireworks-button');
    const fireworksMessage = document.getElementById('fireworks-message');
    let fireworksInstance = null;
    let fireworksActive = false;

    function startSliderFireworks() {
        if (!fireworksContainer) return;

        // Ensure previous instance is stopped if exists
        if (fireworksInstance) {
            fireworksInstance.stop();
            fireworksInstance = null; // Clear instance
        }

        // Create new instance - Adjusted for slower, *very* thin effect
        fireworksInstance = new Fireworks(fireworksContainer, {
            // Slow, Very Thin, and Slower Launch Options:
            rocketsPoint: {
                min: 0,
                max: 100 // Keep full width launch
            },
            hue: {
                min: 0,
                max: 360 // Keep color variety
            },
            delay: {
                min: 60, // Increased minimum delay significantly
                max: 120 // Increased maximum delay significantly
            },
            brightness: {
                min: 50,
                max: 70, // Reduced max brightness further
                decay: { 
                    min: 0.015, 
                    max: 0.03
                }
            },
            flickering: 20,   // Further reduce flickering
            intensity: 15,   // Further lower intensity
            traceSpeed: 1.5, 
            traceLength: 2,   
            lineWidth: {      
                explosion: { min: 0.2, max: 1.0 }, 
                trace: { min: 0.1, max: 0.5 } 
            },
            lineStyle: 'round', 
            acceleration: 1.02, // Slightly slower acceleration
            gravity: 1.5,     
            explosion: 4,     // Smaller explosions
            particles: 50,    // Reduce particles more
            friction: 0.98,   
            opacity: 0.5,     // Slightly more transparent
            sound: { enabled: false }

            /* Previous options for reference:
                rocketsPoint: { min: 0, max: 100 },
                hue: { min: 0, max: 360 },
                delay: { min: 30, max: 60 },
                brightness: { min: 50, max: 75, decay: { min: 0.015, max: 0.03 } },
                flickering: 30,
                intensity: 20,
                traceSpeed: 1.5,
                traceLength: 2,
                lineWidth: { explosion: { min: 0.5, max: 1.5 }, trace: { min: 0.5, max: 1 } },
                acceleration: 1.02,
                particles: 60,
                friction: 0.98,
                opacity: 0.6,
            */
        });

        fireworksInstance.start();
        fireworksActive = true;
        if (fireworksButton) fireworksButton.textContent = 'Stop the Show';
        if (fireworksMessage) fireworksMessage.classList.remove('hidden'); // Show message
    }

    function stopSliderFireworks() {
        if (fireworksInstance) {
            fireworksInstance.stop();
            fireworksActive = false;
            if (fireworksButton) fireworksButton.textContent = 'Start the Show Again?'; // Change button text
            if (fireworksMessage) fireworksMessage.classList.add('hidden'); // Hide message
        }
    }

    if (fireworksButton && fireworksContainer) {
        // Initially start the fireworks for the slider section
        startSliderFireworks();

        // Toggle with the button
        fireworksButton.addEventListener('click', () => {
            if (fireworksActive) {
                stopSliderFireworks();
            } else {
                startSliderFireworks();
            }
        });
    } else {
        if (!fireworksContainer) console.error('Slider fireworks canvas not found!');
        if (!fireworksButton) console.error('Fireworks button not found!');
    }

    // --- 4. Embedded Wishes: Video Modal Logic --- 
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const closeButton = videoModal ? videoModal.querySelector('.close-button') : null;

    // Close modal when close button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            if (videoModal && modalVideo) {
                videoModal.classList.remove('visible'); // Use class toggle
                modalVideo.pause(); // Pause video
                modalVideo.src = ''; // Clear source
            }
        });
    }

    // Close modal if user clicks outside the video content
    if (videoModal) {
        videoModal.addEventListener('click', (event) => {
            if (event.target === videoModal && modalVideo) { // Check if click is on the backdrop
                 videoModal.classList.remove('visible');
                modalVideo.pause();
                modalVideo.src = '';
            }
        });
    }

    // --- Placeholder for other sections (Timeline, Game, Bonus) ---
    // TODO: Implement Timeline animations (e.g., with GSAP/ScrollMagic)
    // TODO: Implement Mini-Game logic
    // TODO: Implement Bonus section logic (Memory Jar, Guestbook)

    // --- 5. Mini-Game: Catch the Stars --- 
    /* Code removed as section was deleted */

    // --- Bonus: Memory Jar --- 
    /* Code removed as section was deleted */

    // --- Surprise Slang Box Logic --- 
    const surpriseBox = document.getElementById('surprise-box');
    let surpriseTimeout = null;

    // ===> IMPORTANT: MANUALLY ADD YOUR OWN PHRASES BELOW! <===
    // The previous examples were placeholders. Add the specific phrases 
    // you want to display here. Ensure they are appropriate for the recipient.
    // Example structure: const surprisePhrases = [ "Phrase 1", "Phrase 2", ... ];
    const surprisePhrases = [
        // "Add your first funny/appropriate phrase here!",
        // "Add your second phrase here!",
        // "Add more phrases as needed..."
        // Ensure the recipient will find these genuinely funny!
    ];

    function showSurpriseMessage() {
        if (!surpriseBox || surprisePhrases.length === 0) {
             console.warn("No surprise phrases added or surprise box not found.");
             return; // Do nothing if no phrases are provided
        }

        // Clear any existing timeout to prevent overlap
        clearTimeout(surpriseTimeout);
        surpriseBox.classList.remove('visible'); // Ensure it's hidden before update

        // Get a random phrase
        const randomIndex = Math.floor(Math.random() * surprisePhrases.length);
        surpriseBox.textContent = surprisePhrases[randomIndex];
        console.log("Surprise: ", surprisePhrases[randomIndex]);

        // Use a tiny timeout to allow the removal of 'visible' to register first
        // before adding it again, ensuring the animation restarts.
        setTimeout(() => { 
            surpriseBox.classList.remove('hidden'); // Make sure it's not display:none
            surpriseBox.classList.add('visible');
        }, 20); 

        // Set timeout to hide the box again
        surpriseTimeout = setTimeout(() => {
            surpriseBox.classList.remove('visible');
            // Optionally add 'hidden' back if using display:none 
            // setTimeout(() => { surpriseBox.classList.add('hidden'); }, 400); // Match transition
        }, 2500); // Show for 2.5 seconds
    }

    // --- Special Message Modal Logic ---
    const specialMessageModal = document.getElementById('special-message-modal');
    const specialMessageCloseButton = document.querySelector('.special-close-button');

    function openSpecialMessageModal() {
        if (!specialMessageModal) return;
        specialMessageModal.classList.remove('hidden'); // Remove display:none if used
        specialMessageModal.classList.add('visible');
        console.log("Opening special message modal");
    }

    function closeSpecialMessageModal() {
        if (!specialMessageModal) return;
        specialMessageModal.classList.remove('visible');
        // Optionally re-add hidden class if using display:none
        // setTimeout(() => { specialMessageModal.classList.add('hidden'); }, 400); // Match transition duration
         console.log("Closing special message modal");
    }

    if (specialMessageCloseButton) {
        specialMessageCloseButton.addEventListener('click', closeSpecialMessageModal);
    }
    // Close if clicking outside the content
    if (specialMessageModal) {
        specialMessageModal.addEventListener('click', (event) => {
            if (event.target === specialMessageModal) { 
                closeSpecialMessageModal();
            }
        });
    }

    // --- E-Card Modal Logic ---
    /* Code removed as section was deleted */

    // --- Gallery Logic --- 
    /* Code removed as section was deleted */

    // --- Trigger Surprises at Various Points ---
    // ... existing surprise triggers ...

    // --- Video Wishes Slider (Swiper) --- 
    if (typeof Swiper !== 'undefined') {
        const videoSwiper = new Swiper('.video-swiper', {
            // Optional parameters
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            grabCursor: true,

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

            // Keyboard navigation
            keyboard: {
                enabled: true,
                onlyInViewport: false,
            },

            // Handle video playback when changing slides (to prevent multiple playing)
            on: {
                slideChangeTransitionStart: function () {
                    // Pause previously active iframe
                    const previousSlide = this.slides[this.previousIndex];
                    const iframe = previousSlide.querySelector('iframe');
                    if (iframe && iframe.contentWindow) {
                         iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                         console.log("Paused video in previous slide");
                    }
                },
                 // Maybe autoplay active slide? Often blocked by browsers.
                 /* slideChangeTransitionEnd: function () {
                    const activeSlide = this.slides[this.activeIndex];
                    const iframe = activeSlide.querySelector('iframe');
                     if (iframe && iframe.contentWindow) {
                         iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    }
                 } */
            }
        });
         console.log("Video Swiper Initialized");

        // Add ?enablejsapi=1 to iframe srcs for JS control
        document.querySelectorAll('.video-swiper iframe').forEach(iframe => {
            if (iframe.src && !iframe.src.includes('enablejsapi=1')) {
                iframe.src += (iframe.src.includes('?') ? '&' : '?') + 'enablejsapi=1';
            }
        });

    } else {
        console.warn("Swiper library not loaded. Video slider will not work.");
    }

    // ... rest of script ...
}); 