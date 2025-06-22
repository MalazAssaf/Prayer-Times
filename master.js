document.addEventListener("DOMContentLoaded", () => {
  // Default city and date already set earlier
  fetchPrayerTimes(dropDownBtn.textContent, formattedDate);
});

let dropDownItems = document.querySelectorAll(".dropdown-item");
let dropDownBtn = document.querySelector(".dropdown-toggle");
let selectedCity = document.querySelector(".selected-city");

// Default city
dropDownBtn.textContent = "Riyadh";
selectedCity.textContent = "Riyadh";

// Update city on click of the toggle menu
dropDownItems.forEach((item) => {
  item.addEventListener("click", () => {
    dropDownBtn.textContent = item.textContent;
    selectedCity.textContent = dropDownBtn.textContent;
  });
});

// Set today's date as default
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const formattedDate = `${yyyy}-${mm}-${dd}`;

let dateInput = document.getElementById("myDate");
let selectedDate = document.querySelector(".selected-date");
dateInput.value = formattedDate;
selectedDate.textContent = formattedDate;
dateInput.addEventListener("change", () => {
  selectedDate.textContent = dateInput.value;
});

let submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", () => {
  const city = dropDownBtn.textContent;
  const date = dateInput.value;
  fetchPrayerTimes(city, date);
});

let spinner = document.getElementById("loadingSpinner");

function fetchPrayerTimes(city, date) {
  const param = {
    day: date.slice(-2),
    month: date.slice(5, 7),
    year: date.slice(0, 4),
  };

  const link = `https://api.aladhan.com/v1/calendarByAddress/${param.year}/${param.month}?address=${city}&method=4`;

  // Show spinner and disable button
  submitBtn.disabled = true;
  spinner.classList.remove("d-none");

  axios
    .get(link)
    .then((response) => {
      const praysTime = response.data.data[parseInt(param.day) - 1].timings;
      const { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha } = praysTime;
      const arrayOfPraysTime = [Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha];
      const liPrayTime = document.querySelectorAll(".pray-time p");

      arrayOfPraysTime.forEach((time, index) => {
        liPrayTime[index].textContent = time.slice(0, 6);
      });
    })
    .catch(() => {
      alert("Failed to fetch prayer times.");
    })
    .finally(() => {
      spinner.classList.add("d-none");
      submitBtn.disabled = false;
    });
}
