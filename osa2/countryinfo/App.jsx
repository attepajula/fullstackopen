import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data);
        setError(null);
      })
      .catch(err => {
        setError('Virhe haettaessa maita');
      });
  }, []);


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };


  const handleCountrySelect = (countryName) => {
    setSearch(countryName);
    setSelectedCountry(null);

  
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
      .then(response => {
        setSelectedCountry(response.data[0]);a
        setError(null);
      })
      .catch(err => {
        setError('error happened');
      });
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Country info</h1>
      <input
        type="text"
        placeholder="Find a country"
        value={search}
        onChange={handleSearchChange}
      />

      {error && <p>{error}</p>}

      {filteredCountries.length > 10 ? (
        <p>Too many matches, please specify</p>
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
          <p>Official Languages: {Object.values(filteredCountries[0].languages).join(', ')}</p>
          <img src={filteredCountries[0].flags.png} width="100"/>
        </div>
      ) : null}

      {selectedCountry && (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Official name: {selectedCountry.name.official}</p>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Population: {selectedCountry.population}</p>
          <p>Area: {selectedCountry.area}</p>
          <p>Official Languages: {Object.values(selectedCountry.languages).join(', ')}</p>
          <img src={selectedCountry.flags.png} width="100" alt={`Flag of ${selectedCountry.name.common}`} />
        </div>
      )}
    </div>
  );
}

export default App;
