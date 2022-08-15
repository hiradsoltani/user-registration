import React, { useContext, useEffect, useState } from "react";
import log from "loglevel";

import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";

import _ from "lodash";

export const SearchResultTemplate = (props) => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Check whether the result received is empty or null.
    if (_.isNil(props.results)) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [props.results]);

  // On successful search result, display the results in a Listbox.
  const successfulResponse = (results) => {
    // Disable Select button if no entry is selected.
    let disableSelect = false;
    if (!selectedResult) {
      disableSelect = true;
    }

    return (
      results && (
        <div className="p-grid p-fluid p-formgrid">
          <div className="p-col-12 p-field">
            <label>Please select an entry from the list</label>
            <DataTable
              value={[results]}
              selectionMode="single"
              selection={selectedResult}
              onSelectionChange={(e) => setSelectedResult(e.value)}
              autoLayout
            >
              <Column selectionMode="single" />
              <Column field="name" header="Name" />
              <Column field="abilities" header="Abilities" />
              <Column field="moves" header="Moves" />
            </DataTable>
          </div>
          <div className="p-col-2 p-offset-2 p-field">
            <Button
              label="Select"
              disabled={disableSelect}
              onClick={selectEntry}
            />
          </div>
        </div>
      )
    );
  };

  const selectEntry = () => {
    log.debug(selectedResult);
    // Set pokemon for the selected entry.
    props.setSelectedPokemon(selectedResult);
    // Close dialog from parent component.
    props.closeDialog();
  };

  // On error or when an entry is not found, notify the user.
  /**
   * Error template to be shown to the user when there is not matching results.
   * Note that it is assumed that when the returned results object is empty, the
   * status code is 404. This can be further improved.
   * @param {*} results
   * @param {*} label
   * @returns
   */
  const errorResponse = (label) => {
    return (
      <div className="p-grid p-fluid p-formgrid">
        <div className="p-col-12 p-field">
          <h4 style={{ margin: "0.25em 0em" }}>
            No matching result found for {label}, please try again.
          </h4>
        </div>
        <div className="p-col-10 p-field">
          <label>Error code: 404</label>
        </div>
      </div>
    );
  };

  return (
    <div>
      {isError ? errorResponse(props.label) : successfulResponse(props.results)}
    </div>
  );
};
