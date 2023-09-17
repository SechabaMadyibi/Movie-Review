import express from 'express'
import MoviesController from './movies.controller.js'
const router = express.Router() // get access to express router
router.route('/').get(MoviesController.apiGetMovies)
import ReviewsController from './reviews.controller.js'

router
 .route("/review")
 .post(ReviewsController.apiPostReview)
 .put(ReviewsController.apiUpdateReview)
 .delete(ReviewsController.apiDeleteReview)
 
export default router

// import express from 'express'
// const router = express.Router() // get access to express router
// router.route('/').get((req,res) => res.send('hello world'))
// export default router