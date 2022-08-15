import axios from "axios";
import log from "loglevel";

/**
 * Retrieve pokemons by their name.
 * @param {*} searchText
 * @returns
 */
// Get pokemon by name
// https://pokeapi.co/api/v2/pokemon?limit=1154
export const getPokemonByName = function (searchText) {
  // Define the base url. The pokemon parameter (name, type, ...) that user searches for,
  // Should be concatenated with this url to get the results.
  const URL = "https://pokeapi.co/api/v2/pokemon/";

  return axios
    .get(URL + searchText.toLowerCase())
    .then((response) => {
      // The pokemon object includes some usefule fields, such as abilities, types, and more. Since these are in a list, they cannot be shown in a data table. Therefor, concatenate. The list resutls into a string and return that in the Pokemon object instead.
      concatenateListOfAbilities(response.data);
      concatenateListOfMoves(response.data);
      return response.data;
    })
    .catch((error) => {
      log.debug(`Error getting results: ${error}`);
    });
};

/**
 * Retrive pokemons by a type label.
 * @param {*} typeText
 * @returns
 */
export const getPokemonByType = function (typeText) {
  // Define the base URL.
  const URL = "https://pokeapi.co/api/v2/type/";

  return axios
    .get(URL + typeText)
    .then((response) => {
      return response.data.pokemon;
    })
    .catch((error) => {
      log.debug("Error getting pokemon by type: " + error);
    });
};

/**
 * Retrieve all the available pokemon types.
 * @returns
 */
export const getPokemonTypes = function () {
  const URL = "https://pokeapi.co/api/v2/type";

  return axios
    .get(URL)
    .then((response) => {
      return response.data.results;
    })
    .catch((error) => {
      log.debug(`Error getting results: ${error}`);
    });
};

/**
 * Concatenate all ability names into a single string to be displayed in the data table.
 * @param {*} pokemon
 */
const concatenateListOfAbilities = function (pokemon) {
  const listOfValues = pokemon.abilities;
  pokemon["abilities"] = listOfValues
    .map(function (data) {
      return data.ability.name;
    })
    .join(", ");
};

/**
 * Concatenate all moves' names into a single string to be displayed in the data table.
 * @param {*} pokemon
 */
const concatenateListOfMoves = function (pokemon) {
  const listOfValues = pokemon.moves;
  pokemon["moves"] = listOfValues
    .map(function (data) {
      return data.move.name;
    })
    .join(", ");
};
