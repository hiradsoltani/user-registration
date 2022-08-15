// Import react and hooks
import React, { useEffect, useRef, useState, useCallback } from "react";

import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { getPokemonByType, getPokemonTypes } from "../pokemon/PokemonService";
import { SearchBox } from "../search/SearchBox";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { SelectButton } from "primereact/selectbutton";
import { confirmDialog } from "primereact/confirmdialog";
import { ConfirmDialog } from "primereact/confirmdialog";
import { classNames } from "primereact/utils";

import log from "loglevel";
import { SearchDropDown } from "../search/SearchDropDown";

import _ from "lodash";

import "./UserForm.css";

const UserForm1 = function () {
  const [formData, setFormData] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  // minimal pokemon is an object that has pokemin's name and url only.
  const [minimalPokemons, setMinimalPokemons] = useState(null);
  const [selectedPokemonType, setSelectedPokemonType] = useState(null);
  const [pokemonTypes, setPokemonTypes] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [searchOption, setSearchOption] = useState(null);
  const toast = useRef(null);
  const defaultValues = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    pokemon: "",
  };

  // Message template for toast notifications.
  const showToast = useCallback((status, summaryHeading, messageDetails) => {
    toast.current.show({
      severity: status,
      summary: summaryHeading,
      detail: messageDetails,
      life: 3000,
    });
  }, []);

  // Get all available pokemon types to be shown in a dropdown menu.
  useEffect(() => {
    getPokemonTypes()
      .then((response) => {
        // Sort the results.
        response.sort((a, b) =>
          a.name > b.name ? 1 : a.name < b.name ? -1 : 0
        );
        setPokemonTypes(response);
      })
      .catch((error) => {
        showToast(
          "error",
          "Error",
          "Cannot retrieve pokemon types. Please try again: " + error
        );
      });
  }, [showToast]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    log.debug(data);
    setFormData(data);
    confirm(data);

    reset();
  };

  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const handleTypeChange = function (selectedType) {
    // User has selected a type to narrow down the options.
    // Fetch the pokemons for the type selected and show them
    // in a dropdown menu.
    if (!_.isNil(selectedType) && selectedPokemonType !== selectedType) {
      setSelectedPokemonType(selectedType);
      getPokemonByType(selectedType.name)
        .then((response) => {
          // Sort the results.
          response.sort((a, b) =>
            a.pokemon.name > b.pokemon.name
              ? 1
              : a.pokemon.name < b.pokemon.name
              ? -1
              : 0
          );
          setMinimalPokemons(response);
        })
        .catch((error) => {
          showToast(
            "error",
            "Error",
            `Cannot retrieve pokemon by type ${selectedType.name}. Please try again: ` +
              error
          );
        });
      log.debug(minimalPokemons);
    } else if (_.isNil(selectedType)) {
      setSelectedPokemonType(selectedType);
    }
  };

  // Props to be passed into the pokemon text search box.
  const pokemonNameProps = {
    label: "Type Pokemon Name",
    setSelectedPokemon,
    setSelectedPokemonType,
  };

  // Props to be passed into pokemon drop down selection.
  const pokemonDropdownProps = {
    label: "Select Pokemon Name",
    minimalPokemons,
    setSelectedPokemon,
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );

  // Confirm pop up page to allow user review their selection before submitting results.
  const confirm = (data) => {
    const message = (
      <html>
        <p>
          Are you sure you want to create a new user with the information below?
        </p>
        <p>First Name: {data.firstName.trim()}</p>
        <p>Last Name: {data.lastName.trim()}</p>
        <p>Phone Number: {data.phoneNumber.trim()}</p>
        <p>Address: {data.address.trim()}</p>
        <p>Pokemon: {selectedPokemon.name}</p>
      </html>
    );
    confirmDialog({
      message,
      header: "Review Your Selections",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  // When a user accepts the confirm dialog, submit the form.
  const accept = function () {
    log.debug("User accepted.");
    setShowMessage(true);
  };

  // When a user rejects the confirm dialog, don't take any action.
  const reject = function () {
    log.debug("User rejected.");
  };

  // Define the search options for user to select from.
  const searchOptions = [
    { label: "Pokemon Name", value: "name" },
    { label: "Pokemon Type", value: "type" },
  ];

  // Define which search options to show the user, based on what search option they select.
  const showSearchPanel = function () {
    if (_.isNil(searchOption)) {
      return;
    }

    return searchOption === "name" ? (
      <Card style={{ marginBottom: "2em" }}>
        <div className="p-fluid p-formgrid p-grid">
          <div className="p-field p-col">
            <SearchBox {...pokemonNameProps} />
          </div>
        </div>
      </Card>
    ) : (
      <div className="p-fluid p-formgrid p-grid">
        <Card>
          <label>Filter by Type</label>
          <Dropdown
            style={{ marginBottom: "2em" }}
            className="ui-column-filter"
            showClear
            value={selectedPokemonType}
            optionLabel="name"
            options={pokemonTypes}
            onChange={(e) => handleTypeChange(e.value)}
          />
          {selectedPokemonType && (
            <>
              <label>Select a pokemon name for selected type</label>
              <SearchDropDown {...pokemonDropdownProps} />
            </>
          )}
        </Card>
      </div>
    );
  };

  return (
    <div className="form-demo">
      <Toast ref={toast} />
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position="top"
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "30vw" }}
      >
        <div className="flex align-items-center flex-column pt-6 px-3">
          <i
            className="pi pi-check-circle"
            style={{ fontSize: "5rem", color: "var(--green-500)" }}
          ></i>
          <h5>User Creation Successful!</h5>
          <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>
            Your user is created under name{" "}
            <b>
              {formData.firstName} {formData.lastName}
            </b>
          </p>
        </div>
      </Dialog>

      <div className="flex justify-content-center">
        <div className="card">
          <h5 className="text-center">Register</h5>
          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: "First Name is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.firstName}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="firstName"
                  className={classNames({ "p-error": errors.firstName })}
                >
                  First Name*
                </label>
              </span>
              {getFormErrorMessage("firstName")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: "Last Name is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.lastName}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="lastName"
                  className={classNames({ "p-error": errors.lastName })}
                >
                  Last Name*
                </label>
              </span>
              {getFormErrorMessage("lastName")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{ required: "Phone Number is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.phoneNumber}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="phoneNumber"
                  className={classNames({ "p-error": errors.phoneNumber })}
                >
                  Phone Number*
                </label>
              </span>
              {getFormErrorMessage("phoneNumber")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "Address is required." }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.address}
                      {...field}
                      autoFocus
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor="address"
                  className={classNames({ "p-error": errors.address })}
                >
                  Address*
                </label>
              </span>
              {getFormErrorMessage("address")}
            </div>
            <div className="field-checkbox">
              <Controller
                name="pokemon"
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState }) =>
                  selectedPokemon && (
                    <Checkbox
                      inputId={field.name}
                      onChange={(e) => field.onChange(e.checked)}
                      checked={field.value}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )
                }
              />
              <label
                htmlFor="pokemon"
                className={classNames({ "p-error": errors.pokemon })}
              >
                {selectedPokemon
                  ? `I have selected ${selectedPokemon.name}`
                  : "Select a pokemon using one of the options below"}
              </label>
            </div>

            <SelectButton
              value={searchOption}
              options={searchOptions}
              onChange={(e) => setSearchOption(e.value)}
            ></SelectButton>
            <div>{showSearchPanel()}</div>
            <Button label="Submit" type="submit" className="mt-2" />
            <ConfirmDialog />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm1;
