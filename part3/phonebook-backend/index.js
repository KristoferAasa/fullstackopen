require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const Person = require("./model/person");

const app = express();
app.use(cors());
app.use(express.json());

morgan.token("post", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : " ";
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :post")
);

const errorHandler = (error, request, response, next) => {
  console.error("ERROR: ", error.message);

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  return response.status(500).json({ error: "Internal server error" });
};

const unknownEndpoint = (request, response) =>
  response.status(404).send({ error: "unknown endpoint" });

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/info", (request, response) => {
  Person.countDocuments({}).then((count) =>
    response.send(
      `<p>Phonebook has info for ${count} people <br> ${new Date()}</p>`
    )
  );
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/persons/", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response
      .status(400)
      .json({ error: "name and/or number is missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error));
});

const PORT = 3001;

app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
