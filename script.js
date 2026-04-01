ok. Teach me about js in weather apps like this one: // 1. DATA MAPPING
const weatherEffects = {
  0:  { icon: "☀️", color: "#f1c40f" }, // Clear
  1:  { icon: "🌤️", color: "#f39c12" }, // Mainly Clear
  2:  { icon: "⛅", color: "#bdc3c7" }, // Partly Cloudy
  3:  { icon: "☁️", color: "#95a5a6" }, // Overcast
  61: { icon: "🌧️", color: "#3498db" }, // Rain
  95: { icon: "⛈️", color: "#8e44ad" }  // Thunderstorm
};

// 2. THE ENGINE
async function updateWeather() {
  const city = document.getElementById('cityInput').value;
  const button = document.getElementById('searchBtn'); // Get the button
  const cityNameHeading = document.getElementById('cityName');

  if (!city) return;

  // --- START LOADING ---
  button.disabled = true;
  button.innerText = "Loading...";
  cityNameHeading.innerText = "Searching...";

  try {
    // Step A: Get Coordinates
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results) {
      alert("City not found!");
      cityNameHeading.innerText = "City Name";
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    // Step B: Get Weather (We added humidity and apparent_temp here!)
   const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature,precipitation_probability`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    // Step C: Choose Icon and Color
    const code = weatherData.current_weather.weathercode;
    const info = weatherEffects[code] || { icon: "🌡️", color: "#ecf0f1" };
    const currentTemp = weatherData.current_weather.temperature;
    
    // Dig out the extra info from the [0] position of the arrays
    const feelsLike = weatherData.hourly.apparent_temperature[0];
    const humidity = weatherData.hourly.relative_humidity_2m[0];

    // Step D: Update the Screen (The DOM)
    cityNameHeading.innerText = `${name} ${info.icon}`;
    document.getElementById('temp').innerText = `Temperature: ${currentTemp}°C`;
    document.getElementById('wind').innerText = `Wind: ${weatherData.current_weather.windspeed} km/h`;
    // 1. Get the rain probability for the current hour
const rainChance = weatherData.hourly.precipitation_probability[0];

// 2. Put it into the HTML element with id="rain"
document.getElementById('rain').innerText = `Rain Chance: ${rainChance}%`;
    // NEW: Display the extra info (Make sure these IDs exist in your HTML!)
    if(document.getElementById('feelsLike')) {
      document.getElementById('feelsLike').innerText = `Feels Like: ${feelsLike}°C`;
    }
    if(document.getElementById('humidity')) {
      document.getElementById('humidity').innerText = `Humidity: ${humidity}%`;
    }

    document.body.style.backgroundColor = info.color;

  } catch (error) {
    console.error(error);
    cityNameHeading.innerText = "Error loading data.";
  } finally {
    // --- STOP LOADING (Always happens) ---
    button.disabled = false;
    button.innerText = "Get Weather";
  }
}

// 3. THE IGNITION
document.getElementById('searchBtn').addEventListener('click', updateWeather);
document.getElementById('cityInput').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    updateWeather();
  }
});