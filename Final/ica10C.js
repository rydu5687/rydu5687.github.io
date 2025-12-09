// API KEY
const apiKey = "29e4cf02e40a477e8be45442250311";

let map;
let activeLayer = null;
let lastCoords = { lat: 40.015, lon: -105.270 };
let currentLayerType = "radar";

// Elements
const cityEl = document.getElementById("weather-city");
const tempEl = document.getElementById("weather-temp");
const descEl = document.getElementById("weather-desc");
const iconEl = document.getElementById("weather-icon");

const btnExact = document.getElementById("btn-exact");
const btnManual = document.getElementById("btn-manual");
const btnClear = document.getElementById("btn-clear");

const tabHistory = document.getElementById("tab-history");
const historySection = document.getElementById("history-section");

// MAP ELEMENTS
const tabMaps = document.getElementById("tab-maps");
const mapsSection = document.getElementById("maps-section");

tabMaps.addEventListener("click", () => {
  clearAllTabs();
  tabMaps.classList.add("active");
  mapsSection.classList.add("active");

  // Recalculate map layout after becoming visible
  setTimeout(() => {
    initWeatherMap();
    map?.invalidateSize();
  }, 150);
});

/* WEATHERAPI TILE URL BUILDER */
function getWeatherapiTileURL(layer) {
  const now = new Date();

  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const hh = String(now.getUTCHours()).padStart(2, "0");

  const dateHour = `${yyyy}${mm}${dd}${hh}`;

  const mapping = {
    radar: "precip",
    cloud: "cloud",
    temp: "tmp2m",
    wind: "wind"
  };

  return `https://weathermaps.weatherapi.com/${mapping[layer]}/tiles/${dateHour}/{z}/{x}/{y}.png?key=${apiKey}`;
}

/* INITIALIZE MAP */
function initWeatherMap() {
  if (map) return;

  map = L.map("map-canvas").setView([lastCoords.lat, lastCoords.lon], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  loadWeatherLayer("radar");
}

/* LOAD WEATHER LAYER */
function loadWeatherLayer(layer) {
  currentLayerType = layer;

  if (!map) return;
  if (activeLayer) map.removeLayer(activeLayer);

  const url = getWeatherapiTileURL(layer);
  if (!url) return;

  activeLayer = L.tileLayer(url, {
    tileSize: 256,
    opacity: 0.75
  });

  activeLayer.addTo(map);
}

// ---- STORAGE ----
function saveLastCity(city) {
  sessionStorage.setItem("lastCity", city);
}

function clearStoredData() {
  sessionStorage.removeItem("lastCity");

  cityEl.textContent = "";
  tempEl.textContent = "";
  descEl.textContent = "";
  iconEl.src = "";

  document.getElementById("forecast-cards").innerHTML = "";
  document.getElementById("history-cards").innerHTML = "";

  alert("Local data cleared.");
}

// ---- WEATHER FETCH ----
async function getWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
        city
      )}&days=3&aqi=yes&alerts=yes`
    );
    if (!response.ok) throw new Error("City not found or invalid API key");
    const data = await response.json();

    displayWeather(data);
    displayExtras(data);
    saveLastCity(city);
  } catch (err) {
    alert("Error: " + err.message);
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3&aqi=yes&alerts=yes`
    );
    if (!response.ok) throw new Error("Failed to fetch location weather");
    const data = await response.json();

    displayWeather(data);
    displayExtras(data);
    saveLastCity(data.location.name);
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// ---- WEATHER BACKGROUND & EFFECTS ----
function updateBackground(condition, isDay) {
  const sky = document.getElementById("sky-bg");
  const text = condition.toLowerCase();
  let cls = "";
  let type = "";

  if (text.includes("sunny") || text.includes("clear")) {
    type = "sunny";
    cls = isDay ? "bg-sunny-day" : "bg-sunny-night";
  } else if (text.includes("cloud") || text.includes("overcast")) {
    type = "cloudy";
    cls = isDay ? "bg-cloudy-day" : "bg-cloudy-night";
  } else if (text.includes("rain") || text.includes("drizzle")) {
    type = "rainy";
    cls = isDay ? "bg-rainy-day" : "bg-rainy-night";
  } else if (
    text.includes("snow") ||
    text.includes("ice") ||
    text.includes("sleet") ||
    text.includes("flurries") ||
    text.includes("blizzard")
  ) {
    type = "snowy";
    cls = isDay ? "bg-snowy-day" : "bg-snowy-night";
  } else {
    type = "cloudy";
    cls = isDay ? "bg-cloudy-day" : "bg-cloudy-night";
  }

  sky.className = cls;
  updateWeatherEffects(type, isDay);
}

