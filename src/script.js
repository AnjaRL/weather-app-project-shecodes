//Date
let now = new Date();
console.log(now);

//hour
let currentHour = now.getHours();
if (currentHour < 10) {
  currentHour = `0${currentHour}`;
}
console.log(currentHour);

let currentMinutes = now.getMinutes();
if (currentMinutes < 10) {
  currentMinutes = `0${currentMinutes}`;
}
console.log(currentMinutes);

//Day
function formatDate(timestamp) {
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
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  document.querySelector("#sunrise").innerHTML = sunriseSunsetHours(
    response.data.sys.sunrise * 1000
  );
  document.querySelector("#sunset").innerHTML = sunriseSunsetHours(
    response.data.sys.sunset * 1000
  );
}

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
//Real Weather
function downloadData(inputCity) {
  let apiKey = "2ff2b093a98356d7999ea13bc286e33e";
  let city = inputCity;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);

  axios.get(`${apiUrl}&appid=${apiKey}`).then(showWeather);
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
}

let celsius = document.querySelector("#celsiusLink");
celsius.addEventListener("click", displayCelsiusTemp);

let celsiusTemperature = null;
let feelsLikeElement = null;
let windElement = null;

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
}

let farenheit = document.querySelector("#farenheitLink");
farenheit.addEventListener("click", displayFarenheitTemp);

downloadData("Trou aux Biches");
