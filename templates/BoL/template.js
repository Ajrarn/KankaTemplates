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

function updateSheetVariables() {
    const sheet = document.querySelector('.bol-sheet');
    if (!sheet) return;

    const sheetWidth = sheet.offsetWidth;
    const viewportWidth = window.innerWidth;
    const ratio = sheetWidth / viewportWidth;

    // Met à jour les variables CSS
    document.documentElement.style.setProperty('--sheet-width', sheetWidth + 'px');
    document.documentElement.style.setProperty('--sheet-ratio', ratio);

    // Met à jour les variables de taille de police en fonction du ratio
    document.documentElement.style.setProperty('--font-size-name', (2.4 * ratio) + 'vw');
    document.documentElement.style.setProperty('--font-size-origin-languages-combat-attributes-label', (1.4 * ratio) + 'vw');
    document.documentElement.style.setProperty('--font-size-xp-sections-labels', (2.5 * ratio) + 'vw');
    document.documentElement.style.setProperty('--font-size-origin-languages-values', (1.6 * ratio) + 'vw');
    document.documentElement.style.setProperty('--font-size-default-values', (2 * ratio) + 'vw');
    document.documentElement.style.setProperty('--font-size-attributes-labels', (2 * ratio) + 'vw');
    document.documentElement.style.setProperty('--font-size-attribute-values', (2.7 * ratio) + 'vw');
    document.documentElement.style.setProperty('--font-size-sections-value', (1.5 * ratio) + 'vw');
    document.documentElement.style.setProperty('--font-size-damages-arc-label', (1.5 * ratio) + 'vw');
    document.documentElement.style.setProperty('--attribute-img-width-heigth', (9 * ratio) + 'vw');
    document.documentElement.style.setProperty('--arc-diameter', (23 * ratio) + 'vw');
}

// Mettre à jour au chargement et au redimensionnement
window.addEventListener('DOMContentLoaded', updateSheetVariables);
window.addEventListener('resize', updateSheetVariables);


//Initialisation du document
document.addEventListener("DOMContentLoaded", function () {

    const sheetWidth = document.querySelector('.bol-sheet').offsetWidth;
    document.documentElement.style.setProperty('--sheet-width', sheetWidth + 'px');

    createArcTextFromContent("bol-faith-label", {
        "angleStart": "180",
        "facing": "outward",
        "reverse": true
    });

    createArcTextFromContent("bol-power-label", {
        "angleStart": "270",
        "facing": "inward"
    });

    createArcTextFromContent("bol-hero-label", {
        "angleStart": "0",
        "facing": "inward"
    });
});


