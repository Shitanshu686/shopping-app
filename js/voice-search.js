// Voice Search using Web Speech API (Chrome, Edge, Safari supported)
function initVoiceSearch() {
    const micBtn = document.getElementById('voiceSearchBtn');
    const searchInput = document.getElementById('searchBox');

    if (!micBtn || !searchInput) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        micBtn.style.display = 'none';
        console.warn('Speech Recognition API not supported in this browser.');
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // English + Hinglish terms naturally pick karta hai
    recognition.continuous = false;
    recognition.interimResults = false;

    let isListening = false;

    micBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
            } catch (err) {
                console.error('Mic start error:', err);
            }
        }
    });

    recognition.onstart = () => {
        isListening = true;
        micBtn.classList.add('listening');
        searchInput.placeholder = 'Listening... Speak now 🎙️';
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        
        // Trigger existing search function
        if (typeof searchProduct === 'function') {
            searchProduct(transcript);
        } else {
            searchInput.dispatchEvent(new Event('keyup'));
        }
    };

    recognition.onerror = (event) => {
        console.warn('Voice search error:', event.error);
        resetMic();
    };

    recognition.onend = () => {
        resetMic();
    };

    function resetMic() {
        isListening = false;
        micBtn.classList.remove('listening');
        searchInput.placeholder = 'Search Products...';
    }
}

document.addEventListener('DOMContentLoaded', initVoiceSearch);
