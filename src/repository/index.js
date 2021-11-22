//repository is used to abstract over database, which allows the underlying database implementation to change
//by not exposing database access to the public, only data access
//1. connected database, port that can accept a microservice
//2. return an object of methods

const abstractedDBMethods = (collection) => {
  return {
    find: async ({ currentDay }) => {
      return new Promise((resolve, reject) => {
        const query = {
          releaseYear: {
            $gt: currentDay.getFullYear() - 1,
            $lte: currentDay.getFullYear(),
          },
          releaseMonth: {
            $gte: currentDay.getMonth() + 1,
            $lte: currentDay.getMonth() + 2,
          },
          releaseDay: {
            $lte: currentDay.getDate(),
          },
        };
        const cursor = await collection.find(query);

        const addMovie =  (movie) => {
          movies.push(movie);
        };
        const sendMovies = (err) => {
          if (err) {
            reject(
              new Error("An error occured fetching all movies, err:" + err)
            );
          }
          resolve(movies);
        };
        cursor.forEach(addMovie, sendMovies);
      });
    },
    findAll = async () => {
      return new Promise((resolve, reject) => {
        const allMovies = [];
        const cursor = await collection.find({});
        const addMovies = (movie) => {
          allMovies.push(movie);
        };
        const sendMovies = (err) => {
          if (err) {
            reject(new Error("An error occured fetching all movies, err:" + err));
          }
          resolve(allMovies);
        };
        cursor.forEach(addMovies, sendMovies);
      });
    },
    findById : async(id) => {
      return new Promise((resolve, reject) => {
        const projection = { _id: 0, id: 1, title: 1, format: 1 };
        const sendMovie = (err, movie) => {
          if (err) {
            reject(
              new Error(
                `An error occured fetching a movie with id: ${id}, err: ${err}`
              )
            );
          }
          resolve(movie);
        };
        // fetch a movie by id -- mongodb syntax
        collection.findOne({ id: id }, projection, sendMovie);
      });
    },
  };
};

const repo = (db) => {
  const { find, findAll, findById } = abstractedDBMethods(
    db.collection("movies")
  );
  const getMoviePremiers = async () => {
      const currentDay = new Date();
      const movies = [];
      return find({ currentDay, movies });
 
  };

  const getAllMovies = async () => {
    return findAll();
   
  };

  const getMovieById = async (id) => {
   return findById(id)
  };

  return Object.create({
    getAllMovies,
    getMoviePremiers,
    getMovieById,
    disconnect,
  });
};

export const connect = (connection) => {
  return new Promise((resolve, reject) => {
    if (connection) {
      resolve(repo(db));
    } else {
      reject(new Error("connection db not supplied!"));
    }
  });
};

//client -> server -> translated request to repo methods (data plane to achieve decoupling between client and database )
