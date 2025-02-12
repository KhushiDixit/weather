let isCelsius = true;

function getWeather() {
    const apiKey = 'your_api_key_here';
    const pixabayKey = 'your_api_key_here';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            fetchBackgroundImage(data.weather[0].description, pixabayKey);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('City not found! Please enter a valid city.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
        });
}

function fetchBackgroundImage(weatherCondition, pixabayKey) {
    let query = 'nature';

    if (weatherCondition.includes('rain')) {
        query = 'rainy weather';
    } else if (weatherCondition.includes('cloud')) {
        query = 'cloudy sky';
    } else if (weatherCondition.includes('clear')) {
        query = 'sunny sky';
    } else if (weatherCondition.includes('snow')) {
        query = 'snowy landscape';
    }

    const pixabayUrl = `https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=5`;

    fetch(pixabayUrl)
        .then(response => response.json())
        .then(data => {
            if (data.hits.length > 0) {
                document.body.style.backgroundImage = `url('${data.hits[0].largeImageURL}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
            }
        })
        .catch(error => console.error('Error fetching background image:', error));
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const toggleTempBtn = document.getElementById('toggle-temp');

    weatherInfoDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        let temperature = data.main.temp;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        tempDivInfo.innerHTML = `<p id="temp-value">${temperature}°C</p>`;
        weatherInfoDiv.innerHTML = `
            <p>${cityName}</p>
            <p>${description}</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        `;

        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block';

        toggleTempBtn.style.display = 'block';
        toggleTempBtn.onclick = () => toggleTemperature(temperature);
    }
}

function toggleTemperature(tempCelsius) {
    const tempValueElement = document.getElementById('temp-value');

    if (isCelsius) {
        const tempFahrenheit = (tempCelsius * 9/5) + 32;
        tempValueElement.innerHTML = `${tempFahrenheit.toFixed(2)}°F`;
    } else {
        tempValueElement.innerHTML = `${tempCelsius}°C`;
    }

    isCelsius = !isCelsius;
}
