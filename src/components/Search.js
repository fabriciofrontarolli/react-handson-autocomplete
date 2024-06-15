import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchResults = async (query) => {
    setLoading(true);
    try {
      const endpoints = ['people', 'films', 'starships', 'vehicles', 'species', 'planets'];
      const promises = endpoints.map((endpoint) =>
        axios.get(`https://swapi.dev/api/${endpoint}?search=${query}`)
      );
      const responses = await Promise.all(promises);
      const data = responses.reduce((acc, response, index) => {
        acc[endpoints[index]] = response.data.results.slice(0, 3); // Top 3 results per category
        return acc;
      }, {});
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchResults = useCallback(debounce(fetchResults, 200), []);

  useEffect(() => {
    if (query.length > 0) {
      debouncedFetchResults(query);
    } else {
      setResults({});
    }
  }, [query, debouncedFetchResults]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleViewAll = (category) => {
    if (category === 'people') {
      navigate('/characters');
    } else {
      alert(`View All for ${category} not implemented.`);
    }
  };

  return (
    <div className='search-container'>
      <div className='search-container__content'>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search Star Wars"
        />
        {loading && <p>Loading...</p>}
        {!loading && query && (
          <div className="search-container__content__autocomplete-results">
            {Object.keys(results).map((category) => (
              <div key={category} className="search-container__content__autocomplete-results__section">
                <h4 className='search-container__content__autocomplete-results__section-item'>
                  {category}
                </h4>

                <ul>
                  {
                    results[category].map((item, index) => (
                      <li key={`item-${category}-${index}`}>
                        { item.name || item.title }
                      </li>
                    ))
                  }
                </ul>

                <a onClick={() => handleViewAll(category)}>
                  View All
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
