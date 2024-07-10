import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    status: "",
  });

  useEffect(() => {
    personService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const resetForms = () => {
    setNewName("");
    setNewNumber("");
  };

  const setMessage = (type, message) => {
    setNotification({ message, status: type });
    setTimeout(() => {
      setNotification({ message: null, status: "" });
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const person = { name: newName, number: newNumber };
    const existingPerson = persons.find((p) => p.name === newName);

    if (existingPerson) {
      const question = `${newName} is already added! Replace the old number with a new one?`;
      if (window.confirm(question)) {
        personService
          .update(existingPerson.id, person)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson
              )
            );
            resetForms();
            setMessage(
              "success",
              `Number of ${returnedPerson.name} was updated successfully!`
            );
          })
          .catch((error) => {
            setMessage(
              "error",
              `Information of ${newName} has already been removed from server`
            );
            setPersons(persons.filter((p) => p.id !== existingPerson.id));
          });
      }
    } else {
      personService
        .create(person)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          resetForms();
          setMessage("success", `${newName} has been added successfully!`);
        })
        .catch((error) => {
          setMessage("error", `Failed to add ${newName}`);
        });
    }
  };

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id);
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .delete(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          setMessage(
            "success",
            `${person.name} has been deleted successfully!`
          );
        })
        .catch((error) => {
          setMessage(
            "error",
            `Information of ${person.name} has already been removed from server`
          );
          setPersons(persons.filter((p) => p.id !== id));
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notification.message}
        status={notification.status}
      />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
