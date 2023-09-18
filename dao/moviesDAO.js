import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
//movies stores the reference to the database
let movies

//We then export the class MoviesDAO which contains an async method injectDB. injectDB is called as soon
//as the server starts and provides the database reference to movies.
export default class MoviesDAO {
    static async injectDB(conn) {
        //If the reference already exists, we return
        if (movies) {
            return
        }
        //  Else, we go ahead to connect to the database name (process.env.MOVIEREVIEWS_NS) and movies
        // collection
        try {
            movies = await conn.db(process.env.MOVIEREVIEWS_NS)
                .collection('movies')
        }
        //Lastly, if we fail to get the reference, we send an error message to the console
        catch (e) {
            console.error(`unable to connect in MoviesDAO: ${e}`)
        }
    }
    //define method to access to all movies
    //  The getMovies method accepts a filter object as its first argument. The default filter has no filters, 
    //  retrieves results at page 0 and retrieves 20 movies per page.

    static async getMovies({// default filter
        filters = null,
        page = 0,
        moviesPerPage = 20, // will only get 20 movies at once
    } = {}) {

        //We have a query variable which will be empty unless a user specifies filters in his retrieval, in which case
        //we will put together a query

        let query
        //We first check if the filters object contains the property title with filters.hasOwnProperty('title') .
        if (filters) {
            if ("title" in filters) {
                //. If so, we use the $text query operator together with $search
                // to search for movie titles containing the user specified search terms. $text also allows us to query using
                // multiple words by separating your words with spaces to query for documents that match any of the
                // search terms   
                query = { $text: { $search: filters['title'] } }

                // check if user has specified the rated filter, we check if the user specified value is equal to the value in
                // the database field query = { "rated": filters['rated']}
            } else if ("rated" in filters) {
                query = { "rated": { $eq: filters['rated'] } }
            }
        }

        // a cursor fetches these documents in batches to reduce both memory consumption and network
        // bandwidth usage
        let cursor
        try {
            // We then find all movies that fit our query and assign it to a cursor. If there is any error, we just return an
            // empty moviesList and totalNumMovies to be 0        
            cursor = await movies
                .find(query)
                //    we use the skip method together with limit. When skip and limit is used together, the skip
                // applies first and the limit only applies to the documents left over after the skip.
                .limit(moviesPerPage)
                .skip(moviesPerPage * page)
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)
            return { moviesList, totalNumMovies }
        }
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0 }
        }
    }

    static async getRatings() {
        let ratings = []
        try {
            //We use movies.distinct to get all the distinct rated values from the movies collection. We then assign the
            //results to the ratings array
            ratings = await movies.distinct("rated")
            return ratings
        }
        catch (e) {
            console.error(`unable to get ratings, ${e}`)
            return ratings
        }
    }

    static async getMovieById(id) {
        try {
 //This finds all the reviews with the specific movie id and returns the specific movie together with the
//reviews in an array.
            return await movies.aggregate([
                {
// We use aggregate to provide a sequence of data aggregation operations. In our case, the first operation is
// $match, where we look for the movie document that matches the specified id.                  
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
    // Next, we use the $lookup operator to perform an equality join using the _id field from the movie
    // document with the movie_id field from reviews collection.                   
                    $lookup:
                    {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }
            ]).next()
        }
        catch (e) {
            console.error(`something went wrong in getMovieById: ${e}`)
            throw e
        }
    }
}

