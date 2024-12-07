const express = require('express')
const moviesController = require('./../Controllers/moviesController')


const router = express.Router();
//router.param('id',moviesController.checkid)

router.route('/movie-stats')
    .get(moviesController.getMovieStats)

router.route('/highest_rated')
    .get(moviesController.highestRated,moviesController.getAllMovies)
router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)

module.exports = router;