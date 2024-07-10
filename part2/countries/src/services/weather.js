import axios from "axios";

const api_key = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const getWeather = (capital) => {
  const url = `${baseUrl}?q=${capital}&appid=${api_key}&units=metric`;
  return axios.get(url).then((response) => response.data);
};

export default getWeather;
