import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import CountryList from "./components/CountryList";
import getAll from "./services/countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getAll().then((initialCountries) => setCountries(initialCountries));
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Country Information</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <CountryList countries={countriesToShow} />
    </div>
  );
};

export default App;
