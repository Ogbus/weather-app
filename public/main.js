let button = document.querySelector("button");
let inputBox = document.querySelector("input");
let city = document.querySelector("div.location p > span:first-child");
let date = document.querySelector("div.location p > span:last-child");
let temp = document.querySelector("div.degree > p");
let weather = document.querySelector("div.degree div.level > p");
let weatherImg = document.querySelector("div.degree div.level > img");
let hourlyContainer = document.querySelector("div.hourly");
let dailyContainer = document.querySelector("div.daily");
let mainDiv = document.querySelector("div.inner-wrapper main");
let wrapper = document.querySelector("div.wrapper");

let reset = function reset() {
    city.innerHTML = "";
    date.innerHTML = "";
    temp.innerHTML = "";
    weather.innerHTML = "";
    weatherImg.src = "";
    dailyContainer.innerHTML = "";
    hourlyContainer.innerHTML = "";
};

let setHourlyDivs = function setHourlyDivs(data) {
    let imgSrc;
    let hourly = data.list.map(function (item, index) {
        if (index === 0 || index > 5) return;
        let temp = Math.round(item.main.temp * 1) / 1;
        let baseHour = new Date(item.dt * 1000).getHours();
        let finalHour;

        if (baseHour === 0) {
        finalHour = "12AM";
        } else if (baseHour <= 11) {
        finalHour = baseHour + "AM";
        } else if (baseHour === 12) {
        finalHour = "12PM";
        } else if (baseHour > 12) {
        finalHour = (baseHour % 12) + "PM";
        }

        switch (item.weather[0].main.toLowerCase()) {
        case "clouds":
            imgSrc = "./images/solid-cloudy-weather.svg";
            break;

        case "rain":
            imgSrc = "./images/solid-nt_rainy-weather.svg";
            break;

        case "clear":
            imgSrc = "./images/clear-weather.svg";
            break;
        }

        return '<div>\n    <img src="'
            .concat(imgSrc, '" alt="" />\n    <p>\n      <span>')
            .concat(temp, "&deg;C</span>\n      <span>")
            .concat(finalHour, "</span>\n    </p>\n  </div>");
    });
    hourly = hourly.join("");
    hourlyContainer.innerHTML = hourly;
};

var setDailyDivs = function setDailyDivs(data) {
  let currentDay = new Date(Date.now()).getDay();
  let sameDay;
  let imgSrc;
  let daily = data.list.map(function (item, index) {
    let itemDay = new Date(item.dt * 1000).getDay();
    if (currentDay === itemDay) return;
    if (sameDay !== undefined && sameDay === itemDay) return;
    sameDay = itemDay;
    let minTemp = Math.round(item.main.temp_min * 10) / 10;
    let maxTemp = Math.round(item.main.temp_max * 10) / 10;
    let finalDate;

    switch (itemDay) {
      case 0:
        finalDate = "Sunday";
        break;

      case 1:
        finalDate = "Monday";
        break;

      case 2:
        finalDate = "Tuesday";
        break;

      case 3:
        finalDate = "Wednesday";
        break;

      case 4:
        finalDate = "Thursday";
        break;

      case 5:
        finalDate = "Friday";
        break;

      case 6:
        finalDate = "Saturday";
        break;

      default:
        finalDate = "Day";
    }

    if (itemDay === currentDay + 1) {
      finalDate = "Tomorrow";
    }

    switch (item.weather[0].main.toLowerCase()) {
      case "clouds":
        imgSrc = "./images/solid-cloudy-weather.svg";
        break;

      case "rain":
        imgSrc = "./images/solid-nt_rainy-weather.svg";
        break;

      case "clear":
        imgSrc = "./images/clear-weather.svg";
        break;
    }

    return "<div>\n    <p>"
      .concat(finalDate, "</p>\n    <p>")
      .concat(minTemp, "&deg;C / ")
      .concat(maxTemp, '&deg;C</p>\n    <img src="')
      .concat(imgSrc, '" alt="" />\n  </div>');
  });
  daily = daily.join("");
  dailyContainer.innerHTML = daily;
};

let setMain = function setMain(data) {
  city.innerHTML = data.city.name;
  date.innerHTML = new Date(data.list[0].dt * 1000).toDateString();
  temp.innerHTML = Math.round(data.list[0].main.temp * 10) / 10 + "&deg;C";
  759;
  weather.innerHTML = data.list[0].weather[0].main;

  switch (data.list[0].weather[0].main.toLowerCase()) {
    case "clouds":
      weatherImg.src = "./images/solid-cloudy-weather.svg";
      break;

    case "rain":
      weatherImg.src = "./images/solid-nt_rainy-weather.svg";
      break;

    case "clear":
      weatherImg.src = "./images/clear-weather.svg";
      break;
  }
};

let setPage = function setPage(data) {
  //console.log(data);
  if (data.cod === "404") {
    reset();
    city.innerHTML = "The city you entered is not available";
    return;
  }
  localStorage.setItem("lastQuery", JSON.stringify(data));
  setMain(data);
  setHourlyDivs(data);
  setDailyDivs(data);
  wrapper.style.display = "block";
  if (window.matchMedia("(min-width: 1000px)").matches)
    mainDiv.style.width = "45%";
};

button.addEventListener("click", function (e) {
  e.preventDefault();
  let location = inputBox.value.toLowerCase();
  let API_KEY = "83507e23a50d7f715ea65eb339daa36d";
  let query = "https://api.openweathermap.org/data/2.5/forecast?q="
    .concat(location, "&units=metric&appid=")
    .concat(API_KEY);
  fetch(query)
    .then(function (response) {
      return response.json();
    })
    .then(setPage)
    .catch(function (error) {
      return console.log(error.message);
    });
});

let lastSearch = JSON.parse(localStorage.getItem('lastQuery'));
console.log(lastSearch);

if(lastSearch.cod === "200") {
    setPage(lastSearch);
}