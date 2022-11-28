// THEME MODE 
const themeMode = localStorage.getItem("theme-mode") || "light-mode";
if(themeMode == "dark-mode"){
    document.body.classList.add("dark-mode");
}

// DOM 
const elDarkModeBtn = document.querySelector(".js-dark-btn");
const elCountryList = document.querySelector(".js-countries-list");
const elCountryTemplate = document.querySelector(".js-country-template").content;

// FORMS 
const elSearchForm = document.querySelector(".js-search-form");
const elSearch = elSearchForm.querySelector(".js-search");

const elRegionForm = document.querySelector(".js-region-form");
const elRegionSelect = elRegionForm.querySelector(".js-region-select");

// MODAL 
const elModal = document.querySelector(".js-modal-body");
const elModalImg = elModal.querySelector(".js-modal-country-flag");
const elModalName = elModal.querySelector(".js-modal-country-name");
const elModalPopulation = elModal.querySelector(".js-modal-country-population");
const elModalRegion = elModal.querySelector(".js-modal-country-region");
const elModalCapital = elModal.querySelector(".js-modal-country-capital");
const elModalCurrencies = elModal.querySelector(".js-modal-country-currencies");
const elModalLanguage = elModal.querySelector(".js-modal-country-language");
const elModalSubregion = elModal.querySelector(".js-modal-country-subregion");
const elModalBorders = elModal.querySelector(".js-modal-border-country");
const elModalLink = elModal.querySelector(".js-country-link");


elDarkModeBtn.addEventListener("click", ()=> {
    document.body.classList.toggle("dark-mode");
    if(themeMode == "light-mode"){
        localStorage.setItem("theme-mode", "dark-mode");
    }
    else{
        localStorage.setItem("theme-mode", "light-mode");
    }
});


function renderCountries(arr, node){
    node.innerHTML = "";

    const elCountryFrag = new DocumentFragment();
    arr.forEach(item => {
        const countryTemplateClone = elCountryTemplate.cloneNode(true);

        countryTemplateClone.querySelector(".js-country-flag").src = item.flags?.svg;
        countryTemplateClone.querySelector(".js-country-flag").alt = item.name?.common + " Flag";

        countryTemplateClone.querySelector(".js-country-name").textContent = item.name?.common;

        countryTemplateClone.querySelector(".js-country-population").textContent = item.population;

        countryTemplateClone.querySelector(".js-country-region").textContent = item.region;

        countryTemplateClone.querySelector(".js-country-capital").textContent = item.capital;

        countryTemplateClone.querySelector(".js-more-info-btn").dataset.id = item.name?.common;

        elCountryFrag.appendChild(countryTemplateClone);
    });

    node.appendChild(elCountryFrag)
}

function renterModalInfo(arr){
    elModalImg.src = arr[0].flags?.svg;
    elModalImg.alt = arr[0].name?.common + " Flag";

    elModalName.textContent = arr[0].name?.common;

    elModalPopulation.textContent = arr[0].population;

    elModalRegion.textContent = arr[0].region;

    elModalCapital.textContent = arr[0].capital;

    const countryCurrencies = Object.keys(arr[0].currencies)[0];
    elModalCurrencies.textContent = arr[0].currencies?.[countryCurrencies]?.name;

    const countryLanguage = Object.values(arr[0].languages);
    elModalLanguage.textContent = countryLanguage.join(", ");

    elModalSubregion.textContent = arr[0].subregion;

    elModalBorders.textContent = arr[0].borders.join(", ");

    elModalLink.href = arr[0].maps?.googleMaps;
}

async function getInfo(search = "all", isModal = false){
    try {
        const res = await fetch(`https://restcountries.com/v3.1/${search}`)
        const data = await res.json();

        console.log(data);
        if(isModal){
            renterModalInfo(data)
            console.log(Object.values(data[0].languages));
        }
        else{
            renderCountries(data, elCountryList)
        }
    } catch (error) {
        console.log(error);
    }
}

function debounce(callback, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(callback, delay)
    }
}

function checkInput() {
    const value = elSearch.value;
    if (value) {
        getInfo(`name/${value}`)
    }
    else{
        getInfo()
    }
}


elSearchForm.addEventListener("input", debounce(checkInput, 1300))
elSearchForm.addEventListener("submit", evt => {
    evt.preventDefault()
})

elRegionForm.addEventListener("change", () => {
    if(elRegionSelect.value){
        getInfo(`region/${elRegionSelect.value}`)
    }
    else{
        getInfo()
    }
})

elCountryList.addEventListener("click", evt => {
    if(evt.target.matches(".js-more-info-btn")){
        getInfo(`name/${evt.target.dataset.id}`, true)
    }
})

getInfo()