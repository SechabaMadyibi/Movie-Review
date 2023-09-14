
//movies stores the reference to the database
let movies

//We then export the class MoviesDAO which contains an async method injectDB. injectDB is called as soon
//as the server starts and provides the database reference to movies.
export default class MoviesDAO{
 static async injectDB(conn){
//If the reference already exists, we return
 if(movies){
 return
 }
//  Else, we go ahead to connect to the database name (process.env.MOVIEREVIEWS_NS) and movies
// collection
 try{
 movies = await conn.db(process.env.MOVIEREVIEWS_NS)
.collection('movies')
 }
 //Lastly, if we fail to get the reference, we send an error message to the console
 catch(e){
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
    } = {})
    {

//We have a query variable which will be empty unless a user specifies filters in his retrieval, in which case
//we will put together a query

    let query
    //We first check if the filters object contains the property title with filters.hasOwnProperty('title') .
    if(filters){
    if("title" in filters){
    query = { $text: { $search: filters['title']}}
    }else if("rated" in filters){
    query = { "rated": { $eq: filters['rated']}}
    }
    }
    let cursor
    try{
   cursor = await movies
   .find(query)
   .limit(moviesPerPage)
.skip(moviesPerPage * page)
 const moviesList = await cursor.toArray()
 const totalNumMovies = await movies.countDocuments(query)
 return {moviesList, totalNumMovies}
 }
 catch(e){
 console.error(`Unable to issue find command, ${e}`)
 return { moviesList: [], totalNumMovies: 0}
 }
 }
}

