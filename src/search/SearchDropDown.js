import React, { useState } from "react";
import log from "loglevel";
import { Dialog } from "primereact/dialog";

import { getPokemonByName } from "../pokemon/PokemonService";
import { SearchResultTemplate } from "./SearchResultTemplate";
import { Dropdown } from "primereact/dropdown";

import _ from "lodash";

export const SearchDropDown = function (props) {
  const [displayDialog, setDisplayDialog] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedMinimalPokemon, setSelectedMinimalPokemon] = useState(null);

  const openDialog = () => {
    setDisplayDialog(true);
  };

  const closeDialog = () => {
    setDisplayDialog(false);
  };

  const handleMinimalPokemonChange = function (minimalPokemon) {
    setSelectedMinimalPokemon(minimalPokemon);
    if (!_.isNil(minimalPokemon)) {
      getPokemonByName(minimalPokemon.pokemon.name)
        .then((data) => {
          setSearchResults(data);
        })
        .catch((error) => {
          log.debug(error);
        });
      openDialog();
    }
  };

  return (
    <div>
      <label htmlFor="selectedSearchId">{props.label}</label>
      <Dropdown
        className="ui-column-filter"
        showClear
        value={selectedMinimalPokemon}
        optionLabel="pokemon.name"
        options={props.minimalPokemons}
        onChange={(e) => handleMinimalPokemonChange(e.value)}
      />
      <Dialog
        header={`Search Results`}
        style={{ width: "50vw" }}
        visible={displayDialog}
        onHide={closeDialog}
      >
        <SearchResultTemplate
          results={searchResults}
          label={props.label}
          closeDialog={closeDialog}
          setSelectedPokemon={props.setSelectedPokemon}
        />
      </Dialog>
    </div>
  );
};
