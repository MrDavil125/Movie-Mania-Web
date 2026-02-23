import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaMagic, FaCheck, FaTimes } from 'react-icons/fa';

export default function AutoFetch({ onMovieFetched }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const searchTMDB = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/tmdb/search?query=${searchQuery}`);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Search failed:', error);
    }
    setLoading(false);
  };

  const fetchMovieDetails = async (tmdbId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/tmdb/movie/${tmdbId}`);
      setSelectedMovie(response.data);
      onMovieFetched(response.data);
    } catch (error) {
      console.error('Fetch failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaMagic className="text-purple-400" />
        Auto Fetch Movie Details
      </h2>
      
      {/* Search Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchTMDB()}
          placeholder="Enter movie name..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={searchTMDB}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
        >
          <FaSearch /> Search
        </button>
      </div>
      
      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && !selectedMovie && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {searchResults.map((movie) => (
              <motion.div
                key={movie.id}
                whileHover={{ scale: 1.02 }}
                className="glass-effect rounded-lg p-4 cursor-pointer"
                onClick={() => fetchMovieDetails(movie.id)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-400">{movie.release_date?.slice(0, 4)}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Selected Movie Preview */}
      {selectedMovie && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-effect rounded-lg p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">Selected: {selectedMovie.title}</h3>
            <button
              onClick={() => setSelectedMovie(null)}
              className="text-red-400 hover:text-red-300"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="flex gap-6">
            <img
              src={`https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}`}
              alt={selectedMovie.title}
              className="w-32 h-48 object-cover rounded-lg"
            />
            <div>
              <p className="text-gray-300 mb-2">{selectedMovie.overview}</p>
              <p><strong>Rating:</strong> {selectedMovie.vote_average}/10</p>
              <p><strong>Genres:</strong> {selectedMovie.genres?.map(g => g.name).join(', ')}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
