// 1. DATA MAPPING (Mapped to your SVG filenames)
const weatherEffects = {
  0:  { icon: "clear-day.svg", color: "#f1c40f" },             // Clear
  1:  { icon: "partly-cloudy-day.svg", color: "#f39c12" },    // Mainly Clear
  2:  { icon: "partly-cloudy-day.svg", color: "#bdc3c7" },    // Partly Cloudy
  3:  { icon: "overcast.svg", color: "#95a5a6" },             // Overcast
  45: { icon: "fog.svg", color: "#95a5a6" },                  // Fog
  51: { icon: "drizzle.svg", color: "#3498db" },              // Drizzle
  61: { icon: "rain.svg", color: "#2980b9" },                 // Rain
  71: { icon: "snow.svg", color: "#ecf0f1" },                 // Snow
  80: { icon: "partly-cloudy-day-rain.svg", color: "#3498db" },// Showers
  95: { icon: "thunderstorms.svg", color: "#8e44ad" }         // Thunderstorm
};

// 2. THE ENGINE
async function updateWeather() {
  const city = document.getElementById('cityInput').value;
  const button = document.getElementById('searchBtn');
  const cityNameHeading = document.getElementById('cityName');
  const iconContainer = document.getElementById('icon-container');

  if (!city) return;

  button.disabled = true;
  button.innerText = "Loading...";
  cityNameHeading.innerText = "Searching...";

  try {
    // Step A: Geocoding
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results) {
      alert("City not found!");
      cityNameHeading.innerText = "City Name";
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    // Step B: Weather Data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature,precipitation_probability`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    // Step C: Logic
    const code = weatherData.current_weather.weathercode;
    const info = weatherEffects[code] || { icon: "overcast.svg", color: "#ecf0f1" };
    
    const currentTemp = Math.round(weatherData.current_weather.temperature);
    const feelsLike = Math.round(weatherData.hourly.apparent_temperature[0]);
    const humidity = weatherData.hourly.relative_humidity_2m[0];
    const rainChance = weatherData.hourly.precipitation_probability[0];

    // Step D: Update UI
    // Inject the SVG Image
    iconContainer.innerHTML = `<img src="${info.icon}" alt="Weather Icon">`;
    
    cityNameHeading.innerText = name;
    document.getElementById('temp').innerText = `${currentTemp}°C`;
    document.getElementById('feelsLike').innerText = `Feels like ${feelsLike}°C`;
    document.getElementById('wind').innerText = `Wind: ${weatherData.current_weather.windspeed} km/h`;
    document.getElementById('rain').innerText = `Rain: ${rainChance}%`;
    document.getElementById('humidity').innerText = `Humidity: ${humidity}%`;

    document.body.style.backgroundColor = info.color;

  } catch (error) {
    console.error(error);
    cityNameHeading.innerText = "Error!";
  } finally {
    button.disabled = false;
    button.innerText = "Get Weather";
  }
}

// 3. LISTENERS
document.getElementById('searchBtn').addEventListener('click', updateWeather);
document.getElementById('cityInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') updateWeather();
});
