// Initiale Konfiguration laden oder Standardwerte setzen
let config = JSON.parse(localStorage.getItem('config')) || {
    numberOfDays: 2,
    slotsPerDay: 9
};

console.log("Aktuelle Konfiguration:", config);

// Lade Slots aus LocalStorage oder initialisiere sie
let slots = JSON.parse(localStorage.getItem('slots')) || [];

console.log("Geladene Slots:", slots);

// Funktion zur Initialisierung der Slots basierend auf der Konfiguration
function initializeSlots() {
    slots = [];
    for (let tag = 1; tag <= config.numberOfDays; tag++) {
        for (let slot = 1; slot <= config.slotsPerDay; slot++) {
            slots.push({ tag: tag, slot: slot, zugewiesenAn: null });
        }
    }
    saveSlots();
    console.log("Slots initialisiert:", slots);
}

// Speichern der Konfiguration in LocalStorage
function saveConfig() {
    localStorage.setItem('config', JSON.stringify(config));
    console.log("Konfiguration gespeichert:", config);
}

// Speichern der Slots in LocalStorage
function saveSlots() {
    localStorage.setItem('slots', JSON.stringify(slots));
    console.log("Slots gespeichert:", slots);
}

// Admin-Formular Handling
document.getElementById('adminForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const numberOfDays = parseInt(document.getElementById('numberOfDays').value);
    const slotsPerDay = parseInt(document.getElementById('slotsPerDay').value);

    console.log("Admin-Formular abgeschickt:", { numberOfDays, slotsPerDay });

    if (numberOfDays < 1 || slotsPerDay < 1) {
        alert("Bitte gib gültige Zahlen ein.");
        return;
    }

    config.numberOfDays = numberOfDays;
    config.slotsPerDay = slotsPerDay;
    saveConfig();
    initializeSlots();
    updateSlotsDisplay();
    alert("Konfiguration und Slots wurden aktualisiert.");
});

// Reset-Button Handling
document.getElementById('resetButton').addEventListener('click', () => {
    if (confirm("Bist du sicher, dass du alle Slot-Zuweisungen zurücksetzen möchtest?")) {
        initializeSlots();
        saveSlots();
        updateSlotsDisplay();
        alert("Alle Slots wurden zurückgesetzt.");
    }
});

// Schüler-Button Handling
document.getElementById('assignButton').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value.trim();
    console.log("Schüler-Button geklickt mit Name:", name);

    if (name === "") {
        alert("Bitte gib deinen Namen ein.");
        return;
    }

    // Überprüfe, ob der Name bereits einen Slot hat
    const existing = slots.find(s => s.zugewiesenAn && s.zugewiesenAn.toLowerCase() === name.toLowerCase());
    if (existing) {
        alert(`Du hast bereits einen Slot: Tag ${existing.tag}, Slot ${existing.slot}`);
        return;
    }

    // Verfügbare Slots filtern
    const availableSlots = slots.filter(s => s.zugewiesenAn === null);
    console.log("Verfügbare Slots vor der Zuweisung:", availableSlots);

    if (availableSlots.length === 0) {
        alert("Keine Slots mehr verfügbar.");
        return;
    }

    // Zufälligen Slot zuweisen
    const randomIndex = Math.floor(Math.random() * availableSlots.length);
    const assignedSlot = availableSlots[randomIndex];
    assignedSlot.zugewiesenAn = name;

    console.log("Slot zugewiesen:", assignedSlot);

    saveSlots();
    updateSlotsDisplay();
    document.getElementById('nameInput').value = "";

    // Starte die Animation
    showAnimation(`${name} wurde zugewiesen zu Tag ${assignedSlot.tag}, Slot ${assignedSlot.slot}`);
});

// Funktion zur Aktualisierung der Slot-Anzeigen
function updateSlotsDisplay() {
    const grid = document.querySelector('.grid-container');
    grid.innerHTML = "";
    console.log("Aktualisiere Slot-Grid...");

    for (let tag = 1; tag <= config.numberOfDays; tag++) {
        // Erstelle eine Gruppe für jeden Tag
        const dayGroup = document.createElement('div');
        dayGroup.classList.add('day-group');

        const dayHeader = document.createElement('h3');
        dayHeader.textContent = `Tag ${tag}`;
        dayGroup.appendChild(dayHeader);

        const slotsContainer = document.createElement('div');
        slotsContainer.classList.add('slots-container');

        // Füge Slots für den aktuellen Tag hinzu
        const slotsForDay = slots.filter(s => s.tag === tag);
        console.log(`Slots für Tag ${tag}:`, slotsForDay);

        slotsForDay.forEach(s => {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('slot');
            if (s.zugewiesenAn) {
                slotDiv.classList.add('assigned');
                slotDiv.textContent = `Slot ${s.slot}\n${s.zugewiesenAn}`;
            } else {
                slotDiv.textContent = `Slot ${s.slot}`;
            }
            slotsContainer.appendChild(slotDiv);
        });

        dayGroup.appendChild(slotsContainer);
        grid.appendChild(dayGroup);
    }
    console.log("Slot-Grid aktualisiert.");
}

// Funktion zur Anzeige der Animation
function showAnimation(message) {
    const animationContainer = document.getElementById('animationContainer');
    const animationText = document.getElementById('animationText');

    animationText.textContent = message;
    animationContainer.classList.remove('hidden');
    animationContainer.classList.add('show');

    console.log("Animation gestartet:", message);

    // Nach 5 Sekunden ausblenden
    setTimeout(() => {
        animationContainer.classList.remove('show');
        animationContainer.classList.add('hidden');
        console.log("Animation ausgeblendet.");
    }, 5000);
}

// Initialisierung beim Laden der Seite
window.onload = () => {
    console.log("Seite geladen.");

    // Wenn keine Slots vorhanden sind, initialisiere sie
    if (slots.length === 0) {
        console.log("Keine gespeicherten Slots gefunden. Initialisiere neue Slots.");
        initializeSlots();
    } else {
        console.log("Slots geladen:", slots);
    }

    // Setze die Admin-Formularwerte basierend auf der Konfiguration
    document.getElementById('numberOfDays').value = config.numberOfDays;
    document.getElementById('slotsPerDay').value = config.slotsPerDay;
    updateSlotsDisplay();
};
