// src/store.ts

import { configureStore } from '@reduxjs/toolkit';
import slice from '../slice/slice'; // Make sure the import path and file name are correct

// Create the Redux store and add the pokemonReducer to it
const store = configureStore({
  reducer: {
    pokemon: slice, // Use the pokemon slice reducer
  },
});

// Export the store
export default store;

// Define RootState type based on the store's state
export type RootState = ReturnType<typeof store.getState>;

// Define AppDispatch type based on the store's dispatch function
export type AppDispatch = typeof store.dispatch;
