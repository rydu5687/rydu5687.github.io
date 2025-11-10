// API KEY
const apiKey = "29e4cf02e40a477e8be45442250311";

// Eleme  nts
const cityEl = document.getElementById("weather-city");
const tempEl = document.getElementById("weather-temp");
const descEl = document.getElementById("weather-desc");
const iconEl = document.getElementById("weather-icon");

const btnExact = document.getElementById("btn-exact");
const btnManual = document.getElementById("btn-manual");
const btnClear = document.getElementById("btn-clear");

// Store last city in sessionStorage
function saveLastCity(city) {
  sessionStorage.setItem("lastCity", city);
}

function clearStoredData() {
  sessionStorage.removeItem("lastCity");
  cityEl.textContent = "";
  tempEl.textContent = "";
  descEl.textContent = "";
  iconEl.src = "";
  alert(
    "Local data cleared. To fully remove location permissions, go to your browser's settings > Site permissions > Location."
  );
}

// City name search
async function getWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=no`
    );
    if (!response.ok) throw new Error("City not found or invalid API key");
    const data = await response.json();
    displayWeather(data);
    saveLastCity(city);
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Exact location search
async function getWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`
    );
    if (!response.ok) throw new Error("Failed to fetch location weather");
    const data = await response.json();
    displayWeather(data);
    saveLastCity(data.location.name);
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Display weather
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

// Geolcoation
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

// Auto-detected location if on
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

tabWeather.addEventListener("click", () => {
  tabWeather.classList.add("active");
  tabPrivacy.classList.remove("active");
  weatherSection.classList.add("active");
  privacySection.classList.remove("active");
});

tabPrivacy.addEventListener("click", () => {
  tabPrivacy.classList.add("active");
  tabWeather.classList.remove("active");
  privacySection.classList.add("active");
  weatherSection.classList.remove("active");
});
