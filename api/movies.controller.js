import MoviesDAO from '../dao/moviesDAO.js'

export default class MoviesController {
    // When apiGetMovies is called via a URL, there will be a query string in the response object (req.query)
    // where certain filter parameters might be specified and passed in through key-value pairs
    static async apiGetMovies(req, res, next) {
        // We check if moviesPerPage exists, parse it into an integer. We do the same for the page query string
        const moviesPerPage = req.query.moviesPerPage ?
            parseInt(req.query.moviesPerPage) : 20
        const page = req.query.page ? parseInt(req.query.page) : 0
        let filters = {}

        // We then check if the rated query string exists, then add to the filters object.
        //  We do the same for title
        if (req.query.rated) {
            filters.rated = req.query.rated
        }
        else if (req.query.title) {
            filters.title = req.query.title
        }
        // We next call getMovies in MoviesDAO that we have just implemented. Remember that getMovies will return
        // moviesList and totalNumMovies
        const { moviesList, totalNumMovies } = await
            MoviesDAO.getMovies({ filters, page, moviesPerPage })
        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,

        }
        //We then send a JSON response with the above response object to whoever calls this URL
        res.json(response)
    }

    static async apiGetMovieById(req, res, next) {
        try {
            //We first look for an id parameter which is the value after the ‘/’
            let id = req.params.id || {}
            let movie = await MoviesDAO.getMovieById(id)
//  We then call MoviesDAO.getMovieById which we will create later. The method returns us the specific
// movie in a JSON response. If there is no movie, we return an error
            if (!movie) {
                res.status(404).json({ error: "not found" })
                return
            }
            res.json(movie)
        }
        catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiGetRatings(req, res, next) {
        try {
            let propertyTypes = await MoviesDAO.getRatings()
            res.json(propertyTypes)
        }
        catch (e) {
            console.log(`api,${e}`)
            res.status(500).json({ error: e })
        }
    }
}

