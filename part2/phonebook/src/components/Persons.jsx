import React from "react";

const Persons = ({ personsToShow, handleDelete }) => {
  return (
    <div>
      {personsToShow.map((person) => (
        <div key={person.id}>
          {person.name} {person.number} 
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </div>
      ))}
    </div>
  );
};

export default Persons;