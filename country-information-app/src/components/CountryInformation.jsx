// CountryInformation.js

import React, { useState } from 'react';
import './CountryInformation.css';
import CountryInfo from './CountryInfo';

function CountryInformation() {
    const [countryName, setCountryName] = useState('');
    const [countryData, setCountryData] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = () => {
        if (!countryName) {
            setError('The input field cannot be empty');
            setCountryData(null);
            return;
        }

        const finalURL = `https://api.restcountries.com/countries/v5?q=${countryName}`;
        fetch(
            finalURL,
            { headers: { 'Authorization': 'Bearer rc_live_5fdd492f4c9d4bd9b9a57c257cbe5951' } }
        )
            .then((response) => response.json())
            .then((data) => {
                if(data.message === "Not Found"){
                    setError("Country Information is not Found");
                    setCountryData(null);
                }else if (data.length === 0) {
                    setError('Please enter a valid country name.');
                    setCountryData(null);
                } else {
                    setError('');
                    setCountryData(data[0]);
                }
            })
            .catch(() => {
                setError('An error occurred while fetching data.');
                setCountryData(null);
            });
    };

    return (
        <div className="container">
            <div className="search">
                <input
                    type="text"
                    id="countryName"
                    placeholder="Enter a country name here..."
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                />
                <button id="search-btn" onClick={handleSearch}>
                    Search
                </button>
            </div>
            <div id="result">
                {error && <h3>{error}</h3>}
                {countryData && (<CountryInfo countryData={countryData} />)}
            </div>
        </div>
    );
}

export default CountryInformation;