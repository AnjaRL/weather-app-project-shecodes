// Global variables
let celsiusTemperature = null;
let feelsLikeElement = null;
let windElement = null;
let forecasts = null;

//Date
let now = new Date();
console.log(now);

//Day
function formatDate() {
  let currentHour = now.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }

  let currentMinutes = now.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  let date = now.getDate();
  return `${day}, ${month} ${date}  &nbsp  ${currentHour}:${currentMinutes}`;
}

let h2 = document.querySelector("h2");
h2.innerHTML = formatDate(now);

function formatHours(timestamp) {
  let now = new Date(timestamp);
  let currentHour = now.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }

  let currentMinutes = now.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  return `${currentHour}:${currentMinutes}`;
}

//Weather variables
function showWeather(response) {
  console.log(response);
  document.querySelector("#city").innerHTML = response.data.name;

  celsiusTemperature = Math.round(response.data.main.temp);
  feelsLikeElement = Math.round(response.data.main.feels_like);
  windElement = Math.round(response.data.wind.speed * 3.6);

  document.querySelector("#temp").innerHTML = celsiusTemperature;

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  document.querySelector("#feelsLike").innerHTML = feelsLikeElement;

  let humidity = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${humidity}%`;

  document.querySelector("#wind").innerHTML = `${windElement} km/h`;

  let iconElement = document.querySelector("#current-temp-icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png
`
  );

  iconElement.setAttribute("alt", response.data.weather[0].description);

  document.querySelector("#sunrise").innerHTML = sunriseSunsetHours(
    response.data.sys.sunrise * 1000
  );
  document.querySelector("#sunset").innerHTML = sunriseSunsetHours(
    response.data.sys.sunset * 1000
  );

  // Background gradient
  let currentIcon = response.data.weather[0].icon;
  let container = document.querySelector(".container");
  if (currentIcon === "01d" || currentIcon === "01n") {
    container.style.backgroundImage =
      "linear-gradient(315deg, #63a4ff  10%, #83eaf1 80%)";
  }
  if (
    currentIcon === "02d" ||
    currentIcon === "03d" ||
    currentIcon === "04d" ||
    currentIcon === "02n" ||
    currentIcon === "03n" ||
    currentIcon === "04n"
  ) {
    container.style.backgroundImage =
      "linear-gradient(315deg, #bdd4e7 0%, #8693ab 74%)";
  }
  if (
    currentIcon === "09d" ||
    currentIcon === "10d" ||
    currentIcon === "09n" ||
    currentIcon === "10d"
  ) {
    container.style.backgroundImage =
      "linear-gradient(315deg, #d3d3d3 5%, #57606f 80%)";
  }
  if (currentIcon === "11d" || currentIcon === "11n") {
    container.style.backgroundImage =
      "linear-gradient(315deg, #d3d3d3 0%, #57606f 74%)";
  }

  if (currentIcon === "13d" || currentIcon === "13n") {
    container.style.backgroundImage =
      "linear-gradient(3315deg, #b8c6db 0%, #f5f7fa 74%)";
  }
  if (currentIcon === "50d" || currentIcon === "50n") {
    container.style.backgroundImage =
      "linear-gradient(315deg, #d3d3d3 0%, #57606f 74%)";
  }
}

// Sunset & Sunrise
function sunriseSunsetHours(timestamp) {
  let sunriseSunset = new Date(timestamp);
  let hours = sunriseSunset.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = sunriseSunset.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

// Forecast
function displayForecast(response) {
  console.log(response.data);
  let forecastElement = document.querySelector("#forecastHourly");
  forecastElement.innerHTML = null;
  forecast = null;
  forecasts = response.data.list;

  for (let index = 0; index < 5; index++) {
    let forecast = response.data.list[index];
    forecastElement.innerHTML += `
   <div class="col-sm">
     <span class="hour">${formatHours(forecast.dt * 1000)}</span>
     <br />
     <img src ="http://openweathermap.org/img/wn/${
       forecast.weather[0].icon
     }@2x.png"
    
     <br />
     <div class="weather-forecast-temperature"
     <span id="forecast-hour">${Math.round(forecast.main.temp)}</span>°
   </div> </div>`;
  }
}

//Data from API
function downloadData(inputCity) {
  let apiKey = "2ff2b093a98356d7999ea13bc286e33e";
  let city = inputCity;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios
    .get(`${apiUrl}&appid=${apiKey}`)
    .then(showWeather)
    .catch((error) => {
      alert("Wrong city. Enter another one !");
      console.log(error);
    });

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios
    .get(apiUrl)
    .then(displayForecast)
    .catch((error) => {
      console.log(error);
    });
}

//Search form
function searchCity(event) {
  console.log(event);
  event.preventDefault();
  let inputCity = document.querySelector("#search-city-input");
  console.log(inputCity.value);
  let h3 = document.querySelector("h3");
  if (inputCity.value) {
    h3.innerHTML = `${inputCity.value}`;
    downloadData(inputCity.value);
  } else {
    h3.innerHTML = null;
    alert("Please enter a city");
  }
}

let form = document.querySelector("#search-engine");
form.addEventListener("submit", searchCity);

//Current Position
function searchCurrentLocation(position) {
  let apiKey = "2ff2b093a98356d7999ea13bc286e33e";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showWeather);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}
let currentLocationButton = document.querySelector("#locationButton");
currentLocationButton.addEventListener("click", getCurrentLocation);

//Degrees
//•C
function displayCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  farenheitLink.classList.remove("active");
  let tempElement = document.querySelector("#temp");
  tempElement.innerHTML = celsiusTemperature;
  document.querySelector("#feelsLike").innerHTML = feelsLikeElement;
  document.querySelector("#wind").innerHTML = `${windElement} km/h`;
  windElement.innerHTML = `${wind}km/h`;

  let forecastHour = document.querySelectorAll("#forecast-hour");
  forecastHour.forEach(function (item, index) {
    console.log(forecasts[index]);
    item.innerHTML = `${Math.round(forecasts[index].main.temp)}°`;
  });
}

let celsius = document.querySelector("#celsiusLink");
celsius.addEventListener("click", displayCelsiusTemp);

//•F
function displayFarenheitTemp(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temp");
  celsiusLink.classList.remove("active");
  farenheitLink.classList.add("active");

  let farenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(farenheitTemp);

  document.querySelector("#feelsLike").innerHTML = Math.round(
    (feelsLikeElement * 9) / 5 + 32
  );
  document.querySelector("#wind").innerHTML = `${Math.round(
    windElement / 3.6
  )} mph`;

  let forecastHour = document.querySelectorAll("#forecast-hour");
  forecastHour.forEach(function (item, index) {
    console.log(forecasts[index]);
    item.innerHTML = `${Math.round(
      (forecasts[index].main.temp * 9) / 5 + 32
    )}°`;
  });
}

let farenheit = document.querySelector("#farenheitLink");
farenheit.addEventListener("click", displayFarenheitTemp);

downloadData("Trou aux Biches");
