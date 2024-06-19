import React, { useState, useEffect, useCallback } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import { Character } from '../types/character';

const Search = (): JSX.Element => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<object>({});
  const [loading, setLoading] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();

  const fetchResults: (query: string) => Promise<void> = async (query: string): Promise<void> => {
    setLoading(true);

    try {
      const endpoints: Array<string> = ['people', 'films', 'starships', 'vehicles', 'species', 'planets'];
      const promises: Array<Promise<any>> = endpoints.map((endpoint) =>
        axios.get(`https://swapi.dev/api/${endpoint}?search=${query}`)
      );
      const responses: Array<any> = await Promise.all(promises);
      const data: Array<Character> = responses.reduce((acc, response, index) => {
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

  const debouncedFetchResults: any = useCallback(debounce(fetchResults, 200), []);

  useEffect(() => {
    if (query.length > 0) {
      debouncedFetchResults(query);
    } else {
      setResults({});
    }
  }, [query, debouncedFetchResults]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleViewAll = (category: string) => {
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
