const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '5d2cd2f2e9msha6ac34ec7337ac7p134ba0jsnc850e676e646',
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
    }
};

document.getElementById("searchButton").addEventListener("click", async function() {
    var city = document.getElementById("citySearch").value;
    const current = `https://open-weather13.p.rapidapi.com/city/${city}/DE`;

    try {
        const response = await fetch(current, options);
        const result = await response.json();

        //casting some status errors
        if (response.status === 429) {
            document.getElementById("error").textContent = 'Zu viele Zugriffe - STATUS: 429';
        } else if (response.status >= 500) {
            document.getElementById("error").textContent = `Server Error - STATUS: ${response.status}`;
        } else if (response.status >= 300 && response.status < 400) {
            document.getElementById("error").textContent = `Redirect Error - STATUS: ${response.status}`;
        }

        //continuing with fetching results
        const temperature = (result.main.temp - 32) * 5 / 9;
        const condi = result.weather[0].description;
        const humidity = result.main.humidity;
        const wind = result.wind.speed;
        const lat = result.coord.lat;
        const long = result.coord.lon;

        //pasting results to html
        document.getElementById("cityName").textContent = `${city}`;
        document.getElementById("temperature").textContent = `${temperature.toFixed(0)} °C`;
        document.getElementById("condition").textContent = `${condi}`;
        document.getElementById("windSpeed").textContent = `${wind} km/h`;
        document.getElementById("humidity").textContent = `${humidity} %`;

        //clear input and show data when loaded for good looking
        document.getElementById("citySearch").value = "";
        document.getElementById("weatherInfo").style.display = "block";

        //calling second endpoint -> forecast for 24h
        const forecastUrl = `https://open-weather13.p.rapidapi.com/city/fivedaysforcast/${lat}/${long}`;
        const forecastResponse = await fetch(forecastUrl, options);
        const forecastResult = await forecastResponse.json();

        //casting again some status erros
        if (forecastResponse.status === 429) {
            document.getElementById("forecastError").textContent = 'Zu viele Zugriffe - STATUS: 429';
        } else if (forecastResponse.status >= 500) {
            document.getElementById("forecastError").textContent = `Server Error - STATUS: ${forecastResponse.status}`;
        } else if (forecastResponse.status >= 300 && response.status < 400) {
            document.getElementById("forecastError").textContent = `Redirect Error - STATUS: ${forecastResponse.status}`;
        }

        //proceeding as above

    } catch (error) {
        console.log(error);
    }
});

function formatTime(dateString) {
    const [date, time] = dateString.split(' ');
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
}