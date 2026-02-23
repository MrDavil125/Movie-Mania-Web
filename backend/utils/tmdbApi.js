const axios = require('axios');

class TMDBAPI {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseURL = 'https://api.themoviedb.org/3';
  }

  async searchMovie(query) {
    try {
      const response = await axios.get(`${this.baseURL}/search/movie`, {
        params: {
          api_key: this.apiKey,
          query: query,
          include_adult: false
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('TMDB Search Error:', error);
      return null;
    }
  }

  async getMovieDetails(tmdbId) {
    try {
      const response = await axios.get(`${this.baseURL}/movie/${tmdbId}`, {
        params: {
          api_key: this.apiKey,
          append_to_response: 'credits,images,videos'
        }
      });
      return response.data;
    } catch (error) {
      console.error('TMDB Details Error:', error);
      return null;
    }
  }

  async getTrending() {
    try {
      const response = await axios.get(`${this.baseURL}/trending/movie/week`, {
        params: { api_key: this.apiKey }
      });
      return response.data.results;
    } catch (error) {
      console.error('TMDB Trending Error:', error);
      return null;
    }
  }
}

module.exports = new TMDBAPI();
