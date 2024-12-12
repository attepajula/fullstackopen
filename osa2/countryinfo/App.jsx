import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data);
        setFilteredCountries(response.data);
      })
      .catch(err => {
        setError('Virhe haettaessa maita');
      });
  }, []);

  useEffect(() => {
    if (search === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [search, countries]);

  const handleCountrySelect = (countryName) => {
    setSearch(countryName);
  };

  return (
    <div>
      <h1>Country info</h1>
      <input
        type="text"
        placeholder="Find a country"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p>{error}</p>}

      {filteredCountries.length > 10 ? (
        <p>Too many matches, please specify.</p>
      ) : filteredCountries.length > 1 ? (
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {filteredCountries.map((country) => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => handleCountrySelect(country.name.common)}>Show details</button>
            </li>
          ))}
        </ul>
      ) : filteredCountries.length === 1 ? (
        <div>
          <h1>{filteredCountries[0].name.common}</h1>
          <p>Official name: {filteredCountries[0].name.official}</p>
          <p>Capital: {filteredCountries[0].capital}</p>
          <p>Population: {filteredCountries[0].population}</p>
          <p>Area: {filteredCountries[0].area}</p>
          <p>Official Languages: 
            {filteredCountries[0].languages}</p>
          <img src={filteredCountries[0].flags.png} width="100" alt={`Flag of ${filteredCountries[0].name.common}`} />
        </div>
      ) : null}
    </div>
  );
}

export default App;
