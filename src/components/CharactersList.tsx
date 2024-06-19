import React, { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import '../styles/CharactersList.scss';
import { Character } from '../types/character';

const CharactersList = (): JSX.Element => {
  const [characters, setCharacters] = useState<Array<Character>>([]);
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchCharacters: () => Promise<void> = async () => {
      try {
        const response: AxiosResponse<any,any> = await axios.get(`https://swapi.dev/api/people/?page=${page}&size=20`);
        setCharacters((prev) => [...prev, ...response.data.results]);
      } catch (error) {
        console.error('Error fetching characters:', error);
      }
    };

    fetchCharacters();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleDelete = (index: number) => {
    setCharacters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    const character: Character = characters[index];
    const newName: string = prompt(`Enter new name for ${character.name}:`, character.name);
    const newGender: string = prompt(`Enter new gender for ${character.name}:`, character.gender);
    const newBirthYear: string = prompt(`Enter new birth year for ${character.birth_year}:`, character.birth_year);

    setCharacters((prev) =>
      prev.map((char, i) =>
        i === index ? { ...char, name: newName, gender: newGender, birth_year: newBirthYear } : char
      )
    );
  };

  return (
    <div className='characters-container'>
      <button
        onClick={() => setView(view === 'list' ? 'grid' : 'list')}
        className='characters-container__display-toggle-button'
      >
        Switch to {view === 'list' ? 'Grid' : 'List'} View
      </button>
      <div className={`characters-container__${view}`}>
        {characters.map((character, index) => (
          <div key={index} className="character-card">
            <h4>{character.name}</h4>
            <p>Gender: {character.gender}</p>
            <p>Birth Year: {character.birth_year}</p>
            <div className='characters-container__action-buttons-container'>
              <button
                onClick={() => handleEdit(index)}
                className='characters-container__action-button'
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className='characters-container__action-button'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleLoadMore}
        className='characters-container__load-more-button'
      >
        Load More
      </button>
    </div>
  );
};

export default CharactersList;
