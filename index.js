import app from './server.js'
import mongodb from "mongodb"
import dotenv from "dotenv"
import MoviesDAO from './dao/moviesDAO.js'
import ReviewsDAO from './dao/reviewsDAO.js'

//We create an asynchronous function main() to connect to our MongoDB cluster and call functions that
//access our database.
async function main(){
   // to load in the environment variables
 dotenv.config()
//In the above, we create an instance of MongoClient and pass in the database URI.
const client = new mongodb.MongoClient(
process.env.MOVIEREVIEWS_DB_URI
 )
 const port = process.env.PORT || 8000
 try {
 // Connect to the MongoDB cluster
 await client.connect()
 await MoviesDAO.injectDB(client)
 await ReviewsDAO.injectDB(client)
 app.listen(port, () =>{
 console.log('server is running on port:'+port);
 })
 } catch (e) {
 console.error(e);
 process.exit(1)
 }
}
main().catch(console.error);