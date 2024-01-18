import { useEffect, useState } from "react";
import cloudy from "./asset/cloudy.png"
import rainy from "./asset/rain.png"
import sun from "./asset/sun.png"
import './Weather.css'

import { click } from "@testing-library/user-event/dist/click";

const icon = {
    Clouds: cloudy,
    Rain: rainy,
    Clear: sun,
}
function getDayOfWeekFromString(dateString) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dateObject = new Date(dateString);
    
    if (isNaN(dateObject)) {
      return 'Invalid Date';
    }
    
    const dayIndex = dateObject.getDay();
    return daysOfWeek[dayIndex];
  }
function WeatherCard({temp, main, date, data}) {
    const [clicked, setClicked] = useState(false);
    function handle() {
        setClicked(clicked ^ true);
    }
    const hourly = data.map((item, index) =>
        <div key={index}>
          time: {item.dt_txt.split(' ')[1]} temp: {(item.main.temp - 273.15).toFixed(2)} weather: {item.weather[0].main}
        </div>
      );
    return (
        <div className="weather--card" onClick={handle}>
            <div>
                {date}
            </div>
            <div>
                {getDayOfWeekFromString(date)}
            </div>
            <img src={icon[main]}/>
            <div>
                {temp}&deg;C
            </div>
            <div className="weather--card__extra">
                {clicked ? hourly : <div></div>}
            </div>
            
        </div>
    )
}
function Weather() {
    const [weatherData, setWeatherData] = useState([]);
    const [filteredData, setFilteredDate] = useState([]);
    const temp = [0, 1, 2, 3, 4];
    useEffect(()=>{
        const fetchWeather = async()=>{
            try {
                const res = await fetch("https://api.openweathermap.org/data/2.5/forecast?lat=12.971599&lon=77.594566&appid=e39182f6789f4a68b2b890b761fad6d2");
                const data = await res.json();
                setWeatherData(data.list);
                if (data.list){
                    setFilteredDate(data.list.filter((item) => {
                        if ((item.dt - data.list[0].dt) % 86400 == 0) {
                            return true;
                        } 
                        return false;
                    }));
                }
     
            } catch(error) {
                console.log(error);
            }       
        } 
        fetchWeather();
    }, []);
    // const filteredData = weatherData.filter();
    // setWeatherData(filteredData);
    const listItems = filteredData.map((item, index) =>
        <WeatherCard temp={(item.main.temp - 273.15).toFixed(2)} 
        main={item.weather[0].main} date={item.dt_txt.split(' ')[0]} 
        data={weatherData.filter(d=>d.dt_txt.split(' ')[0]==item.dt_txt.split(' ')[0])} key={index}/>
      );
    // console.log(card);
    return (
        <div className="weather">
            {listItems}</div>
    );
}

export default Weather;