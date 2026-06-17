const STORAGE_KEY = "caregiverCompanion_v085";
const FAVORITES_KEY = "caregiverCompanion_foodFavorites_v085";

const SUPPLIES_KEY = "caregiverCompanion_supplies_v085";
const PURCHASES_KEY = "caregiverCompanion_purchases_v085";
const WISHLIST_KEY = "caregiverCompanion_wishlist_v085";

let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

let supplies = JSON.parse(localStorage.getItem(SUPPLIES_KEY)) || [
  { id: crypto.randomUUID(), name: "Enemas", category: "Medical", brand: "", url: "", quantity: 4, lowAt: 6, notes: "" },
  { id: crypto.randomUUID(), name: "Gloves", category: "Medical", brand: "", url: "", quantity: 8, lowAt: 4, notes: "" },
  { id: crypto.randomUUID(), name: "Diapers", category: "Diapering", brand: "", url: "", quantity: 24, lowAt: 10, notes: "" },
  { id: crypto.randomUUID(), name: "Diaper Pail Refills", category: "Diapering", brand: "", url: "", quantity: 1, lowAt: 2, notes: "" },
  { id: crypto.randomUUID(), name: "Bottle Nipples", category: "Feeding", brand: "", url: "", quantity: 3, lowAt: 2, notes: "" }
];

let purchases = JSON.parse(localStorage.getItem(PURCHASES_KEY)) || [];
let wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [
  { id: crypto.randomUUID(), text: "Backup thermometer", completed: false },
  { id: crypto.randomUUID(), text: "Diaper pail refills", completed: false },
  { id: crypto.randomUUID(), text: "Extra pajamas", completed: false }
];

let foodFavorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [
  "Applesauce",
  "Yogurt",
  "Oatmeal",
  "Mashed Potatoes",
  "Pudding"
];

const icons = {
  wake: "☀️",
  shake: "🍼",
  water: "💧",
  pee: "💦",
  poopy: "💩",
  food: "🍎",
  position: "🔄",
  walk: "🚶",
  exercise: "🏋️",
  teeth_morning: "🪥",
  teeth_evening: "🪥",
  full_bath: "🚿",
  sponge_bath: "🛁",
  nails: "✂️",
  haircut: "💇",
  medication: "💊",
  temperature: "🌡",
  health: "🤒",
  miralax: "🥤",
  enema: "⚕️",
  lotion: "🧴",
  note: "📝",
  mood: "😊"
};

const labels = {
  wake: "Wake Up",
  shake: "Shake",
  water: "Water",
  pee: "Pee Diaper",
  poopy: "Poopy Diaper",
  food: "Food",
  position: "Position Change",
  walk: "Walk",
  exercise: "Exercise",
  teeth_morning: "Morning Teeth Brushed",
  teeth_evening: "Evening Teeth Brushed",
  full_bath: "Full Bath",
  sponge_bath: "Sponge Bath",
  nails: "Nails Clipped",
  haircut: "Hair Cut",
  medication: "Medication",
  temperature: "Temperature",
  health: "Health Log",
  miralax: "Miralax",
  enema: "Enema",
  lotion: "Lotion",
  note: "Note",
  mood: "Mood"
};

const symptoms = [
  "Cough",
  "Congestion",
  "Runny Nose",
  "Fever",
  "Vomiting",
  "Diarrhea",
  "Constipation",
  "Low Appetite",
  "Trouble Sleeping",
  "Fatigue",
  "Fussy",
  "Other"
];

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(foodFavorites));
}

function saveSupplies() {
  localStorage.setItem(SUPPLIES_KEY, JSON.stringify(supplies));
}

function savePurchases() {
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
}

