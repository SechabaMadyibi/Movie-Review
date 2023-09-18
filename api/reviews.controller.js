import ReviewsDAO from '../dao/reviewsDAO.js'

export default class ReviewsController {
    //apiPostReview method
    //We get information from the request’s body parameter
    static async apiPostReview(req, res, next) {
        try {
            const movieId = req.body.movie_id
            const review = req.body.review
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }
            //We send the information to ReviewsDAO.addReview which we will create later
            const date = new Date()
            const ReviewResponse = await ReviewsDAO.addReview(
                movieId,
                userInfo,
                review,
                date
            )
            res.json({ status: "success " })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    //apiUpdateReview method
    //We get information from the request’s body parameter
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id
            const review = req.body.review
            const date = new Date()
            //We then call ReviewsDAO.updateReview and pass in user_id to ensure that the user who is updating the
            //view is the one who has created it
            const ReviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id,
                review,
                date
            )
            //updateReview returns a document ReviewResponse which contains the property modifiedCount
            //modifiedCount contains the number of modified documents.
            var { error } = ReviewResponse
            if (error) {
                res.status.json({ error })
            }
            if (ReviewResponse.modifiedCount === 0) {
                throw new Error("unable to update review. User may not be original poster")
            }
            res.json({ status: "success " })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.body.review_id
            const userId = req.body.user_id
            const ReviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId,
            )

            res.json({ status: "success " })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
}