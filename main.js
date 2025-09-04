const searchBtn = document.getElementById("search");
const input = document.getElementById("input");
searchList = document.querySelector(".search-list");
const weatherContainer = document.querySelector(".weather-container");
const weatherPlaceholder = document.querySelector(".weather-placeholder");
const valueContainer = document.querySelector(".value-container");
const weatherInfo = document.querySelector(".weather-info");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const condition = document.getElementById("condition");
const loader = document.querySelector(".loader");
const errorMessage = document.getElementById("errorMessage");
const offlineMessage = document.getElementById("offlineMessage");
const onlineMessage = document.getElementById("onlineMessage");
const suggestions = document.querySelector(".suggestions");
const loadingList = document.getElementById("loadingList");
const inputError = document.getElementById("inputError")



const API_KEY = "2229b5c46921169b64c731cd08552f6c";



async function getWeather(city) {
  input.style.border = "1px solid black";
  valueContainer.style.display = "none";
  errorMessage.style.display = "none";
   loader.style.display = "none";
    weatherPlaceholder.style.display = "none";
    loader.style.display = "flex";
   try {
     const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
     const response = await fetch(url);
     
     if (!response.ok) {
        const errData = await response.json();
         console.error("API Error:", errData);
         throw new Error(errData.message || "Location not found");
         
            }
       
     const data = await response.json();
     
     // Save as last viewed city
     localStorage.setItem("lastCity", city)
     
     
     loader.style.display = "none";
     const cityValue = data.name;
     const temperatureValue = data.main.temp;
     const humidityValue = data.main.humidity;
     const speedValue = data.wind.speed;
     const conditionValue = data.weather[0].description;
     
     valueContainer.style.display = "flex";
     
     
     cityName.textContent = cityValue; 
     temperature.textContent = temperatureValue + "°C";
     humidity.textContent = humidityValue + "%";
     windSpeed.textContent = speedValue + "m/s";
     condition.textContent = conditionValue;
     
   } catch (error) {
     loader.style.display = "none";
     errorMessage.style.color = "red" ;
     localStorage.setItem("lastCity", "error")
       if (!navigator.onLine) {
       errorMessage.style.display ="block";
       errorMessage.innerHTML = "You are  offline. Check your Internet";
     } else {
     errorMessage.style.display ="block";
     errorMessage.innerHTML = error.message === "city not found"? "⚠️ Location not found": error.message;
     }
   }
}

searchBtn.addEventListener("click", 
 function searchBtn(){
  inputError.style.display = "none";
  let city = input.value.trim();
    if (city !== "") {
      getWeather(city);
      toggleWeatherInfo();
    } else {
      return
    }
})

    input.addEventListener("input", checkInputValue);
    function checkInputValue() {
      if (input.value !== "") {
        disableSearch();
      }
      else {
        disableSearch();
      }
    }
    function disableSearch() {
      if (input.value === "") {
        searchBtn.style.opacity = "0.3" ;
      }
      else {
        searchBtn.style.opacity = "1" ;
      }
    }
    function showOnline() {
    errorMessage.style.color = "green" ;
    errorMessage.innerHTML = "You are now online" ;
    
    offlineMessage.style.bottom = "-40px";
    onlineMessage.style.bottom = "0px";
    setTimeout(() => {
    onlineMessage.style.bottom = "-40px";
     }, 3000);
    }

    function showOffline() {
      errorMessage.style.color = "red" ;
        errorMessage.innerHTML = "You are  offline. Check your Internet" ;
    offlineMessage.style.bottom = "0px";
     }
     function detectOffline() {
       if (!navigator.onLine) {
         offlineMessage.style.bottom = "0px";
         
       } else {
         offlineMessage.style.bottom = "-40px";
       }
     }
     
// load previous city
window.addEventListener("DOMContentLoaded", () => {
      const saved = localStorage.getItem("lastCity");
      if (saved !=="" && saved !== "error") {
        const city  = saved;
        getWeather(city);
      }
    });

// Listen for online/offline events
window.addEventListener("online", showOnline);
window.addEventListener("offline", showOffline);


//suggestion
input.addEventListener("input", async () => {
  inputError.style.display = "none";
  try {

  const query = input.value.trim();
  if (query.length < 2) {
    suggestions.style.display = "none";
    suggestions.innerHTML = "";
    weatherContainer.style.display = "flex";
    return;
  }
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
  suggestions.style.display = "none";
  loadingList.style.display = navigator.onLine === true ? "block" : "none";
  toggleWeatherInfo();
  
  // Fetch cities that match the query
  const res = await fetch(url);
  const cities = await res.json();
  
  if (cities.length === 0) {
      loadingList.style.display = "none";
      inputError.style.display = "block";
      inputError.innerHTML = `<p style = "color:black;">Click on <b>search</b> to found out if the location is available</p>`;
    }
    
  suggestions.innerHTML = "";
  cities.forEach(city => {
    const li = document.createElement("li");
    li.textContent = `${city.name}, ${city.country}`;
    li.onmousedown = () => {
    getWeather(city.name);
    input.value = city.name;
    toggleWeatherInfo();
    };
    
    
    loadingList.style.display = "none";
    suggestions.style.display = "block";
    toggleWeatherInfo();
    suggestions.appendChild(li);
  });
  } catch (error) {
    inputError.style.display = "block";
    if (!navigator.onLine) {
      inputError.innerHTML = "You are Offline. Suggestion is not available";
    }
    else {
      inputError.innerHTML = error.message;
    }
  }
});

//dismiss suggestion
input.addEventListener("blur", () => {
  setTimeout(() => {
    loadingList.style.display = "none";
    suggestions.style.display = "none";
    toggleWeatherInfo();
  }, 200);
});

function toggleWeatherInfo() {
  if (
    loadingList.style.display === "block" ||
    suggestions.style.display === "block"
  ) {
    weatherContainer.style.display = "none"; // hide weather info
  } else {
    weatherContainer.style.display = "flex"; // show weather info
  }
}

detectOffline();
checkInputValue();