// ---- EFFECTS SYSTEM ----
function updateWeatherEffects(type, isDay) {
  const effects = document.getElementById("weather-effects");
  if (!effects) return;

  effects.innerHTML = "";
  effects.className = "";

  if (type === "sunny") {
    if (!isDay) {
      effects.classList.add("starry");
      createStars(effects, 80);
    }
    return;
  }

  if (type === "cloudy") {
    effects.classList.add("cloudy");
    createClouds(effects, isDay, 3);
    if (!isDay) {
      effects.classList.add("starry");
      createStars(effects, 60);
    }
    return;
  }

  if (type === "rainy") {
    effects.classList.add("rainy");
    createRain(effects, 90);
    return;
  }

  if (type === "snowy") {
    effects.classList.add("snowy");
    createSnow(effects, 70);
    if (!isDay) {
      effects.classList.add("starry");
      createStars(effects, 40);
    }
    return;
  }
}

// ---- PARTICLES ----
function createStars(container, count) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    const size = 1 + Math.random() * 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.animationDuration = `${2 + Math.random() * 3}s`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    container.appendChild(star);
  }
}

function createRain(container, count) {
  for (let i = 0; i < count; i++) {
    const drop = document.createElement("div");
    drop.classList.add("raindrop");
    drop.style.left = `${Math.random() * 100}vw`;
    drop.style.animationDuration = `${0.8 + Math.random() * 0.8}s`;
    drop.style.animationDelay = `${Math.random() * 1.5}s`;
    drop.style.opacity = `${0.3 + Math.random() * 0.5}`;
    container.appendChild(drop);
  }
}

function createSnow(container, count) {
  for (let i = 0; i < count; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");
    const size = 4 + Math.random() * 5;
    flake.style.width = `${size}px`;
    flake.style.height = `${size}px`;
    flake.style.left = `${Math.random() * 100}vw`;
    flake.style.animationDuration = `${6 + Math.random() * 6}s`;
    flake.style.animationDelay = `${Math.random() * 4}s`;
    container.appendChild(flake);
  }
}

function createClouds(container, isDay, count) {
  for (let i = 0; i < count; i++) {
    const band = document.createElement("div");
    band.classList.add("cloud-band");
    const top = 10 + i * 20 + Math.random() * 10;
    band.style.top = `${top}vh`;
    band.style.background = isDay
      ? "rgba(255,255,255,0.7)"
      : "rgba(200,210,225,0.35)";
    band.style.animationDuration = `${50 + Math.random() * 20}s`;
    band.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(band);
  }
}

// ---- WEATHER DISPLAY ----
function displayWeather(data) {
  const temp = Math.round(data.current.temp_f);
  const desc = data.current.condition.text;
  const city = data.location.name;
  const icon = data.current.condition.icon;

  cityEl.textContent = ` ${city}`;
  tempEl.textContent = `${temp}°F`;
  descEl.textContent = desc;
  iconEl.src = "https:" + icon;
  iconEl.alt = desc;

  lastCoords.lat = data.location.lat;
  lastCoords.lon = data.location.lon;

  updateBackground(desc, data.current.is_day);

  if (historySection.classList.contains("active")) {
    getHistoricalWeather(city);
  }

  displayForecast(data);
}

