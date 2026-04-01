// 1. DATA MAPPING (Using your provided SVG list)
const weatherEffects = {
  0:  { icon: "clear-day.svg", color: "#f1c40f" },
  1:  { icon: "partly-cloudy-day.svg", color: "#f39c12" },
  2:  { icon: "partly-cloudy-day.svg", color: "#bdc3c7" },
  3:  { icon: "overcast.svg", color: "#95a5a6" },
  45: { icon: "fog.svg", color: "#95a5a6" },
  51: { icon: "drizzle.svg", color: "#3498db" },
  61: { icon: "rain.svg", color: "#2980b9" },
  71: { icon: "snow.svg", color: "#ecf0f1" },
  80: { icon: "partly-cloudy-day-rain.svg", color: "#3498db" },
  95: { icon: "thunderstorms.svg", color: "#8e44ad" }
};

async function updateWeather() {
  const city = document.getElementById('cityInput').value;
  const button = document.getElementById('searchBtn');
  const cityNameHeading = document.getElementById('cityName');
  const iconDiv = document.getElementById('icon-container');

  if (!city) return;

  button.disabled = true;
  button.innerText = "Loading...";
  cityNameHeading.innerText = "Searching...";

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results) {
      alert("City not found!");
      cityNameHeading.innerText = "City Name";
      return;
    }

    const { latitude, longitude, name } = geoData.results[0];

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature,precipitation_probability`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const code = weatherData.current_weather.weathercode;
    const info = weatherEffects[code] || { icon: "overcast.svg", color: "#ecf0f1" };
    
    // UI Updates
    iconDiv.innerHTML = `<img src="${info.icon}" width="100" height="100">`;
    cityNameHeading.innerText = name;
    
    document.getElementById('temp').innerText = `Temperature: ${weatherData.current_weather.temperature}°C`;
    document.getElementById('wind').innerText = `Wind: ${weatherData.current_weather.windspeed} km/h`;
    document.getElementById('rain').innerText = `Rain Chance: ${weatherData.hourly.precipitation_probability[0]}%`;
    document.getElementById('feelsLike').innerText = `Feels Like: ${weatherData.hourly.apparent_temperature[0]}°C`;
    document.getElementById('humidity').innerText = `Humidity: ${weatherData.hourly.relative_humidity_2m[0]}%`;

    document.body.style.backgroundColor = info.color;

  } catch (error) {
    console.error(error);
    cityNameHeading.innerText = "Error loading data.";
  } finally {
    button.disabled = false;
    button.innerText = "Get Weather";
  }
}

document.getElementById('searchBtn').addEventListener('click', updateWeather);
document.getElementById('cityInput').addEventListener('keypress', (e) => { if (e.key === 'Enter') updateWeather(); });
