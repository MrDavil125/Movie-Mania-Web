const Movie = require('../models/Movie');
const tmdbApi = require('../utils/tmdbApi');

exports.createMovie = async (req, res) => {
  try {
    const movieData = req.body;
    
    // Auto-fetch from TMDB if title provided
    if (movieData.autoFetch && movieData.title) {
      const searchResults = await tmdbApi.searchMovie(movieData.title);
      if (searchResults && searchResults.length > 0) {
        const tmdbMovie = searchResults[0];
        const details = await tmdbApi.getMovieDetails(tmdbMovie.id);
        
        movieData.posterPath = `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`;
        movieData.backdropPath = `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}`;
        movieData.description = tmdbMovie.overview;
        movieData.releaseYear = new Date(tmdbMovie.release_date).getFullYear();
        movieData.rating = tmdbMovie.vote_average;
        movieData.genres = details.genres.map(g => g.name);
        movieData.tmdbId = tmdbMovie.id;
        movieData.imdbId = details.imdb_id;
      }
    }
    
    const movie = new Movie(movieData);
    await movie.save();
    
    res.status(201).json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, featured, trending } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (trending) query.trending = trending === 'true';
    
    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Movie.countDocuments(query);
    
    res.json({
      success: true,
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { q, category } = req.query;
    const query = {};
    
    if (q) {
      query.$text = { $search: q };
    }
    
    if (category) {
      query.category = category;
    }
    
    const movies = await Movie.find(query)
      .limit(20)
      .sort({ rating: -1 });
    
    res.json({ success: true, movies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
