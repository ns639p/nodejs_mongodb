const express = require('express')
const moviesController = require('./../Controllers/moviesController')
const authController = require('./../Controllers/authController')

const router = express.Router();
//router.param('id',moviesController.checkid)

router.route('/movie-stats')
    .get(moviesController.getMovieStats)


router.route('/movie-by-genre/:genre')
    .get(moviesController.getMoviesByGenre)

router.route('/highest_rated')
    .get(moviesController.highestRated,moviesController.getAllMovies)
router.route('/')
    .get(authController.protect,moviesController.getAllMovies)
    .post(moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(authController.protect,authController.restrict('admin'),moviesController.deleteMovie)

module.exports = router;