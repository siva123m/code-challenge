// src/slices/pokemonSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

// Define the shape of a Pokémon object
interface Pokemon {
  id: number;
  name: string;
  url: string; // url to fetch details about the Pokémon
}

// Define the shape of the state
interface PokemonState {
  pokemon: Pokemon[];
  loading: boolean;
  error: string | null;
}

// Initial state for the Pokémon list
const initialState: PokemonState = {
  pokemon: [],
  loading: false,
  error: null,
};

// Create an async thunk to fetch Pokémon data
export const fetchPokemons = createAsyncThunk<Pokemon[]>(
  'pokemon/fetchPokemons',
  async () => {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const data = await response.json();
    return data.results.map((pokemon: { name: string; url: string }, index: number) => ({
      id: index + 1,  // Assign a unique ID to each Pokémon
      name: pokemon.name,
      url: pokemon.url,
    }));
  }
);

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    // Action to add a Pokémon to the list
    addPokemon: (state, action: PayloadAction<Pokemon>) => {
      state.pokemon.push(action.payload);  // Mutates the state directly using Immer
    },
    // Action to remove a Pokémon from the list
    removePokemon: (state, action: PayloadAction<{ id: number }>) => {
      state.pokemon = state.pokemon.filter(pokemon => pokemon.id !== action.payload.id); // Removes by id
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.loading = true; // Set loading to true when the request is pending
        state.error = null;  // Reset error state
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when the request is fulfilled
        state.pokemon = action.payload;  // Store the fetched Pokémon data
      })
      .addCase(fetchPokemons.rejected, (state, action) => {
        state.loading = false; // Set loading to false when the request is rejected
        state.error = action.error.message || 'Failed to fetch Pokémon data';  // Store error message
      });
  },
});

// Export the actions to be used in components
export const { addPokemon, removePokemon } = pokemonSlice.actions;

// Export the reducer to be added to the store
export default pokemonSlice.reducer;
