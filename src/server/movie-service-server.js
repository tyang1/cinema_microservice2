"use strict";
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const movieAPI = require("../api/movies-service-movies.js");

//server factory function:
/*
Here what we are doing is, instantiating a new express app, verifying if we provide a repository and server port objects, then we apply some middleware to our express app, like morgan for logging, helmet for security, and a error handling function, and at the end we are exporting a start function to be able to start the server
*/

const start = (options) => {
  return new Promise((resolve, reject) => {
    // we need to verify if we have a repository added and a server port
    if (!options.repo) {
      reject(
        new Error("The server must be started with a connected repository")
      );
    }
    if (!options.port) {
      reject(new Error("The server must be started with an available port"));
    }
    const app = express();
    app.use(morgan("dev"));
    app.use(helmet());
    app.use((err, req, res, next) => {
      reject(new Error("Something went wrong!, err:" + err));
      res.status(500).send("Something went wrong!");
    });
    movieAPI(app, options); //DI principle to provide use cases

    const server = app.listen(options.port, () => resolve(server));
  });
};

module.exports = Object.assign({}, { start });
