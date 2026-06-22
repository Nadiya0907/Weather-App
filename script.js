
//ANOTHER CODE OF JAVASCRIPT
const searchBtn = document.getElementById("searchBtn");
const themeBtn = document.getElementById("themeBtn");
const locationBtn = document.getElementById("locationBtn");
const voiceBtn = document.getElementById("voiceBtn");

const apiKey = "3341dd257c15aabdebc81e355f4ad514";

let searchHistory = [];

// ======================
// SEARCH WEATHER
// ======================

searchBtn.addEventListener("click", async function () {

    try {

        const cityName =
            document.getElementById("cityInput").value.trim();

        if (cityName === "") {
            alert("Please enter a city name");
            return;
        }

        document.getElementById("weatherInfo").innerHTML =
            "<h2>⏳ Loading...</h2>";

        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();
        const forecastUrl =
`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

const forecastResponse = await fetch(forecastUrl);
const forecastData = await forecastResponse.json();

        if (data.cod === "404") {

            document.getElementById("weatherInfo").innerHTML =
                "<h2>❌ City Not Found</h2>";

            return;
        }

        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const condition = data.weather[0].main;

        const iconCode = data.weather[0].icon;

        const iconUrl =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        document.getElementById("weatherInfo").innerHTML = `
            <h2>${data.name}</h2>

            <img src="${iconUrl}" alt="Weather Icon">

            <p>🌡 Temperature: ${temperature} °C</p>

            <p>🤗 Feels Like: ${feelsLike} °C</p>

            <p>💧 Humidity: ${humidity}%</p>

            <p>💨 Wind Speed: ${windSpeed} m/s</p>

            <p>☁️ Condition: ${condition}</p>
        `;
        let forecastHTML = "";

for (let i = 0; i < forecastData.list.length; i += 8) {

    let item = forecastData.list[i];

    let date = new Date(item.dt_txt).toDateString();

    let temp = item.main.temp;

    let icon = item.weather[0].icon;

    let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    forecastHTML += `
        <div class="forecast-card">
            <p>${date}</p>
            <img src="${iconUrl}">
            <p>${temp} °C</p>
        </div>
    `;
}
document.getElementById("forecast").innerHTML = forecastHTML;
        updateHistory(data.name);

        document.getElementById("cityInput").value = "";

    } catch (error) {

        document.getElementById("weatherInfo").innerHTML =
            "<h2>⚠️ Something went wrong</h2>";

        console.log(error);
    }

});
locationBtn.addEventListener("click", function () {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(async function (position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {

                document.getElementById("weatherInfo").innerHTML =
                    "<h2>📍 Detecting location...</h2>";

                const url =
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

                const response = await fetch(url);
                const data = await response.json();

                const temperature = data.main.temp;
                const feelsLike = data.main.feels_like;
                const humidity = data.main.humidity;
                const windSpeed = data.wind.speed;
                const condition = data.weather[0].main;
                setWeatherAnimation(condition);
                setBackground(condition);
setRainEffect(condition);
setCloudEffect(condition);
                const iconCode = data.weather[0].icon;
                const iconUrl =
                    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                document.getElementById("weatherInfo").innerHTML = `
                    <h2>${data.name}</h2>

                    <img src="${iconUrl}">

                    <p>🌡 Temperature: ${temperature} °C</p>
                    <p>🤗 Feels Like: ${feelsLike} °C</p>
                    <p>💧 Humidity: ${humidity}%</p>
                    <p>💨 Wind Speed: ${windSpeed} m/s</p>
                    <p>☁ Condition: ${condition}</p>
                `;

            } catch (error) {
                document.getElementById("weatherInfo").innerHTML =
                    "<h2>⚠ Error getting location weather</h2>";
            }

        });

    } else {
        alert("Geolocation not supported");
    }

});

// ======================
// ENTER KEY SUPPORT
// ======================

document
    .getElementById("cityInput")
    .addEventListener("keypress", function (event) {

        if (event.key === "Enter") {
            searchBtn.click();
        }

    });

// ======================
// SEARCH HISTORY
// ======================

function updateHistory(city) {

    if (!searchHistory.includes(city)) {

        searchHistory.unshift(city);

        if (searchHistory.length > 5) {
            searchHistory.pop();
        }

        localStorage.setItem(
            "history",
            JSON.stringify(searchHistory)
        );

        displayHistory();
    }
}

function displayHistory() {

    const historyList =
        document.getElementById("historyList");

    historyList.innerHTML = "";

    searchHistory.forEach(city => {

        const li =
            document.createElement("li");

        li.textContent = city;

        historyList.appendChild(li);

    });
}

// ======================
// DARK MODE
// ======================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        themeBtn.innerText = "☀️ Light Mode";

        localStorage.setItem("theme", "dark");

    } else {

        themeBtn.innerText = "🌙 Dark Mode";

        localStorage.setItem("theme", "light");
    }

});

// ======================
// LOAD SAVED DATA
// ======================

window.onload = function () {

    const savedHistory =
        localStorage.getItem("history");

    if (savedHistory) {

        searchHistory =
            JSON.parse(savedHistory);

        displayHistory();
    }

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

        themeBtn.innerText = "☀️ Light Mode";
    }

};
voiceBtn.addEventListener("click", function () {

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Your browser does not support voice search");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.start();

    document.getElementById("weatherInfo").innerHTML =
        "<h2>🎤 Listening...</h2>";

    recognition.onresult = function (event) {

        const voiceText = event.results[0][0].transcript;

        document.getElementById("cityInput").value = voiceText;

        searchBtn.click(); // auto search after voice input
    };

    recognition.onerror = function () {

        document.getElementById("weatherInfo").innerHTML =
            "<h2>⚠ Voice recognition failed</h2>";
    };

});
function setWeatherAnimation(condition) {

    const container = document.getElementById("weatherAnimation");

    container.innerHTML = "";

    let animation = "";

    if (condition === "Rain") {

        animation = "🌧️";

    } else if (condition === "Clouds") {

        animation = "☁️";

    } else if (condition === "Clear") {

        animation = "☀️";

    } else if (condition === "Thunderstorm") {

        animation = "⛈️";

    } else if (condition === "Snow") {

        animation = "❄️";

    } else {

        animation = "🌤️";
    }

    container.innerHTML = `
        <div class="weather-icon">${animation}</div>
    `;
}
function setBackground(condition){

    const bg = document.getElementById("background");

    if(condition === "Rain"){
        bg.style.background = "linear-gradient(135deg, #3a7bd5, #3a6073)";
    }
    else if(condition === "Clouds"){
        bg.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
    }
    else if(condition === "Clear"){
        bg.style.background = "linear-gradient(135deg, #fceabb, #f8b500)";
    }
    else if(condition === "Snow"){
        bg.style.background = "linear-gradient(135deg, #e6dada, #274046)";
    }
    else{
        bg.style.background = "linear-gradient(135deg, #74ebd5, #ACB6E5)";
    }
}
function setRainEffect(condition){

    const rain = document.getElementById("rain");
    rain.innerHTML = "";

    if(condition === "Rain" || condition === "Thunderstorm"){

        for(let i = 0; i < 50; i++){

            let drop = document.createElement("div");

            drop.classList.add("rain-drop");

            drop.style.left = Math.random() * 100 + "vw";
            drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + "s";

            rain.appendChild(drop);
        }

    }
}
function setCloudEffect(condition){

    const clouds = document.getElementById("clouds");
    clouds.innerHTML = "";

    if(condition === "Clouds"){

        for(let i = 0; i < 8; i++){

            let cloud = document.createElement("div");

            cloud.classList.add("cloud");

            cloud.innerHTML = "☁️";

            cloud.style.top = Math.random() * 80 + "vh";
            cloud.style.left = Math.random() * 100 + "vw";
            cloud.style.animationDuration = (10 + Math.random() * 10) + "s";

            clouds.appendChild(cloud);
        }

    }
}