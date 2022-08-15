import { createContext } from "react";

export const PokemonContext = createContext({
  pokemon: null,
  setPokemon: (value) => value,
});
