// API KEY
const apiKey = "29e4cf02e40a477e8be45442250311";

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


// Store last city in sessionStorage
function saveLastCity(city) {
  sessionStorage.setItem("lastCity", city);
}

function clearStoredData() {
  sessionStorage.removeItem("lastCity");

  // Clear main weather display
  cityEl.textContent = "";
  tempEl.textContent = "";
  descEl.textContent = "";
  iconEl.src = "";

  // Clear forecast cards/History
  document.getElementById("forecast-cards").innerHTML = "";
  document.getElementById("history-cards").innerHTML = "";

  alert(
    "Local data cleared. To fully remove location permissions, go to your browser's settings > Site permissions > Location."
  );
}


// Fetch weather for a city
async function getWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=3&aqi=no&alerts=no`
    );
    if (!response.ok) throw new Error("City not found or invalid API key");
    const data = await response.json();
    displayWeather(data);
    saveLastCity(city);
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Fetch weather using coordinates
async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3&aqi=no&alerts=no`
    );
    if (!response.ok) throw new Error("Failed to fetch location weather");
    const data = await response.json();
    displayWeather(data);
    saveLastCity(data.location.name);
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Display current weather
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
  
// If History tab is open, refresh history
if (historySection.classList.contains("active")) {
  getHistoricalWeather(data.location.name);
}

  // Display 3-day forecast
  displayForecast(data);
}

// Display 3-day forecast
function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast-cards");
  forecastDiv.innerHTML = ""; // Clear old forecast

  const days = data.forecast.forecastday;

  days.forEach(day => {
    const date = day.date;
    const max = Math.round(day.day.maxtemp_f);
    const min = Math.round(day.day.mintemp_f);
    const icon = day.day.condition.icon;
    const text = day.day.condition.text;

    const card = document.createElement("div");
    card.classList.add("forecast-card");

    card.innerHTML = `
      <h4>${date}</h4>
      <img src="https:${icon}" alt="${text}">
      <p>${text}</p>
      <p><strong>${max}°F</strong> / ${min}°F</p>
    `;

    forecastDiv.appendChild(card);
  });
}

function displayHistory(historyData) {
  const historyDiv = document.getElementById("history-cards");
  historyDiv.innerHTML = "";

  historyData.forEach(day => {
    const date = day.forecast.forecastday[0].date;
    const info = day.forecast.forecastday[0].day;

    const temp = Math.round(info.avgtemp_f);
    const icon = info.condition.icon;
    const desc = info.condition.text;

    const card = document.createElement("div");
    card.classList.add("history-card");

    card.innerHTML = `
      <h4>${date}</h4>
      <img src="https:${icon}" alt="${desc}">
      <p>${desc}</p>
      <p><strong>${temp}°F</strong></p>
    `;

    historyDiv.appendChild(card);
  });
}


// Buttons
btnManual.addEventListener("click", () => {
  const city = document.getElementById("manual-city").value.trim();
  if (city) getWeatherByCity(city);
  else alert("Please enter a city name.");
});

btnExact.addEventListener("click", () => {
  getExactLocationWeather();
});

btnClear.addEventListener("click", clearStoredData);

// Geolocation
function getExactLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => alert("Unable to access your location.")
    );
  } else {
    alert("Geolocation not supported by your browser.");
  }
}

// Auto-load last city or exact location
window.addEventListener("load", () => {
  const lastCity = sessionStorage.getItem("lastCity");
  if (lastCity) {
    getWeatherByCity(lastCity);
  } else {
    getExactLocationWeather();
  }
});

// Tabs
const tabWeather = document.getElementById("tab-weather");
const tabPrivacy = document.getElementById("tab-privacy");

const weatherSection = document.getElementById("weather-section");
const privacySection = document.getElementById("privacy-section");

function clearAllTabs() {
  tabWeather.classList.remove("active");
  tabPrivacy.classList.remove("active");
  tabHistory.classList.remove("active");

  weatherSection.classList.remove("active");
  privacySection.classList.remove("active");
  historySection.classList.remove("active");
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

  // Load history for last loaded city
  const lastCity = sessionStorage.getItem("lastCity");
  if (lastCity) getHistoricalWeather(lastCity);
});


async function getHistoricalWeather(city) {
  const historyDiv = document.getElementById("history-cards");
  historyDiv.innerHTML = "<p>Loading history...</p>";

  const days = [];
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const formatted = date.toISOString().split("T")[0];
    days.push(formatted);
  }

  const results = [];

  for (const dt of days) {
    try {
      const url = `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${encodeURIComponent(city)}&dt=${dt}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("History fetch failed");
      const data = await response.json();
      results.push(data);
    } catch (err) {
      console.error("History error:", err);
    }
  }

  displayHistory(results);
}
