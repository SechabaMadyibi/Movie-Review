import express from 'express'
import MoviesController from './movies.controller.js'
const router = express.Router() // get access to express router
import ReviewsController from './reviews.controller.js'

router.route('/').get(MoviesController.apiGetMovies)
//This route retrieves a specific movie and all reviews associated for that movie.
router.route("/id/:id").get(MoviesController.apiGetMovieById)
// This route returns us a list of movie ratings (e.g. ‘G’, ‘PG’, ‘R’) so that a user can select the ratings from
// a dropdown menu in the front end

router.route("/ratings").get(MoviesController.apiGetRatings)
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