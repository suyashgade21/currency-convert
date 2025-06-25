const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies/eur.json";

// Selecting elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Loop through dropdowns and populate options
for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default selection
    if (select.name === "from" && currCode === "EUR") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Add flag update on change
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to fetch exchange rate and update UI
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Always fetching eur.json, because EUR is base
  try {
    let response = await fetch(BASE_URL);
    let data = await response.json();

    let fromRate = data.eur[fromCurr.value.toLowerCase()];
    let toRate = data.eur[toCurr.value.toLowerCase()];

    let finalAmount = (toRate / fromRate) * amtVal;

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(3)} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Something went wrong. Please try again.";
  }
};

// Function to update flag based on country code
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode]; // Make sure you have countryList object defined
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Button click handler
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Auto call on load
window.addEventListener("load", () => {
  updateExchangeRate();
});
