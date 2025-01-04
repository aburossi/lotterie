// Initiale Konfiguration laden oder Standardwerte setzen
let config = JSON.parse(localStorage.getItem('config')) || {
    numberOfGroups: 2,
    slotsPerGroup: 9
};

// Lade Plätze aus LocalStorage oder initialisiere sie
let slots = JSON.parse(localStorage.getItem('slots')) || [];

// Funktion zur Generierung von Gruppenbezeichnungen (z.B. Gruppe A, Gruppe B)
function generateGroupName(index) {
    return `Gruppe ${String.fromCharCode(65 + index)}`; // 65 ist 'A' im ASCII
}

// Funktion zur Initialisierung der Plätze basierend auf der Konfiguration
function initializeSlots() {
    slots = [];
    for (let groupIndex = 0; groupIndex < config.numberOfGroups; groupIndex++) {
        const groupName = generateGroupName(groupIndex);
        for (let slot = 1; slot <= config.slotsPerGroup; slot++) {
            slots.push({ group: groupName, slot: slot, assignedTo: null });
        }
    }
    saveSlots();
}

// Speichern der Konfiguration in LocalStorage
function saveConfig() {
    localStorage.setItem('config', JSON.stringify(config));
}

// Speichern der Plätze in LocalStorage
function saveSlots() {
    localStorage.setItem('slots', JSON.stringify(slots));
}

// Admin-Formular Handling
document.getElementById('adminForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const numberOfGroups = parseInt(document.getElementById('numberOfGroups').value);
    const slotsPerGroup = parseInt(document.getElementById('slotsPerGroup').value);

    if (numberOfGroups < 1 || slotsPerGroup < 1) {
        alert("Bitte gib gültige Zahlen ein.");
        return;
    }

    config.numberOfGroups = numberOfGroups;
    config.slotsPerGroup = slotsPerGroup;
    saveConfig();
    initializeSlots();
    updateSlotsDisplay();
    alert("Konfiguration und Plätze wurden aktualisiert.");
});

// Reset-Button Handling
document.getElementById('resetButton').addEventListener('click', () => {
    if (confirm("Bist du sicher, dass du alle Platz-Zuweisungen zurücksetzen möchtest?")) {
        initializeSlots();
        saveSlots();
        updateSlotsDisplay();
        alert("Alle Plätze wurden zurückgesetzt.");
    }
});

// Schüler-Button Handling
document.getElementById('assignButton').addEventListener('click', () => {
    const name = document.getElementById('nameInput').value.trim();
    if (name === "") {
        alert("Bitte gib deinen Namen ein.");
        return;
    }

    // Überprüfe, ob der Name bereits einen Platz hat
    const existing = slots.find(s => s.assignedTo && s.assignedTo.toLowerCase() === name.toLowerCase());
    if (existing) {
        alert(`Du hast bereits einen Platz: ${existing.group}, Platz ${existing.slot}`);
        return;
    }

    // Verfügbare Plätze filtern
    const availableSlots = slots.filter(s => s.assignedTo === null);
    if (availableSlots.length === 0) {
        alert("Keine Plätze mehr verfügbar.");
        return;
    }

    // Zufälligen Platz zuweisen
    const randomIndex = Math.floor(Math.random() * availableSlots.length);
    const assignedSlot = availableSlots[randomIndex];
    assignedSlot.assignedTo = name;

    saveSlots();
    updateSlotsDisplay();
    document.getElementById('nameInput').value = "";

    // Zeige Modal mit zugewiesenem Platz
    showModal(`${name}, dein Präsentationsplatz ist: ${assignedSlot.group}, Platz ${assignedSlot.slot}`);
});

// Funktion zur Aktualisierung der Platz-Anzeigen
function updateSlotsDisplay() {
    const availableContainer = document.getElementById('availableSlotsContainer');
    const assignedContainer = document.getElementById('slotsListContainer');

    // Leere die Container
    availableContainer.innerHTML = "";
    assignedContainer.innerHTML = "";

    // Gruppiere Plätze nach Gruppe für verfügbare Plätze
    config.numberOfGroups = config.numberOfGroups || 2; // Fallback
    for (let groupIndex = 0; groupIndex < config.numberOfGroups; groupIndex++) {
        const groupName = generateGroupName(groupIndex);

        // Verfügbare Plätze
        const dayGroupAvailable = document.createElement('div');
        dayGroupAvailable.classList.add('day-group');

        const dayHeaderAvailable = document.createElement('h3');
        dayHeaderAvailable.textContent = groupName;
        dayGroupAvailable.appendChild(dayHeaderAvailable);

        const availableList = document.createElement('ul');
        availableList.classList.add('slotsList');

        slots.filter(s => s.group === groupName && s.assignedTo === null).forEach(s => {
            const li = document.createElement('li');
            li.textContent = `Platz ${s.slot}`;
            availableList.appendChild(li);
        });

        dayGroupAvailable.appendChild(availableList);
        availableContainer.appendChild(dayGroupAvailable);
    }

    // Gruppiere Plätze nach Gruppe für vergebene Plätze
    for (let groupIndex = 0; groupIndex < config.numberOfGroups; groupIndex++) {
        const groupName = generateGroupName(groupIndex);

        const dayGroupAssigned = document.createElement('div');
        dayGroupAssigned.classList.add('day-group');

        const dayHeaderAssigned = document.createElement('h3');
        dayHeaderAssigned.textContent = groupName;
        dayGroupAssigned.appendChild(dayHeaderAssigned);

        const assignedList = document.createElement('ul');
        assignedList.classList.add('slotsList');

        slots.filter(s => s.group === groupName && s.assignedTo).forEach(s => {
            const li = document.createElement('li');
            li.textContent = `Name: ${s.assignedTo} - Platz ${s.slot}`;
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
    // Wenn keine Plätze vorhanden sind, initialisiere sie
    if (slots.length === 0) {
        initializeSlots();
    }
    // Setze die Admin-Formularwerte basierend auf der Konfiguration
    document.getElementById('numberOfGroups').value = config.numberOfGroups;
    document.getElementById('slotsPerGroup').value = config.slotsPerGroup;
    updateSlotsDisplay();
};
