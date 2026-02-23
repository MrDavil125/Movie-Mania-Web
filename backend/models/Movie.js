const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  originalTitle: String,
  description: String,
  posterPath: String,
  backdropPath: String,
  releaseYear: Number,
  rating: Number,
  genres: [String],
  category: { type: String, enum: ['movie', 'tv', 'anime', 'kdrama', 'webseries'] },
  tags: [String],
  downloadLinks: [{
    server: String,
    url: String,
    quality: String
  }],
  tmdbId: Number,
  imdbId: String,
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  scheduledDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
