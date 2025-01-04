// Initiale Konfiguration laden oder Standardwerte setzen
let config = JSON.parse(localStorage.getItem('config')) || {
    numberOfDays: 2,
    slotsPerDay: 9
};

// Lade Slots aus LocalStorage oder initialisiere sie
let slots = JSON.parse(localStorage.getItem('slots')) || [];

// Funktion zur Initialisierung der Slots basierend auf der Konfiguration
function initializeSlots() {
    slots = [];
    for (let tag = 1; tag <= config.numberOfDays; tag++) {
        for (let slot = 1; slot <= config.slotsPerDay; slot++) {
            slots.push({ tag: tag, slot: slot, zugewiesenAn: null });
        }
    }
    saveSlots();
}

// Speichern der Konfiguration in LocalStorage
function saveConfig() {
    localStorage.setItem('config', JSON.stringify(config));
}

// Speichern der Slots in LocalStorage
function saveSlots() {
    localStorage.setItem('slots', JSON.stringify(slots));
}

// Admin-Formular Handling
document.getElementById('adminForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const numberOfDays = parseInt(document.getElementById('numberOfDays').value);
    const slotsPerDay = parseInt(document.getElementById('slotsPerDay').value);

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

// Schüler-Button Handling
document.getElementById('assignButton').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value.trim();
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
    if (availableSlots.length === 0) {
        alert("Keine Slots mehr verfügbar.");
        return;
    }

    // Zufälligen Slot zuweisen
    const randomIndex = Math.floor(Math.random() * availableSlots.length);
    availableSlots[randomIndex].zugewiesenAn = name;

    saveSlots();
    updateSlotsDisplay();
    document.getElementById('nameInput').value = "";
    alert(`Slot zugewiesen: Tag ${availableSlots[randomIndex].tag}, Slot ${availableSlots[randomIndex].slot}`);
});

// Funktion zur Aktualisierung der Slot-Anzeigen
function updateSlotsDisplay() {
    const list = document.getElementById('slotsList');
    list.innerHTML = "";
    slots.forEach(s => {
        if (s.zugewiesenAn) {
            const li = document.createElement('li');
            li.textContent = `Name: ${s.zugewiesenAn} - Tag ${s.tag}, Slot ${s.slot}`;
            list.appendChild(li);
        }
    });
    updateSlotGrid();
}

// Funktion zur Aktualisierung des Slot-Grids
function updateSlotGrid() {
    const grid = document.querySelector('.grid-container');
    grid.innerHTML = "";

    slots.forEach(s => {
        const slotDiv = document.createElement('div');
        slotDiv.classList.add('slot');
        if (s.zugewiesenAn) {
            slotDiv.classList.add('assigned');
            slotDiv.textContent = `Tag ${s.tag}, Slot ${s.slot}\n${s.zugewiesenAn}`;
        } else {
            slotDiv.textContent = `Tag ${s.tag}, Slot ${s.slot}`;
        }
        grid.appendChild(slotDiv);
    });
}

// Initialisierung beim Laden der Seite
window.onload = () => {
    // Wenn keine Slots vorhanden sind, initialisiere sie
    if (slots.length === 0) {
        initializeSlots();
    }
    // Setze die Admin-Formularwerte basierend auf der Konfiguration
    document.getElementById('numberOfDays').value = config.numberOfDays;
    document.getElementById('slotsPerDay').value = config.slotsPerDay;
    updateSlotsDisplay();
};
