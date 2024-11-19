// App.tsx
import React, { useEffect, useState } from 'react';
import './List.css';
const api = "https://pokeapi.co/api/v2/pokemon?limit=151";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetail {
  name: string;
  sprites: { front_default: string };
}

const List: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // This will store the detailed information for each Pokemon, including images
  const [pokemonDetails, setPokemonDetails] = useState<Map<string, PokemonDetail>>(new Map());

  useEffect(() => {
    // Fetch the list of Pokémon names
    const fetchPokemons = async () => {
      try {
        const response = await fetch(api);
        const data = await response.json();
        setPokemons(data.results); // Assuming 'results' contains the list of Pokémon
        setLoading(false);

        // Now fetch details (like image) for each Pokémon
        data.results.forEach((pokemon: Pokemon) => {
          fetchPokemonDetail(pokemon.url);
        });
      } catch (err) {
        setError("Failed to fetch Pokémon data");
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Fetch detailed information (including image) for each Pokémon
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

  return (
    <div>
      <h1>Pokémon Cards</h1>
      <div className="pokemon-container">
        {pokemons.map((pokemon) => {
          const pokemonDetail = pokemonDetails.get(pokemon.name);

          // If the Pokémon detail is not loaded yet, don't render the card
          if (!pokemonDetail) {
            return <div key={pokemon.name} className="pokemon-card">Loading...</div>;
          }

          return (
            <div key={pokemon.name} className="pokemon-card">
              <img src={pokemonDetail.sprites.front_default} alt={pokemon.name} className="pokemon-image" />
              <h3>{pokemon.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
