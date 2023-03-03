import React, { useEffect, useRef }from "react";  
import Form from "./components/formulario"; 
import "./App.css"; 
import ClimaInfo from "./components/climaInfo"; 
import useFetch from "./hooks/fetch";  
import useGeolocation from "./hooks/GetGeolocation"; 
import Louder from "./components/louder";  
import BackgroundImage from "./assets/images/lluvia.webp"; 
import wheatherApp from "./assets/images/weatherApp.webp"; 

let styleBackground = { 
  background: `url(${BackgroundImage})`,  
  backgroundSize: "100% 100%", 
  height: "100%"
}



export default function App () {    
    let initialStateDataWeater = {
      temperatura: 0, 
    } 
    const getDataWeatherToday = useFetch(initialStateDataWeater);
    const getDataWeatherTodayForm = useFetch(initialStateDataWeater); 
    const getDataWeatherNextDay = useFetch(initialStateDataWeater); 
    const getDataWeatherNextDayForm = useFetch(initialStateDataWeater); 

    const {getCoordinates, stateErrorGeolocation} = useGeolocation(); 
    const refLouder = useRef(); 

    const getDataLocation = async () =>{
      // esperamos la respuesta de la promesa para poder generar nuestra url y hacer la peticion 
      try{ 
        const getLocation = await getCoordinates(); 
        let Url_coordLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${getLocation.latitude}&lon=${getLocation.longitude}&lang=en&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`;
        await getDataWeatherToday.peticion(Url_coordLocation); 
        refLouder.current.classList.add("d-none");
        // se genera la url para obtener datos de los proximos 4 dias
        let URL_forecastNextDay= `https://api.openweathermap.org/data/2.5/forecast?lat=${getLocation.latitude}&lon=${getLocation.longitude}&lang=en&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`;  
        getDataWeatherNextDay.peticion(URL_forecastNextDay);   
      }catch (err){ 
        refLouder.current.classList.add("d-none"); 
      }
        
    }
    
    useEffect(() =>{
      getDataLocation(); 
    }
    ,[]);

    
    const handleSubmit = (e) => {
      e.preventDefault(); 
      const { cityName, countryName } = e.target;  
      // se genera url para obtener datos a traves del formulario.
      let Url_formToday = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value},${countryName.value}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`;
      getDataWeatherTodayForm.peticion(Url_formToday);   
      let URL_formNextDay = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName.value},${countryName.value}&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`;
      getDataWeatherNextDayForm.peticion(URL_formNextDay); 
      cityName.value = "" ; 
      countryName.value = "" ;  
    }; 

    return(<>     
    <div className="container-fluid p-0 backgroundStyle d-flex flex-column align-items-center h-100" style={styleBackground} > 
    <Louder refLouder={refLouder} classNameLouder={"louderStyles background-opacity position-absolute w-100 d-flex justify-content-center align-items-center position-fixed"}/> 
      <div className={`col-12 text-white`}> 
        <h1 className={`text-center text-white pt-4 min-width-250 ${stateErrorGeolocation ? "mb-2" : "mb-4" }`}>Weather Forecast</h1>  
         { stateErrorGeolocation && <Form handleSubmit={handleSubmit} classNameForm={"col-12 mb-3 min-width-250"} />}    
          <div className="text-white px-sm-2 px-0"> 
             {/* si no le damos permisos de ubicacion entonces nos enviara los datos del formulario y no de la peticion que se ejecuta en el useEfeect */}
             <ClimaInfo data={stateErrorGeolocation ? getDataWeatherTodayForm.data : getDataWeatherToday.data} isLoading={stateErrorGeolocation? getDataWeatherTodayForm.isLoading : getDataWeatherToday.isLoading} dataNextDay={stateErrorGeolocation? getDataWeatherNextDayForm.data : getDataWeatherNextDay.data} isLoadingNextDay={stateErrorGeolocation ? getDataWeatherNextDayForm.isLoading : getDataWeatherNextDay.isLoading} /> 
          </div>  
      </div>
    </div> 
 
    </>)
}