function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast-cards");
  forecastDiv.innerHTML = "";

  data.forecast.forecastday.forEach((day) => {
    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <h4>${day.date}</h4>
      <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
      <p>${day.day.condition.text}</p>
      <p><strong>${Math.round(day.day.maxtemp_f)}°F</strong> / ${Math.round(day.day.mintemp_f)}°F</p>
    `;

    forecastDiv.appendChild(card);
  });
}

function displayHistory(historyData) {
  const historyDiv = document.getElementById("history-cards");
  historyDiv.innerHTML = "";

  historyData.forEach((day) => {
    const info = day.forecast.forecastday[0].day;

    const card = document.createElement("div");
    card.classList.add("history-card");

    card.innerHTML = `
      <h4>${day.forecast.forecastday[0].date}</h4>
      <img src="https:${info.condition.icon}" alt="${info.condition.text}">
      <p>${info.condition.text}</p>
      <p><strong>${Math.round(info.avgtemp_f)}°F</strong></p>
    `;

    historyDiv.appendChild(card);
  });
}

// ---- BUTTON HANDLERS ----
btnManual.addEventListener("click", () => {
  const city = document.getElementById("manual-city").value.trim();
  if (city) getWeatherByCity(city);
  else alert("Please enter a city name.");
});

btnExact.addEventListener("click", () => {
  getExactLocationWeather();
});

btnClear.addEventListener("click", clearStoredData);

// ---- GEOLOCATION ----
function getExactLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => getWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => alert("Unable to access your location.")
    );
  } else {
    alert("Geolocation not supported.");
  }
}

// ---- AUTO LOAD ----
window.addEventListener("load", () => {
  const lastCity = sessionStorage.getItem("lastCity");
  lastCity ? getWeatherByCity(lastCity) : getExactLocationWeather();
});

// ---- TABS ----
const tabWeather = document.getElementById("tab-weather");
const tabPrivacy = document.getElementById("tab-privacy");
const weatherSection = document.getElementById("weather-section");
const privacySection = document.getElementById("privacy-section");

function clearAllTabs() {
  tabWeather.classList.remove("active");
  tabPrivacy.classList.remove("active");
  tabHistory.classList.remove("active");
  tabMaps.classList.remove("active");

  weatherSection.classList.remove("active");
  privacySection.classList.remove("active");
  historySection.classList.remove("active");
  mapsSection.classList.remove("active");
}

tabWeather.addEventListener("click", () => {
  clearAllTabs();
  tabWeather.classList.add("active");
  weatherSection.classList.add("active");
});

tabPrivacy.addEventListener("click", () => {
  clearAllTabs();
  tabPrivacy.classList.add("active");
  privacySection.classList.add("active");
});

tabHistory.addEventListener("click", () => {
  clearAllTabs();
  tabHistory.classList.add("active");
  historySection.classList.add("active");

  const lastCity = sessionStorage.getItem("lastCity");
  if (lastCity) getHistoricalWeather(lastCity);
});

tabMaps.addEventListener("click", () => {
  clearAllTabs();
  tabMaps.classList.add("active");
  mapsSection.classList.add("active");
  initWeatherMap();
});

// ---- HISTORY FETCH ----
async function getHistoricalWeather(city) {
  const historyDiv = document.getElementById("history-cards");
  historyDiv.innerHTML = "<p>Loading history...</p>";

  const days = [];
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().split("T")[0]);
  }

  const results = [];
  for (const dt of days) {
    try {
      const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${encodeURIComponent(
        city
      )}&dt=${dt}`;
      const response = await fetch(url);
      if (response.ok) results.push(await response.json());
    } catch (err) {
      console.error("History fetch error:", err);
    }
  }

  displayHistory(results);
}

// ---- EXTRAS ----
const extrasBtn = document.getElementById("extras-btn");
const extrasDropdown = document.getElementById("extras-dropdown");

extrasBtn.addEventListener("click", () => {
  extrasDropdown.classList.toggle("active");
  extrasBtn.textContent = extrasDropdown.classList.contains("active")
    ? "Extras ▲"
    : "Extras ▼";
});

function displayExtras(data) {
  const aqi = data?.current?.air_quality?.["us-epa-index"];
  const aqiText = {
    1: "Good",
    2: "Moderate",
    3: "Unhealthy for Sensitive Groups",
    4: "Unhealthy",
    5: "Very Unhealthy",
    6: "Hazardous"
  };

  document.getElementById("aqi-value").textContent =
    aqi ? `AQI: ${aqi}` : "AQI data not available";

  document.getElementById("aqi-desc").textContent = aqi ? aqiText[aqi] : "";

  const alerts = data?.alerts?.alert;
  const alertBox = document.getElementById("alerts-content");
  alertBox.innerHTML = "";

  if (!alerts || alerts.length === 0) {
    alertBox.innerHTML = "<p>No active alerts</p>";
  } else {
    alerts.forEach((a) => {
      const div = document.createElement("div");
      div.style.marginBottom = "12px";
      div.innerHTML = `
        <strong>${a.event}</strong><br>
        <em>${a.headline}</em><br>
        <p style="margin-top:6px;">${a.desc}</p>
      `;
      alertBox.appendChild(div);
    });
  }
}

/* MAP LAYER BUTTONS */
document.getElementById("btn-layer-radar").addEventListener("click", () => {
  loadWeatherLayer("radar");
});

document.getElementById("btn-layer-cloud").addEventListener("click", () => {
  loadWeatherLayer("cloud");
});

document.getElementById("btn-layer-temp").addEventListener("click", () => {
  loadWeatherLayer("temp");
});

document.getElementById("btn-layer-wind").addEventListener("click", () => {
  loadWeatherLayer("wind");
});
