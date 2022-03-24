// IIFE
(function(){

    const dataStore = {
        privateCity: '',
        privateCountry: '',
        API_KEY:'4849115e272cdeceb2c8b31f1db3a7d6',
        set city(cityName){
            this.privateCity = cityName;
        },
        set country(countryId){
            this.privateCountry = countryId;
        },
        async fetchData(){
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.privateCity},${this.privateCountry}&units=metric&appid=${this.API_KEY}`);
            return await res.json();
        }
    }

    const localStore = {
        privateCity: '',
        privateCountry: '',
        API_KEY:'sdadsadadsasd',
        set city(cityName){
            this.privateCity = cityName;
        },
        set country(countryId){
            this.privateCountry = countryId;
        },
        saveItem(){
            localStorage.setItem('BD-weather-city', this.privateCity);
            localStorage.setItem('BD-weather-country', this.privateCountry);
        }
    }

    const UI = {
        city: '',
        country: '',
        loadingAllNecessarySelectors(){
            const countryCode = document.querySelector('#countryCode');
            const cityNameInput = document.querySelector('#cityNameInput');
            const formElem = document.querySelector('#formElem');
            const cityNameDisplay = document.querySelector('#cityNameDisplay');
            const cityFeelDisplay = document.querySelector('#cityFeelDisplay');
            const cityTemperatureDisplay = document.querySelector('#cityTemperatureDisplay');
            const cityPressureDisplay = document.querySelector('#cityPressureDisplay');
            const cityHumidityDisplay = document.querySelector('#cityHumidityDisplay');
            const messageDisplay = document.querySelector('#messageDisplay');
            return {countryCode,cityNameInput,formElem,cityNameDisplay,cityFeelDisplay,cityTemperatureDisplay,cityPressureDisplay,cityHumidityDisplay, messageDisplay}
        },
        getInputValues(){
            const {countryCode,cityNameInput}=this.loadingAllNecessarySelectors();
            const ctryCode = countryCode.value;
            const ctName = cityNameInput.value;
            return {ctryCode, ctName}
        },
        validateInput(city, country){
            let error = false;
            if(city === '' || country === '') error = true;
            return error;
        },
        showMessageInUI(type,msg){
            const {messageDisplay} = this.loadingAllNecessarySelectors();
            let alertType = 'alert-success';
            if(type == 'error') alertType = 'alert-danger';
            let elem = `<div class="alert ${alertType} alert-dismissible fade show" role="alert"><strong>${msg}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>
            `;
            messageDisplay.insertAdjacentHTML('afterbegin',elem);
        },
        getIconSrc(iconCode){ return `https://openweathermap.org/img/w/${iconCode}.png`; },
        displayCurrentWeather(data){
            const {cityNameDisplay,cityFeelDisplay,cityTemperatureDisplay,cityPressureDisplay,cityHumidityDisplay} = this.loadingAllNecessarySelectors();
            const {main, weather, name} = data;
            cityNameDisplay.textContent =  name;
            cityFeelDisplay.textContent= weather[0].description;
            cityTemperatureDisplay.textContent = main.temp;
            cityPressureDisplay.textContent = main.pressure;
            cityHumidityDisplay.textContent = main.humidity;
            // temperatureIconDisplay.setAttribute('src',this.getIconSrc(weather[0].icon));
        },
        resetInput(){
            const {countryCode,cityNameInput} = this.loadingAllNecessarySelectors();
            countryCode.value = '';
            cityNameInput.value = '';
        },
        init(){
            const {formElem} = this.loadingAllNecessarySelectors();
            formElem.addEventListener('submit', async(e)=>{
                e.preventDefault();
                // Get the input values
                const {ctryCode, ctName} = this.getInputValues();

                this.resetInput();

                const error = this.validateInput(ctryCode, ctName);
                if(error) return this.showMessageInUI('error','Please Provide Valid Input');

                // Store data in UI
                this.city= ctName;
                this.country= ctryCode;

                // Store data in Temporary Memory
                dataStore.city = ctName;
                dataStore.country = ctryCode;

                //Show data in UI
                const data = await dataStore.fetchData();
                this.displayCurrentWeather(data);

                // Store data in Local Storage
                localStore.city = ctName;
                localStore.country = ctryCode;
                localStore.saveItem();

            })

            // document.addEventListener('DOMContentLoaded', e=>{
            //     e.preventDefault();
            //     // Load data from Local Storage
                

            // })

        }
    }
    UI.init();


})()