function saveWishlist() {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isToday(entry) {
  return entry.timestamp.slice(0, 10) === todayKey();
}

function todayEntries() {
  return entries
    .filter(isToday)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function timeLabel(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

function dateShort(timestamp) {
  return new Date(timestamp).toLocaleDateString([], {
    month: "short",
    day: "numeric"
  });
}

function dateLabel() {
  const today = new Date();
  document.getElementById("todayDate").textContent =
    today.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
}

function countToday(type) {
  return todayEntries().filter(entry => entry.type === type).length;
}

function hasToday(type) {
  return todayEntries().some(entry => entry.type === type);
}

function latestToday(type) {
  return [...todayEntries()].reverse().find(entry => entry.type === type);
}

function latestEver(type) {
  return [...entries]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .reverse()
    .find(entry => entry.type === type);
}

function firstToday(type) {
  return todayEntries().find(entry => entry.type === type);
}

function diaperEntries() {
  return todayEntries().filter(entry => ["pee", "poopy"].includes(entry.type));
}

function feedingEntries() {
  return todayEntries().filter(entry => ["wake", "shake", "water", "food"].includes(entry.type));
}

function hygieneEntries() {
  return todayEntries().filter(entry =>
    ["teeth_morning", "teeth_evening", "full_bath", "sponge_bath", "nails", "haircut", "lotion"].includes(entry.type)
  );
}

function activityEntries() {
  return todayEntries().filter(entry => ["position", "walk", "exercise"].includes(entry.type));
}

function healthEntries() {
  return todayEntries().filter(entry => ["temperature", "health", "medication", "miralax", "enema"].includes(entry.type));
}

function startOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);

  return d;
}

function isThisWeek(entry) {
  const entryDate = new Date(entry.timestamp);
  const start = startOfWeek();
  const end = new Date(start);

  end.setDate(start.getDate() + 7);

  return entryDate >= start && entryDate < end;
}

function thisWeekEntries(type) {
  return entries
    .filter(entry => entry.type === type && isThisWeek(entry))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

function weekdayShort(timestamp) {
  return new Date(timestamp).toLocaleDateString([], { weekday: "short" });
}

function activityMinutesToday() {
  return activityEntries().reduce((total, entry) => total + (Number(entry.duration) || 0), 0);
}

function quickAdd(type, details = "", extra = {}) {
  entries.push({
    id: crypto.randomUUID(),
    type,
    details,
    timestamp: new Date().toISOString(),
    ...extra
  });

  save();
  render();

  if (document.getElementById("modalBackdrop").classList.contains("show")) {
    refreshOpenModal();
  }
}

function saveManualTimedEntry(type, timeInput, details = "", extra = {}) {
  const today = new Date();
  const [hours, minutes] = timeInput.split(":");

  today.setHours(Number(hours));
  today.setMinutes(Number(minutes));
  today.setSeconds(0);
  today.setMilliseconds(0);

  entries.push({
    id: crypto.randomUUID(),
    type,
    details,
    timestamp: today.toISOString(),
    ...extra
  });

  save();
  render();
}

function saveManualDiaper() {
  const diaperType = document.getElementById("diaperTypeInput").value;
  const timeInput = document.getElementById("diaperTimeInput").value;
  const notes = document.getElementById("diaperNotesInput").value.trim();

  if (!diaperType || !timeInput) return;

  saveManualTimedEntry(diaperType, timeInput, notes);
  openModal("diapers");
}

function saveManualHygiene() {
  const hygieneType = document.getElementById("hygieneTypeInput").value;
  const timeInput = document.getElementById("hygieneTimeInput").value;
  const notes = document.getElementById("hygieneNotesInput").value.trim();

  if (!hygieneType || !timeInput) return;

  saveManualTimedEntry(hygieneType, timeInput, notes);
  openModal("hygiene");
}

function saveManualActivity() {
  const activityType = document.getElementById("activityTypeInput").value;
  const timeInput = document.getElementById("activityTimeInput").value;
  const durationInput = document.getElementById("activityDurationInput").value;
  const notes = document.getElementById("activityNotesInput").value.trim();

  if (!activityType || !timeInput) return;

  const duration = Number(durationInput) || 0;
  const detailParts = [];

  if (duration) detailParts.push(`${duration} min`);
  if (notes) detailParts.push(notes);

  saveManualTimedEntry(activityType, timeInput, detailParts.join(" — "), { duration });
  openModal("activity");
}

function recordMiralax() {
  quickAdd("miralax");
}

function recordEnema() {
  const notes = prompt("Optional Enema note:");

  quickAdd("enema", notes ? notes.trim() : "");
}

function saveManualEnema() {
  const timeInput = document.getElementById("enemaTimeInput").value;
  const notes = document.getElementById("enemaNotesInput").value.trim();

  if (!timeInput) return;

  saveManualTimedEntry("enema", timeInput, notes);
  openModal("health");
}

function renderRoutineDashboard() {
  const miralaxCard = document.getElementById("miralaxCard");
  const enemaCard = document.getElementById("enemaCard");

  if (!miralaxCard || !enemaCard) return;

  const miralaxToday = countToday("miralax");
  const enemasThisWeek = thisWeekEntries("enema");
  const enemaDayNames = [...new Set(enemasThisWeek.map(entry => weekdayShort(entry.timestamp)))];

  document.getElementById("miralaxCount").textContent = `${miralaxToday} / 3`;
  document.getElementById("enemaCount").textContent = `${enemasThisWeek.length} / 2 wk`;
  document.getElementById("enemaDays").textContent = enemaDayNames.length ? enemaDayNames.join(", ") : "None";

  miralaxCard.classList.remove("routine-good", "routine-warning", "routine-alert");
  enemaCard.classList.remove("routine-good", "routine-warning", "routine-alert");

  if (miralaxToday >= 3) {
    miralaxCard.classList.add("routine-good");
  } else if (miralaxToday > 0) {
    miralaxCard.classList.add("routine-warning");
  }

  if (enemasThisWeek.length >= 2) {
    enemaCard.classList.add("routine-good");
  } else if (enemasThisWeek.length === 1) {
    enemaCard.classList.add("routine-warning");
  } else {
    enemaCard.classList.add("routine-alert");
  }
}

function removeExistingWakeUp() {
  const existingWake = firstToday("wake");
  if (existingWake) {
    entries = entries.filter(entry => entry.id !== existingWake.id);
  }
}

function saveWakeUpNow() {
  removeExistingWakeUp();

  entries.push({
    id: crypto.randomUUID(),
    type: "wake",
    details: "",
    timestamp: new Date().toISOString()
  });

  save();
  render();
  closeModal();
}

function saveWakeUpManual() {
  const timeInput = document.getElementById("wakeTimeInput").value;
  if (!timeInput) return;

  removeExistingWakeUp();

  const today = new Date();
  const [hours, minutes] = timeInput.split(":");

  today.setHours(Number(hours));
  today.setMinutes(Number(minutes));
  today.setSeconds(0);
  today.setMilliseconds(0);

  entries.push({
    id: crypto.randomUUID(),
    type: "wake",
    details: "Manually entered",
    timestamp: today.toISOString()
  });

  save();
  render();
  closeModal();
}

function deleteEntry(id) {
  entries = entries.filter(entry => entry.id !== id);
  save();
  render();

  if (document.getElementById("modalBackdrop").classList.contains("show")) {
    refreshOpenModal();
  }
}

function nextMedicationDue() {
  const now = new Date();

  const meds = entries
    .filter(entry => entry.type === "medication" && entry.nextDue)
    .map(entry => ({ ...entry, dueDate: new Date(entry.nextDue) }))
    .filter(entry => !isNaN(entry.dueDate))
    .sort((a, b) => a.dueDate - b.dueDate);

  return meds.find(entry => entry.dueDate >= now) || meds[meds.length - 1] || null;
}

function nextMedDashboardData() {
  const med = nextMedicationDue();

  if (!med) {
    return {
      status: "—",
      details: "Next Med",
      cardClass: ""
    };
  }

  const dueDate = new Date(med.nextDue);
  const now = new Date();
  const minutesUntilDue = Math.round((dueDate - now) / 60000);

  let status = "Next Med";
  let cardClass = "";

  if (minutesUntilDue < 0) {
    status = "Overdue";
    cardClass = "med-overdue";
  } else if (minutesUntilDue <= 30) {
    status = "Due Soon";
    cardClass = "med-due-soon";
  }

  return {
    status,
    details: `${med.medName || "Medication"}${med.dose ? "<br>" + med.dose : ""}<br>Due ${timeLabel(med.nextDue)}`,
    cardClass
  };
}

function renderSummary() {
  const wake = firstToday("wake");
  document.getElementById("wakeTime").textContent = wake ? timeLabel(wake.timestamp) : "—";

  document.getElementById("shakeCount").textContent = countToday("shake");
  document.getElementById("waterCount").textContent = `${countToday("water")} / 3`;
  document.getElementById("foodCount").textContent = countToday("food");
  document.getElementById("peeCount").textContent = countToday("pee");
  document.getElementById("poopyCount").textContent = countToday("poopy");

  const latestTemp = latestToday("temperature");
  document.getElementById("latestTemp").textContent = latestTemp ? latestTemp.temperature + "°" : "—";

  const medDashboard = nextMedDashboardData();
  const nextMedCard = document.getElementById("nextMedCard");

  document.getElementById("nextMedStatus").textContent = medDashboard.status;
  document.getElementById("nextMedDetails").innerHTML = medDashboard.details;

  nextMedCard.classList.remove("med-due-soon", "med-overdue");

  if (medDashboard.cardClass) {
    nextMedCard.classList.add(medDashboard.cardClass);
  }

  renderSuppliesDashboard();
  renderRoutineDashboard();

  const mood = latestToday("mood");
  document.getElementById("moodDisplay").textContent = mood ? mood.details : "Not set";
}

function renderTimeline() {
  const timeline = document.getElementById("timeline");
  const items = todayEntries();

  if (!items.length) {
    timeline.innerHTML = `<div class="empty">No entries yet today. Use Quick Log to start tracking.</div>`;
    return;
  }

  timeline.innerHTML = items.map(entry => timelineItemHTML(entry)).join("");
}

function timelineItemHTML(entry) {
  return `
    <div class="timeline-item">
      <div class="timeline-time">${timeLabel(entry.timestamp)}</div>
      <div class="timeline-icon">${icons[entry.type] || "•"}</div>
      <div>
        <strong>${labels[entry.type] || entry.type}</strong>
        ${entry.details ? `<br><span style="color: var(--muted);">${entry.details}</span>` : ""}
      </div>
      <button class="delete-btn" onclick="deleteEntry('${entry.id}')">×</button>
    </div>
  `;
}

function render() {
  dateLabel();
  renderSummary();
  renderTimeline();
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

let currentModal = null;

function openModal(type) {
  currentModal = type;

  const modalData = getModalData(type);

  document.getElementById("modalTitle").textContent = modalData.title;
  document.getElementById("modalContent").innerHTML = modalData.html;
  document.getElementById("modalBackdrop").classList.add("show");
  document.getElementById("sidebar").classList.remove("open");
}

function refreshOpenModal() {
  if (!currentModal) return;

  const modalData = getModalData(currentModal);
  document.getElementById("modalTitle").textContent = modalData.title;
  document.getElementById("modalContent").innerHTML = modalData.html;
}

function closeModal() {
  currentModal = null;
  document.getElementById("modalBackdrop").classList.remove("show");
}

function getModalData(type) {
  const modals = {
    today: {
      title: "Today",
      html: `<p>The main dashboard shows today’s summary, quick log buttons, and automatic timeline.</p>`
    },

    wake: {
      title: "Record Wake Up",
      html: `
        <p style="color:var(--muted);">Record wake-up time using the current time, or enter the actual time if you forgot to log it earlier.</p>
        <div class="quick-buttons"><button onclick="saveWakeUpNow()">☀️ Use Current Time</button></div>
        <label for="wakeTimeInput">Wake Up Time</label>
        <input id="wakeTimeInput" type="time" />
        <button class="primary-btn" style="margin-top:14px;" onclick="saveWakeUpManual()">Save Wake Up Time</button>
      `
    },

    quick: {
      title: "Quick Log",
      html: `
        <div class="quick-log" style="grid-template-columns: 1fr;">
          <div class="quick-group">
            <h3>🍼 Feeding</h3>
            <div class="quick-buttons">
              <button onclick="quickAdd('shake')">🍼 + Shake</button>
              <button onclick="quickAdd('water', '8 oz / 1 cup')">💧 + Water</button>
              <button onclick="openModal('food')">🍎 + Food</button>
            </div>
          </div>
          <div class="quick-group">
            <h3>💩 Diapers</h3>
            <div class="quick-buttons">
              <button onclick="quickAdd('pee')">💦 + Pee</button>
              <button onclick="quickAdd('poopy')">💩 + Poopy</button>
            </div>
          </div>
          <div class="quick-group">
            <h3>🥤 Care Routines</h3>
            <div class="quick-buttons">
              <button onclick="recordMiralax()">🥤 + Miralax</button>
              <button onclick="recordEnema()">⚕️ + Enema</button>
            </div>
          </div>

          <div class="quick-group">
            <h3>🪥 Hygiene</h3>
            <div class="quick-buttons">
              <button onclick="quickAdd('teeth_morning')">🪥 + Teeth</button>
              <button onclick="quickAdd('nails')">✂️ + Nails</button>
              <button onclick="quickAdd('lotion')">🧴 + Lotion</button>
            </div>
          </div>

          <div class="quick-group">
            <h3>☀️ Daily Notes</h3>
            <div class="quick-buttons">
              <button onclick="openModal('wake')">☀️ + Wake Up</button>
              <button onclick="openModal('notes')">📝 + Note</button>
            </div>
          </div>
        </div>
      `
    },

    feeding: { title: "Feeding & Hydration", html: feedingHydrationHTML() },
    diapers: { title: "Diapers", html: diapersHTML() },
    hygiene: { title: "Hygiene", html: hygieneHTML() },
    activity: { title: "Activity & Positioning", html: activityHTML() },
    health: { title: "Health & Meds", html: healthHTML() },
    food: { title: "Add Food", html: foodFormHTML() },
    foodFavorites: { title: "Edit Favorite Foods", html: foodFavoritesHTML() },
    appointments: {
      title: "Appointments",
      html: `<p>This section will track doctor, dentist, ALTCS, therapy, and next appointment notes.</p>`
    },
    supplies: {
      title: "Supplies & Inventory",
      html: suppliesHTML()
    },
    notes: { title: "Concerns & Notes", html: noteFormHTML() },
    contacts: {
      title: "Doctors & Contacts",
      html: `<p>Contact list will go here next: doctors, dentist, ALTCS, pharmacy, and suppliers.</p>`
    },
    reports: {
      title: "Reports",
      html: `<p><strong>Reports are coming next.</strong></p><p>Today has ${todayEntries().length} timestamped entries.</p>`
    },
    settings: {
      title: "Settings",
      html: `
        <p><strong>Data Storage:</strong> This version saves only on this device using localStorage.</p>
        <button class="primary-btn" onclick="clearAllData()">Clear All Data</button>
      `
    }
  };

  return modals[type];
}

function healthHTML() {
  const latestTemp = latestToday("temperature");
  const latestHealth = latestToday("health");
  const nextMed = nextMedicationDue();
  const items = healthEntries();

  return `
    <div class="mini-summary-grid">
      <div class="mini-card"><strong>${latestTemp ? latestTemp.temperature + "°F" : "—"}</strong><span>Latest Temp</span></div>
      <div class="mini-card"><strong>${latestHealth ? latestHealth.status : "—"}</strong><span>Status</span></div>
      <div class="mini-card"><strong>${nextMed ? nextMed.medName : "—"}</strong><span>Next Med</span></div>
      <div class="mini-card"><strong>${nextMed ? timeLabel(nextMed.nextDue) : "—"}</strong><span>Due Time</span></div>
    </div>

    <div class="section" style="box-shadow:none;">
      <h2>Care Routines</h2>

      <div class="mini-summary-grid">
        <div class="mini-card"><strong>${countToday("miralax")} / 3</strong><span>Miralax Today</span></div>
        <div class="mini-card"><strong>${thisWeekEntries("enema").length} / 2</strong><span>Enemas This Week</span></div>
        <div class="mini-card"><strong>${thisWeekEntries("enema").length ? [...new Set(thisWeekEntries("enema").map(entry => weekdayShort(entry.timestamp)))].join(", ") : "None"}</strong><span>Enema Days</span></div>
        <div class="mini-card"><strong>${latestToday("miralax") ? timeLabel(latestToday("miralax").timestamp) : "—"}</strong><span>Last Miralax</span></div>
      </div>

      <div class="quick-buttons">
        <button onclick="recordMiralax()">🥤 + Miralax</button>
        <button onclick="recordEnema()">⚕️ + Enema</button>
      </div>

      <label for="enemaTimeInput">Manual Enema Time</label>
      <input id="enemaTimeInput" type="time" />

      <label for="enemaNotesInput">Enema Notes</label>
      <textarea id="enemaNotesInput" placeholder="Optional notes..."></textarea>

      <button class="primary-btn" style="margin-top:14px;" onclick="saveManualEnema()">+ Save Manual Enema</button>
    </div>

    <div class="section" style="box-shadow:none;">
      <h2>Health Log</h2>

      <label for="healthStatusInput">Health Status</label>
      <select id="healthStatusInput">
        <option value="">Select status</option>
        <option>Healthy</option>
        <option>Mild Illness</option>
        <option>Sick</option>
        <option>Monitor Closely</option>
      </select>

      <label for="tempSelect">Temperature</label>
      <select id="tempSelect">
        <option value="">No temperature</option>
        ${temperatureOptions()}
      </select>

      <label>Symptoms</label>
      <div class="checkbox-grid">
        ${symptoms.map(symptom => `
          <label><input type="checkbox" name="symptom" value="${symptom}"> ${symptom}</label>
        `).join("")}
      </div>

      <label for="healthNotesInput">Health Notes</label>
      <textarea id="healthNotesInput" placeholder="Example: Congestion worse today, sleeping more than usual..."></textarea>

      <button class="primary-btn" style="margin-top:14px;" onclick="saveHealthLog()">+ Save Health Log</button>
    </div>

    <div class="section" style="box-shadow:none;">
      <h2>Medication Log</h2>

      <div class="form-row">
        <div>
          <label for="medNameInput">Medication</label>
          <input id="medNameInput" placeholder="Example: Tylenol" />
        </div>
        <div>
          <label for="medDoseInput">Dose</label>
          <input id="medDoseInput" placeholder="Example: 10 mL" />
        </div>
      </div>

      <div class="form-row">
        <div>
          <label for="medTimeInput">Time Given</label>
          <input id="medTimeInput" type="time" />
        </div>
        <div>
          <label for="medRepeatInput">Repeat Every</label>
          <select id="medRepeatInput">
            <option value="">No next due time</option>
            <option value="4">4 hours</option>
            <option value="6">6 hours</option>
            <option value="8">8 hours</option>
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
          </select>
        </div>
      </div>

      <label for="medNotesInput">Medication Notes</label>
      <textarea id="medNotesInput" placeholder="Optional notes..."></textarea>

      <button class="primary-btn" style="margin-top:14px;" onclick="saveMedication()">+ Save Medication</button>
    </div>

    <div class="section" style="box-shadow:none; margin-bottom:0;">
      <h2>Health & Meds Timeline</h2>
      <div class="timeline">
        ${
          items.length
            ? items.map(entry => timelineItemHTML(entry)).join("")
            : `<div class="empty">No health or medication entries yet today.</div>`
        }
      </div>
    </div>
  `;
}

function temperatureOptions() {
  let html = "";
  for (let temp = 95; temp <= 105; temp += 0.5) {
    html += `<option value="${temp.toFixed(1)}">${temp.toFixed(1)}°F</option>`;
  }
  return html;
}

function saveHealthLog() {
  const status = document.getElementById("healthStatusInput").value;
  const temp = document.getElementById("tempSelect").value;
  const notes = document.getElementById("healthNotesInput").value.trim();
  const checkedSymptoms = [...document.querySelectorAll('input[name="symptom"]:checked')]
    .map(input => input.value);

  const parts = [];
  if (status) parts.push(`Status: ${status}`);
  if (checkedSymptoms.length) parts.push(`Symptoms: ${checkedSymptoms.join(", ")}`);
  if (notes) parts.push(notes);

  if (temp) {
    entries.push({
      id: crypto.randomUUID(),
      type: "temperature",
      temperature: temp,
      details: `${temp}°F`,
      timestamp: new Date().toISOString()
    });
  }

  if (status || checkedSymptoms.length || notes) {
    entries.push({
      id: crypto.randomUUID(),
      type: "health",
      status,
      symptoms: checkedSymptoms,
      notes,
      details: parts.join(" — "),
      timestamp: new Date().toISOString()
    });
  }

  save();
  render();
  openModal("health");
}

function saveMedication() {
  const medName = document.getElementById("medNameInput").value.trim();
  const dose = document.getElementById("medDoseInput").value.trim();
  const timeInput = document.getElementById("medTimeInput").value;
  const repeatHours = document.getElementById("medRepeatInput").value;
  const notes = document.getElementById("medNotesInput").value.trim();

  if (!medName || !timeInput) return;

  const given = new Date();
  const [hours, minutes] = timeInput.split(":");

  given.setHours(Number(hours));
  given.setMinutes(Number(minutes));
  given.setSeconds(0);
  given.setMilliseconds(0);

  let nextDue = "";
  if (repeatHours) {
    const due = new Date(given);
    due.setHours(due.getHours() + Number(repeatHours));
    nextDue = due.toISOString();
  }

  const parts = [];
  if (dose) parts.push(dose);
  if (nextDue) parts.push(`Next due ${timeLabel(nextDue)}`);
  if (notes) parts.push(notes);

  entries.push({
    id: crypto.randomUUID(),
    type: "medication",
    medName,
    dose,
    repeatHours,
    nextDue,
    notes,
    details: `${medName}${parts.length ? " — " + parts.join(" — ") : ""}`,
    timestamp: given.toISOString()
  });

  save();
  render();
  openModal("health");
}


function supplyStatus(item) {
  const qty = Number(item.quantity) || 0;
  const lowAt = Number(item.lowAt) || 0;

  if (lowAt > 0 && qty <= Math.max(1, Math.floor(lowAt / 2))) {
    return { label: "Critical", className: "status-critical" };
  }

  if (lowAt > 0 && qty <= lowAt) {
    return { label: "Low", className: "status-low" };
  }

  return { label: "OK", className: "status-ok" };
}

function lowSupplies() {
  return supplies.filter(item => {
    const qty = Number(item.quantity) || 0;
    const lowAt = Number(item.lowAt) || 0;
    return lowAt > 0 && qty <= lowAt;
  });
}

function criticalSupplies() {
  return supplies.filter(item => {
    const qty = Number(item.quantity) || 0;
    const lowAt = Number(item.lowAt) || 0;
    return lowAt > 0 && qty <= Math.max(1, Math.floor(lowAt / 2));
  });
}

function renderSuppliesDashboard() {
  const card = document.getElementById("suppliesCard");
  const statusEl = document.getElementById("suppliesStatus");
  const detailsEl = document.getElementById("suppliesDetails");

  if (!card || !statusEl || !detailsEl) return;

  const low = lowSupplies().length;
  const critical = criticalSupplies().length;

  card.classList.remove("supplies-low", "supplies-critical");

  if (critical > 0) {
    statusEl.textContent = `${critical} Critical`;
    detailsEl.textContent = "Supplies";
    card.classList.add("supplies-critical");
  } else if (low > 0) {
    statusEl.textContent = `${low} Low`;
    detailsEl.textContent = "Supplies";
    card.classList.add("supplies-low");
  } else {
    statusEl.textContent = "OK";
    detailsEl.textContent = "Supplies";
  }
}

function purchasesThisMonth() {
  const now = new Date();
  return purchases.filter(purchase => {
    const date = new Date(purchase.timestamp);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
}

function suppliesHTML() {
  const low = lowSupplies();
  const activeWishlist = wishlist.filter(item => !item.completed);
  const completedWishlist = wishlist.filter(item => item.completed);

  return `
    <div class="mini-summary-grid">
      <div class="mini-card"><strong>${supplies.length}</strong><span>Inventory Items</span></div>
      <div class="mini-card"><strong>${low.length}</strong><span>Running Low</span></div>
      <div class="mini-card"><strong>${activeWishlist.length}</strong><span>Wishlist</span></div>
      <div class="mini-card"><strong>${purchasesThisMonth()}</strong><span>Purchases This Month</span></div>
    </div>

    <div class="section" style="box-shadow:none;">
      <h2>Attention Needed</h2>
      <div class="supply-list">
        ${
          low.length
            ? low.map(item => supplyItemHTML(item)).join("")
            : `<div class="empty">No supplies are running low.</div>`
        }
      </div>
    </div>

    <div class="section" style="box-shadow:none;">
      <h2>Inventory</h2>
      <div class="supply-list">
        ${
          supplies.length
            ? supplies.map(item => supplyItemHTML(item)).join("")
            : `<div class="empty">No supplies added yet.</div>`
        }
      </div>
    </div>

    <div class="section" style="box-shadow:none;">
      <h2>Add Supply Item</h2>

      <div class="form-row">
        <div>
          <label for="supplyNameInput">Item Name</label>
          <input id="supplyNameInput" placeholder="Example: Enemas" />
        </div>

        <div>
          <label for="supplyCategoryInput">Category</label>
          <select id="supplyCategoryInput">
            <option>Medical</option>
            <option>Diapering</option>
            <option>Feeding</option>
            <option>Clothing</option>
            <option>Equipment</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div>
          <label for="supplyBrandInput">Brand</label>
          <input id="supplyBrandInput" placeholder="Example: Parent's Choice" />
        </div>

        <div>
          <label for="supplyUrlInput">Product URL</label>
          <input id="supplyUrlInput" type="url" placeholder="https://..." />
        </div>
      </div>

      <div class="form-row">
        <div>
          <label for="supplyQuantityInput">Current Quantity</label>
          <input id="supplyQuantityInput" type="number" min="0" placeholder="Example: 4" />
        </div>

        <div>
          <label for="supplyLowAtInput">Low Warning Quantity</label>
          <input id="supplyLowAtInput" type="number" min="0" placeholder="Example: 6" />
        </div>
      </div>

      <label for="supplyNotesInput">Notes</label>
      <textarea id="supplyNotesInput" placeholder="Optional notes..."></textarea>

      <button class="primary-btn" style="margin-top:14px;" onclick="addSupplyItem()">+ Add Supply</button>
    </div>

    <div class="section" style="box-shadow:none;">
      <h2>+ Record Purchase</h2>

      <div class="form-row">
        <div>
          <label for="purchaseItemInput">Item</label>
          <select id="purchaseItemInput" onchange="toggleCustomPurchaseFields()">
            ${supplies.map(item => `<option value="${item.id}">${item.name}</option>`).join("")}
            <option value="custom">+ Custom Item</option>
          </select>
        </div>

        <div>
          <label for="purchaseQtyInput">Quantity Purchased</label>
          <input id="purchaseQtyInput" type="number" min="1" placeholder="Example: 2" />
        </div>
      </div>

      <div id="customPurchaseFields" style="display:none;">
        <div class="form-row">
          <div>
            <label for="customPurchaseNameInput">Custom Item Name</label>
            <input id="customPurchaseNameInput" placeholder="Example: New bottles" />
          </div>

          <div>
            <label for="customPurchaseCategoryInput">Category</label>
            <select id="customPurchaseCategoryInput">
              <option>Medical</option>
              <option>Diapering</option>
              <option>Feeding</option>
              <option>Clothing</option>
              <option>Equipment</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div>
          <label for="purchaseBrandInput">Brand</label>
          <input id="purchaseBrandInput" placeholder="Example: Parent's Choice" />
        </div>

        <div>
          <label for="purchaseUrlInput">Product URL</label>
          <input id="purchaseUrlInput" type="url" placeholder="https://..." />
        </div>
      </div>

      <div class="form-row">
        <div>
          <label for="purchaseStoreInput">Store</label>
          <input id="purchaseStoreInput" placeholder="Example: Amazon" />
        </div>

        <div>
          <label for="purchaseCostInput">Cost</label>
          <input id="purchaseCostInput" placeholder="Example: 18.99" />
        </div>
      </div>

      <button class="primary-btn" style="margin-top:14px;" onclick="recordPurchase()">+ Record Purchase</button>

      <div class="purchase-list" style="margin-top:14px;">
        ${
          purchases.length
            ? [...purchases].reverse().slice(0, 5).map(p => purchaseItemHTML(p)).join("")
            : `<div class="empty">No purchases recorded yet.</div>`
        }
      </div>
    </div>

    <div class="section" style="box-shadow:none; margin-bottom:0;">
      <h2>Wishlist / Need to Get</h2>

      <div class="form-row">
        <div>
          <label for="wishlistInput">Item to Get</label>
          <input id="wishlistInput" placeholder="Example: Backup thermometer" />
        </div>

        <div style="display:flex; align-items:end;">
          <button class="primary-btn" onclick="addWishlistItem()">+ Add Wishlist Item</button>
        </div>
      </div>

      <div class="wishlist-list" style="margin-top:14px;">
        ${
          wishlist.length
            ? [...activeWishlist, ...completedWishlist].map(item => wishlistItemHTML(item)).join("")
            : `<div class="empty">No wishlist items yet.</div>`
        }
      </div>
    </div>
  `;
}

function supplyItemHTML(item) {
  const status = supplyStatus(item);

  return `
    <div class="supply-item">
      <div class="supply-item-header">
        <div>
          <h3>${item.name}</h3>
          <div class="supply-meta">
            ${item.category} • Current: ${item.quantity} • Low at: ${item.lowAt || "—"}
            ${item.brand ? `<br>Brand: ${item.brand}` : ""}
            ${item.url ? `<br><a href="${item.url}" target="_blank" rel="noopener">Product Link</a>` : ""}
            ${item.notes ? `<br>${item.notes}` : ""}
          </div>
        </div>
        <span class="supply-status ${status.className}">${status.label}</span>
      </div>

      <div class="qty-controls">
        <button onclick="adjustSupplyQty('${item.id}', -1)">-1</button>
        <button onclick="adjustSupplyQty('${item.id}', 1)">+1</button>
        <button onclick="deleteSupplyItem('${item.id}')">Delete</button>
      </div>
    </div>
  `;
}

function purchaseItemHTML(purchase) {
  return `
    <div class="purchase-item">
      <strong>${purchase.itemName}</strong>
      <div class="supply-meta">
        ${dateShort(purchase.timestamp)} • Qty: ${purchase.quantity}
        ${purchase.brand ? ` • Brand: ${purchase.brand}` : ""}
        ${purchase.store ? ` • ${purchase.store}` : ""}
        ${purchase.cost ? ` • $${purchase.cost}` : ""}
        ${purchase.url ? `<br><a href="${purchase.url}" target="_blank" rel="noopener">Product Link</a>` : ""}
      </div>
    </div>
  `;
}

function wishlistItemHTML(item) {
  return `
    <div class="wishlist-item ${item.completed ? "completed-wishlist" : ""}">
      <input type="checkbox" ${item.completed ? "checked" : ""} onchange="toggleWishlistItem('${item.id}')" />
      <span>${item.text}</span>
      <button class="delete-btn" onclick="deleteWishlistItem('${item.id}')">×</button>
    </div>
  `;
}

function addSupplyItem() {
  const name = document.getElementById("supplyNameInput").value.trim();
  const category = document.getElementById("supplyCategoryInput").value;
  const brand = document.getElementById("supplyBrandInput").value.trim();
  const url = document.getElementById("supplyUrlInput").value.trim();
  const quantity = Number(document.getElementById("supplyQuantityInput").value) || 0;
  const lowAt = Number(document.getElementById("supplyLowAtInput").value) || 0;
  const notes = document.getElementById("supplyNotesInput").value.trim();

  if (!name) return;

  supplies.push({
    id: crypto.randomUUID(),
    name,
    category,
    brand,
    url,
    quantity,
    lowAt,
    notes
  });

  saveSupplies();
  render();
  openModal("supplies");
}

function adjustSupplyQty(id, amount) {
  supplies = supplies.map(item => {
    if (item.id !== id) return item;

    return {
      ...item,
      quantity: Math.max(0, (Number(item.quantity) || 0) + amount)
    };
  });

  saveSupplies();
  render();
  openModal("supplies");
}

function deleteSupplyItem(id) {
  if (!confirm("Delete this supply item?")) return;

  supplies = supplies.filter(item => item.id !== id);
  saveSupplies();
  render();
  openModal("supplies");
}

function toggleCustomPurchaseFields() {
  const itemSelect = document.getElementById("purchaseItemInput");
  const customFields = document.getElementById("customPurchaseFields");

  if (!itemSelect || !customFields) return;

  customFields.style.display = itemSelect.value === "custom" ? "block" : "none";
}

function recordPurchase() {
  const itemId = document.getElementById("purchaseItemInput").value;
  const quantity = Number(document.getElementById("purchaseQtyInput").value) || 0;
  const brand = document.getElementById("purchaseBrandInput").value.trim();
  const url = document.getElementById("purchaseUrlInput").value.trim();
  const store = document.getElementById("purchaseStoreInput").value.trim();
  const cost = document.getElementById("purchaseCostInput").value.trim();

  if (!itemId || quantity <= 0) return;

  let item = null;

  if (itemId === "custom") {
    const customName = document.getElementById("customPurchaseNameInput").value.trim();
    const customCategory = document.getElementById("customPurchaseCategoryInput").value;

    if (!customName) return;

    item = {
      id: crypto.randomUUID(),
      name: customName,
      category: customCategory,
      brand,
      url,
      quantity: 0,
      lowAt: 0,
      notes: ""
    };

    supplies.push(item);
  } else {
    item = supplies.find(supply => supply.id === itemId);
    if (!item) return;

    supplies = supplies.map(supply => {
      if (supply.id !== itemId) return supply;

      return {
        ...supply,
        brand: brand || supply.brand || "",
        url: url || supply.url || "",
        quantity: (Number(supply.quantity) || 0) + quantity
      };
    });
  }

  if (itemId === "custom") {
    supplies = supplies.map(supply => {
      if (supply.id !== item.id) return supply;
      return { ...supply, quantity: quantity };
    });
  }

  purchases.push({
    id: crypto.randomUUID(),
    itemId: item.id,
    itemName: item.name,
    quantity,
    brand,
    url,
    store,
    cost,
    timestamp: new Date().toISOString()
  });

  saveSupplies();
  savePurchases();
  render();
  openModal("supplies");
}

function addWishlistItem() {
  const input = document.getElementById("wishlistInput");
  const text = input.value.trim();

  if (!text) return;

  wishlist.push({
    id: crypto.randomUUID(),
    text,
    completed: false
  });

  saveWishlist();
  render();
  openModal("supplies");
}

function toggleWishlistItem(id) {
  wishlist = wishlist.map(item => {
    if (item.id !== id) return item;
    return { ...item, completed: !item.completed };
  });

  saveWishlist();
  render();
  openModal("supplies");
}

function deleteWishlistItem(id) {
  wishlist = wishlist.filter(item => item.id !== id);
  saveWishlist();
  render();
  openModal("supplies");
}


function activityHTML() {
  const positions = countToday("position");
  const walks = countToday("walk");
  const exercises = countToday("exercise");
  const minutes = activityMinutesToday();
  const items = activityEntries();

  return `
    <div class="mini-summary-grid">
      <div class="mini-card"><strong>${positions}</strong><span>Position Changes</span></div>
      <div class="mini-card"><strong>${walks}</strong><span>Walks</span></div>
      <div class="mini-card"><strong>${exercises}</strong><span>Exercise</span></div>
      <div class="mini-card"><strong>${minutes}</strong><span>Activity Minutes</span></div>
    </div>

    <div class="section" style="box-shadow:none;">
      <h2>Quick Add</h2>
      <div class="quick-buttons">
        <button onclick="quickAdd('position')">🔄 + Position Change</button>
        <button onclick="quickAdd('walk')">🚶 + Walk</button>
        <button onclick="quickAdd('exercise')">🏋️ + Exercise</button>
      </div>
    </div>

    <div class="section" style="box-shadow:none;">
      <h2>Manual Activity Entry</h2>
      <div class="form-row">
        <div>
          <label for="activityTypeInput">Type</label>
          <select id="activityTypeInput">
            <option value="position">Position Change</option>
            <option value="walk">Walk</option>
            <option value="exercise">Exercise</option>
          </select>
        </div>
        <div>
          <label for="activityTimeInput">Time</label>
          <input id="activityTimeInput" type="time" />
        </div>
      </div>
      <label for="activityDurationInput">Duration in Minutes</label>
      <input id="activityDurationInput" type="number" min="0" placeholder="Optional, example: 10" />
      <label for="activityNotesInput">Notes</label>
      <textarea id="activityNotesInput" placeholder="Optional notes..."></textarea>
      <button class="primary-btn" style="margin-top:14px;" onclick="saveManualActivity()">+ Save Activity Entry</button>
    </div>

    <div class="section" style="box-shadow:none; margin-bottom:0;">
      <h2>Activity Timeline</h2>
      <div class="timeline">${items.length ? items.map(entry => timelineItemHTML(entry)).join("") : `<div class="empty">No activity entries yet today.</div>`}</div>
    </div>
  `;
}

function hygieneHTML() {
  const teethTotal = countToday("teeth_morning") + countToday("teeth_evening");
  const bath = hasToday("full_bath") ? "Full" : hasToday("sponge_bath") ? "Sponge" : "No";
  const lastNails = latestEver("nails");
  const lastHaircut = latestEver("haircut");
  const lastLotion = latestEver("lotion");
  const items = hygieneEntries();

  return `
    <div class="mini-summary-grid">
      <div class="mini-card"><strong>${teethTotal} / 2</strong><span>Teeth Today</span></div>
      <div class="mini-card"><strong>${bath}</strong><span>Bath Today</span></div>
      <div class="mini-card"><strong>${lastNails ? dateShort(lastNails.timestamp) : "—"}</strong><span>Last Nails</span></div>
      <div class="mini-card"><strong>${lastHaircut ? dateShort(lastHaircut.timestamp) : "—"}</strong><span>Last Haircut</span></div>
      <div class="mini-card"><strong>${lastLotion ? dateShort(lastLotion.timestamp) : "—"}</strong><span>Last Lotion</span></div>
    </div>
    <div class="section" style="box-shadow:none;">
      <h2>Quick Add</h2>
      <div class="quick-buttons">
        <button onclick="quickAdd('teeth_morning')">🪥 + Morning Teeth</button>
        <button onclick="quickAdd('teeth_evening')">🪥 + Evening Teeth</button>
        <button onclick="quickAdd('full_bath')">🚿 + Full Bath</button>
        <button onclick="quickAdd('sponge_bath')">🛁 + Sponge Bath</button>
        <button onclick="quickAdd('nails')">✂️ + Nails Clipped</button>
        <button onclick="quickAdd('lotion')">🧴 + Lotion</button>
        <button onclick="quickAdd('haircut')">💇 + Hair Cut</button>
      </div>
    </div>
    <div class="section" style="box-shadow:none; margin-bottom:0;">
      <h2>Hygiene Timeline</h2>
      <div class="timeline">${items.length ? items.map(entry => timelineItemHTML(entry)).join("") : `<div class="empty">No hygiene entries yet today.</div>`}</div>
    </div>
  `;
}

function diapersHTML() {
  const peeCount = countToday("pee");
  const poopyCount = countToday("poopy");
  const lastPee = latestToday("pee");
  const lastPoopy = latestToday("poopy");
  const items = diaperEntries();

  return `
    <div class="mini-summary-grid">
      <div class="mini-card"><strong>${peeCount}</strong><span>Pee Diapers</span></div>
      <div class="mini-card"><strong>${poopyCount}</strong><span>Poopy Diapers</span></div>
      <div class="mini-card"><strong>${lastPee ? timeLabel(lastPee.timestamp) : "—"}</strong><span>Last Pee</span></div>
      <div class="mini-card"><strong>${lastPoopy ? timeLabel(lastPoopy.timestamp) : "—"}</strong><span>Last Poopy</span></div>
    </div>
    <div class="section" style="box-shadow:none;">
      <h2>Quick Add</h2>
      <div class="quick-buttons">
        <button onclick="quickAdd('pee')">💦 + Pee</button>
        <button onclick="quickAdd('poopy')">💩 + Poopy</button>
      </div>
    </div>
    <div class="section" style="box-shadow:none;">
      <h2>Manual Diaper Entry</h2>
      <div class="form-row">
        <div>
          <label for="diaperTypeInput">Type</label>
          <select id="diaperTypeInput"><option value="pee">Pee</option><option value="poopy">Poopy</option></select>
        </div>
        <div>
          <label for="diaperTimeInput">Time</label>
          <input id="diaperTimeInput" type="time" />
        </div>
      </div>
      <label for="diaperNotesInput">Notes</label>
      <textarea id="diaperNotesInput" placeholder="Optional notes..."></textarea>
      <button class="primary-btn" style="margin-top:14px;" onclick="saveManualDiaper()">+ Save Diaper Entry</button>
    </div>
    <div class="section" style="box-shadow:none; margin-bottom:0;">
      <h2>Diaper Timeline</h2>
      <div class="timeline">${items.length ? items.map(entry => timelineItemHTML(entry)).join("") : `<div class="empty">No diaper entries yet today.</div>`}</div>
    </div>
  `;
}

function feedingHydrationHTML() {
  const wake = firstToday("wake");
  const waterCount = countToday("water");
  const waterPercent = Math.min((waterCount / 3) * 100, 100);
  const feedItems = feedingEntries();

  return `
    <div class="mini-summary-grid">
      <div class="mini-card"><strong>${wake ? timeLabel(wake.timestamp) : "—"}</strong><span>Wake Up</span></div>
      <div class="mini-card"><strong>${countToday("shake")}</strong><span>Shakes</span></div>
      <div class="mini-card"><strong>${waterCount} / 3</strong><span>Water Cups</span></div>
      <div class="mini-card"><strong>${countToday("food")}</strong><span>Foods Logged</span></div>
    </div>
    <div class="section" style="box-shadow:none;">
      <h2>Quick Add</h2>
      <div class="quick-buttons">
        <button onclick="openModal('wake')">☀️ + Wake Up</button>
        <button onclick="quickAdd('shake')">🍼 + Shake</button>
        <button onclick="quickAdd('water', '8 oz / 1 cup')">💧 + Water</button>
        <button onclick="openModal('food')">🍎 + Food</button>
      </div>
    </div>
    <div class="section" style="box-shadow:none;">
      <h2>Water Goal</h2>
      <strong>${waterCount} / 3 cups</strong>
      <div class="progress-shell"><div class="progress-fill" style="width:${waterPercent}%;"></div></div>
      <p style="color:var(--muted); margin-bottom:0;">Each water tap records 8 oz / 1 cup.</p>
    </div>
    <div class="section" style="box-shadow:none; margin-bottom:0;">
      <h2>Feeding Timeline</h2>
      <div class="timeline">${feedItems.length ? feedItems.map(entry => timelineItemHTML(entry)).join("") : `<div class="empty">No feeding or hydration entries yet today.</div>`}</div>
    </div>
  `;
}

function foodFormHTML() {
  return `
    <label for="foodInput">Food Given</label>
    <input id="foodInput" placeholder="Example: Applesauce" />
    <div class="favorite-wrap">
      ${foodFavorites.map(food => `<button class="favorite-chip" onclick="setFoodFavorite('${escapeJS(food)}')">${food}</button>`).join("")}
    </div>
    <label for="foodNotes">Notes</label>
    <textarea id="foodNotes" placeholder="Example: Ate well, refused, small amount..."></textarea>
    <button class="primary-btn" style="margin-top:14px;" onclick="saveFood()">+ Save Food Entry</button>
    <hr style="border:none; border-top:1px solid var(--border); margin:20px 0;">
    <button class="pill-btn" onclick="openModal('foodFavorites')">⚙️ Edit Favorite Foods</button>
  `;
}

function setFoodFavorite(food) {
  document.getElementById("foodInput").value = food;
}

function saveFood() {
  const food = document.getElementById("foodInput").value.trim();
  const notes = document.getElementById("foodNotes").value.trim();

  if (!food) return;

  entries.push({
    id: crypto.randomUUID(),
    type: "food",
    food,
    details: notes ? `${food} — ${notes}` : food,
    notes,
    timestamp: new Date().toISOString()
  });

  save();
  render();
  openModal("feeding");
}

function foodFavoritesHTML() {
  return `
    <label for="newFavoriteInput">Add Favorite Food</label>
    <input id="newFavoriteInput" placeholder="Example: Scrambled eggs" />
    <button class="primary-btn" style="margin-top:12px;" onclick="addFoodFavorite()">+ Add Favorite</button>
    <div class="favorite-list">
      ${foodFavorites.length ? foodFavorites.map((food, index) => `
        <div class="favorite-row">
          <strong>${food}</strong>
          <button class="delete-btn" onclick="deleteFoodFavorite(${index})">×</button>
        </div>`).join("") : `<div class="empty">No favorite foods yet.</div>`}
    </div>
    <button class="pill-btn" style="margin-top:16px;" onclick="openModal('food')">Back to Food Entry</button>
  `;
}

function addFoodFavorite() {
  const input = document.getElementById("newFavoriteInput");
  const value = input.value.trim();

  if (!value) return;

  foodFavorites.push(value);
  saveFavorites();
  openModal("foodFavorites");
}

function deleteFoodFavorite(index) {
  foodFavorites.splice(index, 1);
  saveFavorites();
  openModal("foodFavorites");
}

function noteFormHTML() {
  return `
    <label for="noteInput">Concern or Note</label>
    <textarea id="noteInput" placeholder="Write anything you want to remember..."></textarea>
    <label for="moodInput">Mood Today</label>
    <select id="moodInput">
      <option value="">Select mood</option>
      <option>Great</option>
      <option>Good</option>
      <option>Okay</option>
      <option>Fussy</option>
      <option>Tired</option>
      <option>Sick</option>
    </select>
    <button class="primary-btn" style="margin-top:14px;" onclick="saveNote()">Save</button>
  `;
}

function saveNote() {
  const note = document.getElementById("noteInput").value.trim();
  const mood = document.getElementById("moodInput").value;

  if (note) quickAdd("note", note);
  if (mood) quickAdd("mood", mood);

  closeModal();
}

function clearAllData() {
  if (!confirm("Clear all saved caregiver entries on this device?")) return;
  entries = [];
  save();
  render();
  closeModal();
}

function escapeJS(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

render();
