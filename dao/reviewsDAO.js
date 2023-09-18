import mongodb from "mongodb"

//We import mongodb to get access to ObjectId. We need ObjectId to convert an id string to a MongoDB
//Object id later on
const ObjectId = mongodb.ObjectId
let reviews
export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return
        }
        try {
            reviews = await
                conn.db(process.env.MOVIEREVIEWS_NS).collection('reviews')
        }
        catch (e) {
            console.error(`unable to establish connection handle in
reviewDAO: ${e}`)
        }
    }

//We first create a reviewDoc document object. Note that for the movie_id, we have to first convert the
//movieId string to a MongoDB object id. We then insert it into the reviews collection with insertOne
//addreview method
    static async addReview(movieId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                movie_id: new ObjectId(movieId)
            }
            return await reviews.insertOne(reviewDoc)
        }
        catch (e) {
            console.error(`unable to post review: ${e}`)
            return { error: e }
        }
    }

//updater review method
//When calling reviews.updateOne, we specify the first argument {user_id: userId,_id:
//ObjectId(reviewId)} to filter for an existing review created by userId and with reviewId. If the
//review exists, we then update it with the second argument which contains the new review text and date.

    static async updateReview(reviewId, userId, review, date){
        try{
        const updateResponse = await reviews.updateOne(
        {user_id: userId,_id: ObjectId(reviewId)},
        {$set:{review:review, date: date}}
        )
        return updateResponse
        }
        catch(e){
        console.error(`unable to update review: ${e}`)
        return { error: e}
        }
       }

    // When calling reviews.deleteOne, similar to updateOne, we specify ObjectId(reviewId) to look for an
    //existing review with reviewId and created by userId. If the review exists, we then delete it      
       static async deleteReview(reviewId, userId){
        try{
        const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId,
        })
        return deleteResponse
        }
        catch(e){
        console.error(`unable to delete review: ${e}`)
        return { error: e}
        }
       }
}