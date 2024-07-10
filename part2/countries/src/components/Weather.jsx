import React, { useEffect, useState } from "react";
import getWeather from "../services/weather";

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    getWeather(capital).then((data) => setWeather(data));
  }, [capital]);

  if (!weather) return null;

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div>Temperature: {weather.main.temp} C</div>
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Weather icon"
      />
      <div>Wind: {weather.wind.speed} m/s</div>
    </div>
  );
};

export default Weather;
