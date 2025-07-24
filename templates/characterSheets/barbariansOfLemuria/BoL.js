function createArcTextFromContent(id, options = {}) {
    const container = document.getElementById(id);
    if (!container) return;

    const text = container.innerText.trim();
    const charCount = text.length;
    container.innerHTML = '';
    container.style.setProperty('--char-count', charCount);

    // === Angle dynamique ===
    const maxAngle = 90; // maximum total
    const anglePerChar = 5; // par défaut 5° par lettre
    const arcAngle = Math.min(charCount * anglePerChar, maxAngle);
    container.style.setProperty('--arc-angle', arcAngle + 'deg');

    // === Décalage pour centrage dans le quart ===
    const angleStartBase = parseFloat(options.angleStart || '0');
    const offset = (maxAngle - arcAngle) / 2;
    const effectiveAngleStart = angleStartBase + offset;
    container.style.setProperty('--angle-start', effectiveAngleStart + 'deg');

    // === Appliquer toutes les propriétés CSS restantes ===
    for (const [key, value] of Object.entries(options)) {
        if (!['facing', 'reverse', 'maxArcAngle', 'anglePerChar', 'angleStart'].includes(key)) {
            container.style.setProperty(`--${key}`, value);
        }
    }

    // === Classes d’orientation ===
    container.classList.remove('inward', 'outward', 'reverse');
    container.classList.add(options.facing === 'inward' ? 'inward' : 'outward');
    if (options.reverse) container.classList.add('reverse');

    // === Création des lettres ===
    [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.dataset.index = i;
        span.style.setProperty('--index', i);
        container.appendChild(span);
    });
}


//Initialisation du document
document.addEventListener("DOMContentLoaded", function () {
    createArcTextFromContent("bol-faith-label", {
        "arc-diameter": "22.8vw",
        "angleStart": "180",
        "arc-left": "44.7%",
        "arc-top": "58.5%",
        "facing": "outward",
        "reverse": true
    });

    createArcTextFromContent("bol-power-label", {
        "arc-diameter": "22.8vw",
        "angleStart": "270",
        "arc-left": "44.7%",
        "arc-top": "58.5%",
        "facing": "inward"
    });

    createArcTextFromContent("bol-hero-label", {
        "arc-diameter": "22.8vw",
        "angleStart": "0",
        "arc-left": "44.7%",
        "arc-top": "58.5%",
        "facing": "inward"
    });
});
