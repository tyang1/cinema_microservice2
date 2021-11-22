const MongoClient = require("mongodb");
//How to connect server to mongodb instance?

// here we create the url connection string that the mongodb driver needs
//you can think of the getMongoURL function be used with proxy to serve high availability, by use of data plane mongoConnect/proxy

const getMongoURL = (options) => {
  const url = options.servers.reduce(
    (prev, cur) => prev + `${cur.ip}:${cur.port},`,
    "mongodb://"
  );

  return `${url.substr(0, url.length - 1)}/${options.db}`;
};

// mongoDB function to connect, open and authenticate
const mongoConnect =  (options, mediator) => {
  mediator.on("boot.ready", () => {
    MongoClient.connect(
      getMongoURL(options),
      {
        db: options.dbParameters(),
        server: options.serverParameters(),
        replset: options.replsetParameters(options.repl),
      },
      (err, db) => {
        if (err) {
          mediator.emit("db.error", err);
        }
        db.admin().authenticate(options.user, options.pass, (err, result) => {
          if (err) {
            mediator.emit("db.error", err);
          }
          mediator.emit("db.ready", db);
        });
      }
    );
  });
};

module.exports = Object.assign({}, { mongoConnect });
