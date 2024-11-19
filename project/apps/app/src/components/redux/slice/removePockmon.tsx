// src/slice/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of a Pokémon object
interface Pokemon {
  id: number;
  name: string;
  url: string;
}

// Define the state shape
interface PokemonState {
  pokemon: Pokemon[];
}

const initialState: PokemonState = {
  pokemon: [],
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    // Action to add a Pokémon to the list
    addPokemon: (state, action: PayloadAction<Pokemon>) => {
      state.pokemon.push(action.payload);
    },
    // Action to remove a Pokémon from the list
    removePokemon: (state, action: PayloadAction<{ id: number }>) => {
      state.pokemon = state.pokemon.filter(pokemon => pokemon.id !== action.payload.id);
    },
  },
});

export const { addPokemon, removePokemon } = pokemonSlice.actions;

export default pokemonSlice.reducer;
