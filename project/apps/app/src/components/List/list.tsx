// src/components/ListItem.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store/store'; // Import RootState and AppDispatch types
import { removePokemon } from '../redux/slice/removePockmon'; // Import removePokemon action
import './List.css';

const api = "https://pokeapi.co/api/v2/pokemon?limit=151";

interface Pokemon {
  id: number;
  name: string;
  url: string;
}

interface PokemonDetail {
  name: string;
  sprites: { front_default: string };
}

const ListItem: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [pokemonDetails, setPokemonDetails] = useState<Map<string, PokemonDetail>>(new Map());
  
  const pokemonFromStore = useSelector((state: RootState) => state.pokemon.pokemon);
  const dispatch: AppDispatch = useDispatch();  // Using dispatch function to dispatch actions

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch(api);
        const data = await response.json();
        setPokemons(data.results);  // Set list of Pokémon

        // Fetch details for each Pokémon
        data.results.forEach((pokemon: Pokemon) => {
          fetchPokemonDetail(pokemon.url);
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Pokémon data");
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []); 

  const fetchPokemonDetail = async (url: string) => {
    try {
      const response = await fetch(url);
      const data: PokemonDetail = await response.json();
      setPokemonDetails((prevDetails) => new Map(prevDetails).set(data.name, data));
    } catch (err) {
      console.error("Failed to fetch Pokémon details", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleRemovePokemon = (pokemonId: number) => {
    // Dispatch the action to remove the Pokémon
    dispatch(removePokemon({ id: pokemonId }));
  };

  return (
    <div>
      <h1>Pokémon Cards</h1>
      <div className="pokemon-container">
        {pokemons.map((pokemon) => {
          const pokemonDetail = pokemonDetails.get(pokemon.name);

          if (!pokemonDetail) {
            return <div key={pokemon.name} className="pokemon-card">Loading...</div>;
          }

          return (
            <div key={pokemon.name} className="pokemon-card">
              <img src={pokemonDetail.sprites.front_default} alt={pokemon.name} className="pokemon-image" />
              <h3>{pokemon.name}</h3>
              <button onClick={() => handleRemovePokemon(pokemon.id)}>Remove</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListItem;
