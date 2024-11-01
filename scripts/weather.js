const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'fbf70f7fdbmsh937e53d37ab5260p1de2c9jsn1871eaa3139e',
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
    }
};

const KELVIN_TO_CELSIUS = 273.15;
const FAHRENHEIT_TO_CELSIUS = (temp) => (temp - 32) * 5 / 9;

async function fetchWeatherData(url) {
    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
        handleFetchError(response.status);
        throw new Error(`Error: ${response.status}`);
    }

    return result;
}

function handleFetchError(status) {
    const errorElement = document.getElementById("error");
    if (status === 429) {
        errorElement.textContent = 'Zu viele Zugriffe - STATUS: 429';
    } else if (status >= 500) {
        errorElement.textContent = `Server Error - STATUS: ${status}`;
    } else if (status >= 300 && status < 400) {
        errorElement.textContent = `Redirect Error - STATUS: ${status}`;
    }
}

function displayCurrentWeather(result, city) {
    const temperature = FAHRENHEIT_TO_CELSIUS(result.main.temp);
    const { description: condi, icon: currentIcon } = result.weather[0];
    const humidity = result.main.humidity;
    const wind = result.wind.speed;
    const { lat, lon: long } = result.coord;

    document.getElementById("cityName").textContent = city;
    document.getElementById("temperature").textContent = `${temperature.toFixed(0)} °C`;
    document.getElementById("condition").textContent = condi;
    document.getElementById("windSpeed").textContent = `${wind} km/h`;
    document.getElementById("humidity").textContent = `${humidity} %`;
    document.getElementById("citySearch").value = "";

    const iconElement = document.getElementById("currentIcon");
    iconElement.setAttribute("src", `https://openweather.site/img/wn/${currentIcon}.png`);
    document.getElementById("weatherInfo").style.display = "block";

    return { lat, long, currentIcon };
}

function displayForecast(forecastEntries) {
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = ''; // Clear previous entries

    forecastEntries.forEach(entry => {
        const forecastDiv = document.createElement('div');
        forecastDiv.className = 'text-center glass shadow me-2';
        forecastDiv.innerHTML = `
            <p class="text-center" style="margin-bottom: -3px">${formatTime(entry.time)} Uhr</p>
            <img style="width: 125px;" src="https://openweather.site/img/wn/${entry.icon}.png">
            <h4 class="text-center">${entry.temperature.toFixed(0)} °C</h4>
        `;
        forecastContainer.appendChild(forecastDiv);
    });
}

document.getElementById("searchButton").addEventListener("click", async function() {
    const city = document.getElementById("citySearch").value;
    const currentUrl = `https://open-weather13.p.rapidapi.com/city/${city}/DE`;

    try {
        const currentWeather = await fetchWeatherData(currentUrl);
        const { lat, long } = displayCurrentWeather(currentWeather, city);

        // Fetching forecast
        const forecastUrl = `https://open-weather13.p.rapidapi.com/city/fivedaysforcast/${lat}/${long}`;
        const forecastData = await fetchWeatherData(forecastUrl);

        const forecastEntries = forecastData.list.slice(1, 10).map(entry => ({
            temperature: entry.main.temp - KELVIN_TO_CELSIUS,
            icon: entry.weather[0].icon,
            time: entry.dt_txt
        }));

        displayForecast(forecastEntries);
    } catch (error) {
        console.error(error);
    }
});

function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
