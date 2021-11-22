"use strict";
const status = require("http-status");
export function movieAPI(app, options) {
  const { repo } = options;

  // here we get all the movies
  app.get("/movies", (req, res, next) => {
    repo
      .getAllMovies() // domain policy
      .then((movies) => {
        res.status(status.OK).json(movies);
      })
      .catch(next);
  });

  app.get("movies/:id", (req, res, next) => {
    repo
      .getMovieById(req.params.id) // domain policy
      .then((movie) => {
        res.status(status.OK).json(movie);
      })
      .catch(next);
  });

  app.get("movies/premiers", (req, res, next) => {
    repo
      .getMoviePremiers() // domain policy
      .then((premiers) => {
        res.status(status.OK).json(premiers);
      })
      .catch(next);
  });
}
