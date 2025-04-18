/// MC 2025

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', function() {
    const globalAudio = new Audio();

    function playAudio(src) {
        globalAudio.src = src;
        globalAudio.play().catch(error => {
            console.log("Error playing audio:", error);
        });
    }

    function setupSlideAudioAndTransitions() {
        Reveal.addEventListener('slidechanged', function(event) {
            // --- Enhancement Start ---
            // Check if we are in the speaker notes window. If so, do nothing.
            if (Reveal.isSpeakerNotes()) {
                return; // Exit the function early for speaker notes view
            }
            // --- Enhancement End ---

            const currentSlide = event.currentSlide;

            // Check for audio configuration on the current slide
            const audioSrc = currentSlide.getAttribute('data-audio-src');
            const audioDelay = parseInt(currentSlide.getAttribute('data-audio-delay'), 10);
            const slideDelay = parseInt(currentSlide.getAttribute('data-slide-delay'), 10);

            if (audioSrc && !isNaN(audioDelay)) {
                // If there's audio configured for this slide, play it and setup transition
                // Wait 2 seconds before playing audio
                sleep(2000).then(() => { playAudio(audioSrc); });
                // Setup automatic transition after audioDelay + 2000ms
                setTimeout(() => Reveal.next(), audioDelay + 2000);
            } else if (!isNaN(slideDelay)) {
                // If there's only a slide delay configured (without audio), setup transition
                setTimeout(() => Reveal.next(), slideDelay);
            }
        });
    }

    // Ensure Reveal is ready before setting up listeners, especially for isSpeakerNotes()
    // Reveal might not be fully initialized during DOMContentLoaded in all cases.
    if (window.Reveal) {
        if (Reveal.isReady()) {
            setupSlideAudioAndTransitions();
        } else {
            // Wait for Reveal to be ready before setting up the listener
            Reveal.addEventListener('ready', setupSlideAudioAndTransitions);
        }
    } else {
        console.warn("Reveal.js not found or loaded yet. Automatic audio/transitions might not work.");
        // Fallback or alternative setup might be needed if Reveal loads much later
    }

});
