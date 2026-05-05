// Fallback for older browsers
(function() {
    console.log("Running fallback script for older browsers");
    
    // Simple typewriter fallback
    const texts = [
        "$> python malware · network pentesting",
        "$> break to protect | ethical research", 
        "$> bash automation · red team mindset"
    ];
    let idx = 0, charIdx = 0;
    const typeEl = document.getElementById('typewriter-text');
    
    function typeWriter() {
        if (!typeEl) return;
        if (charIdx < texts[idx].length) {
            typeEl.innerHTML = texts[idx].substring(0, charIdx + 1) + '_';
            charIdx++;
            setTimeout(typeWriter, 70);
        } else {
            setTimeout(() => {
                idx = (idx + 1) % texts.length;
                charIdx = 0;
                typeWriter();
            }, 2500);
        }
    }
    
    if (typeEl && typeEl.innerHTML === '$> loading...') {
        typeWriter();
    }
    
    // Contact button fallback
    document.getElementById('contactBtn')?.addEventListener('click', () => {
        alert("📧 Email: amal51925192@gmail.com\n💼 LinkedIn: linkedin.com/in/amal-chand");
    });
})();