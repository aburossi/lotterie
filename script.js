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
    const assignedSlot = availableSlots[randomIndex];
    assignedSlot.zugewiesenAn = name;

    saveSlots();
    updateSlotsDisplay();
    document.getElementById('nameInput').value = "";

    // Zeige Modal mit zugewiesenem Slot
    showModal(`${name}, dein Präsentationsslot ist: Tag ${assignedSlot.tag}, Slot ${assignedSlot.slot}`);
});

// Funktion zur Aktualisierung der Slot-Anzeigen
function updateSlotsDisplay() {
    const availableContainer = document.getElementById('availableSlotsContainer');
    const assignedContainer = document.getElementById('slotsListContainer');

    // Leere die Container
    availableContainer.innerHTML = "";
    assignedContainer.innerHTML = "";

    // Gruppiere Slots nach Tag für verfügbare Slots
    for (let tag = 1; tag <= config.numberOfDays; tag++) {
        const dayGroupAvailable = document.createElement('div');
        dayGroupAvailable.classList.add('day-group');

        const dayHeaderAvailable = document.createElement('h3');
        dayHeaderAvailable.textContent = `Tag ${tag}`;
        dayGroupAvailable.appendChild(dayHeaderAvailable);

        const availableList = document.createElement('ul');
        availableList.classList.add('slotsList');

        slots.filter(s => s.tag === tag && s.zugewiesenAn === null).forEach(s => {
            const li = document.createElement('li');
            li.textContent = `Slot ${s.slot}`;
            availableList.appendChild(li);
        });

        dayGroupAvailable.appendChild(availableList);
        availableContainer.appendChild(dayGroupAvailable);
    }

    // Gruppiere Slots nach Tag für vergebene Slots
    for (let tag = 1; tag <= config.numberOfDays; tag++) {
        const dayGroupAssigned = document.createElement('div');
        dayGroupAssigned.classList.add('day-group');

        const dayHeaderAssigned = document.createElement('h3');
        dayHeaderAssigned.textContent = `Tag ${tag}`;
        dayGroupAssigned.appendChild(dayHeaderAssigned);

        const assignedList = document.createElement('ul');
        assignedList.classList.add('slotsList');

        slots.filter(s => s.tag === tag && s.zugewiesenAn).forEach(s => {
            const li = document.createElement('li');
            li.textContent = `Name: ${s.zugewiesenAn} - Slot ${s.slot}`;
            assignedList.appendChild(li);
        });

        dayGroupAssigned.appendChild(assignedList);
        assignedContainer.appendChild(dayGroupAssigned);
    }
}

// Modal-Funktionen
const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const closeModalBtn = document.getElementById('closeModal');

function showModal(message) {
    modalText.textContent = message;
    modal.style.display = "block";

    // Automatisches Schließen nach 3 Sekunden
    setTimeout(() => {
        modal.style.display = "none";
    }, 3000);
}

// Schließen des Modals beim Klick auf das "X"
closeModalBtn.onclick = function() {
    modal.style.display = "none";
}

// Schließen des Modals beim Klick außerhalb des Modal-Inhalts
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
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
