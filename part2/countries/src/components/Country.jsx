import React from "react";
import Weather from "./Weather";

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital: {country.capital[0]}</div>
      <div>Area: {country.area} km2</div>
      <div>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
      </div>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      <Weather capital={country.capital[0]} />
    </div>
  );
};

export default Country;
