const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': 'ab2fde757bmsh06cef36f29a8965p16ef21jsne5dc1c40ea23',
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
    }
};

// Function to handle the button click and fetch weather data
async function getWeatherData() {
    const city = document.getElementById("citySearch").value;
    const currentUrl = `https://open-weather13.p.rapidapi.com/city/${city}/DE`;

    try {
        const response = await fetch(currentUrl, options);
        const result = await response.json();

        // Handle status errors
        if (response.status === 429) {
            document.getElementById("error").textContent = 'Too many requests - STATUS: 429';
        } else if (response.status >= 500) {
            document.getElementById("error").textContent = `Server Error - STATUS: ${response.status}`;
        } else if (response.status >= 300 && response.status < 400) {
            document.getElementById("error").textContent = `Redirect Error - STATUS: ${response.status}`;
        } else {
            // Update the weather information
            const temperature = (result.main.temp - 32) * 5 / 9; // Convert from Fahrenheit to Celsius
            const condition = result.weather[0].description;
            const humidity = result.main.humidity;
            const wind = result.wind.speed;
            const currentIcon = result.weather[0].icon;
            const lat = result.coord.lat;
            const lon = result.coord.lon;

            document.getElementById("cityName").textContent = `${city}`;
            document.getElementById("temperature").textContent = `${temperature.toFixed(0)} °C`;
            document.getElementById("condition").textContent = `${condition}`;
            document.getElementById("windSpeed").textContent = `${wind} km/h`;
            document.getElementById("humidity").textContent = `${humidity} %`;

            // Clear input and display weather icon
            document.getElementById("citySearch").value = "";
            document.getElementById("currentIcon").setAttribute("src", `https://openweather.site/img/wn/${currentIcon}.png`);
            document.getElementById("weatherInfo").style.display = "block";

            // Fetch forecast data
            const forecastUrl = `https://open-weather13.p.rapidapi.com/city/fivedaysforcast/${lat}/${lon}`;
            const forecastResponse = await fetch(forecastUrl, options);
            const forecastResult = await forecastResponse.json();

            // Handle forecast status errors
            if (forecastResponse.status === 429) {
                document.getElementById("forecastError").textContent = 'Too many requests - STATUS: 429';
            } else if (forecastResponse.status >= 500) {
                document.getElementById("forecastError").textContent = `Server Error - STATUS: ${forecastResponse.status}`;
            } else if (forecastResponse.status >= 300 && forecastResponse.status < 400) {
                document.getElementById("forecastError").textContent = `Redirect Error - STATUS: ${forecastResponse.status}`;
            } else {
                // Display forecast data
                const forecastEntries = forecastResult.list.slice(1, 10).map(entry => ({
                    temperature: entry.main.temp - 273.15, // Convert from Kelvin to Celsius
                    icon: entry.weather[0].icon,
                    time: entry.dt_txt
                }));

                // Clear previous forecast data
                document.getElementById("forecastContainer").innerHTML = '';

                forecastEntries.forEach(entry => {
                    const forecastDiv = document.createElement('div');
                    forecastDiv.className = 'text-center glass shadow me-2';
                    forecastDiv.innerHTML = `
                        <p class="text-center" style="margin-bottom: -3px">${formatTime(entry.time)} Uhr</p>
                        <img style="width: 125px;" src="https://openweather.site/img/wn/${entry.icon}.png">
                        <h4 class="text-center">${entry.temperature.toFixed(0)} °C</h4>
                    `;
                    document.getElementById("forecastContainer").appendChild(forecastDiv);
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// Function to format the time string
function formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Add event listener to search button
document.getElementById("searchButton").addEventListener("click", getWeatherData);
