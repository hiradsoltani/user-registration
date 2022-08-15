import React, { useState } from "react";
import log from "loglevel";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";

import { getPokemonByName } from "../pokemon/PokemonService";
import { SearchResultTemplate } from "./SearchResultTemplate";
import { Button } from "primereact/button";

export const SearchBox = (props) => {
  const [searchText, setSearchText] = useState("");
  const [displayDialog, setDisplayDialog] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const openDialog = () => {
    setDisplayDialog(true);
  };

  const closeDialog = () => {
    setDisplayDialog(false);
  };

  // Handle user's input search.
  const handleSearch = (e) => {
    e.preventDefault();
    log.debug("Searched for the phrase " + searchText);
    // Reset the search text when 'Enter' is pressed
    setSearchText("");
    // Search the values from user input
    searchEnteredParameters();
    // Open the search Results dialog
    openDialog();
  };

  const searchEnteredParameters = () => {
    // When user wants to search by text, unselect dropdown values.
    props.setSelectedPokemonType(null);
    getPokemonByName(searchText)
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => {
        log.debug(error);
      });
  };

  return (
    <div>
      <label htmlFor="selectedSearchId">{props.label}</label>
      <div className="pi-inputgroup">
        <InputText
          // onKeyPress={handleKeyPress}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "10em" }}
        />
        <Button icon="pi pi-search" onClick={(e) => handleSearch(e)} />
      </div>
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
