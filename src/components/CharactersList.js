import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CharactersList.scss';

const CharactersList = () => {
  const [characters, setCharacters] = useState([]);
  const [view, setView] = useState('list');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(`https://swapi.dev/api/people/?page=${page}&size=20`);
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

  const handleDelete = (index) => {
    setCharacters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const character = characters[index];
    const newName = prompt(`Enter new name for ${character.name}:`, character.name);
    const newGender = prompt(`Enter new gender for ${character.name}:`, character.gender);
    const newBirthYear = prompt(`Enter new birth year for ${character.name}:`, character.birth_year);

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


/*
<table>
  <thead>
    <th>Name</th>
    <th>Gender</th>
    <th>Birth Year</th>
    <th>Edit</th>
    <th>Delete</th>
  </thead>
  <tbody>
    {
      characters.map((character, index) => (
        <tr>
          <td>{character.name}</td>
          <td>{character.gender}</td>
          <td>{character.birth_year}</td>
          <td><button onClick={() => handleEdit(index)}>Edit</button></td>
          <td><button onClick={() => handleDelete(index)}>Delete</button></td>
        </tr>
      ))
    }
  </tbody>
</table>
*/
