import React, { useState } from "react";
import Country from "./Country";

const CountryList = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  if (selectedCountry) {
    return <Country country={selectedCountry} />;
  }

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.cca3}>
          {country.name.common}
          <button onClick={() => setSelectedCountry(country)}>Show</button>
        </li>
      ))}
    </ul>
  );
};

export default CountryList;
