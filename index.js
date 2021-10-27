"use strict";
// we load all the depencies we need
const { EventEmitter } = require("events");
const server = require("./server/server/movie-service-server.js");
const repository = require("./repository/repository");
const config = require("./config/movie-service-config.js");
const connection = require("./server/mongodb-replicaset.js");
const mediator = new EventEmitter();

// event listener when the repository has been connected
mediator.on("db.ready", (db) => {
  let rep;
  repository
    .connect(db)
    .then((repo) => {
      console.log("Repository Connected. Starting Server");
      rep = repo;
      return server.start({
        port: config.serverSettings.port,
        repo,
      });
    })
    .then((app) => {
      console.log(
        `Server started succesfully, running on port: ${config.serverSettings.port}.`
      );
      app.on("close", () => {
        rep.disconnect();
      });
    });
});
mediator.on("db.error", (err) => {
  console.error(err);
});

// we load the connection to the repository
connection(config.dbSettings, mediator);
// init the repository connection, and the event listener will handle the rest
mediator.emit("boot.ready");
