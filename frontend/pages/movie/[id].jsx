import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaStar, FaDownload, FaFilm, FaCalendar, FaTags } from 'react-icons/fa';
import { getMovieById, recordDownload } from '@/utils/api';
import RelatedMovies from '@/components/movie/RelatedMovies';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function MovieDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState(null);

  useEffect(() => {
    if (id) {
      fetchMovie();
    }
  }, [id]);

  const fetchMovie = async () => {
    setLoading(true);
    const data = await getMovieById(id);
    setMovie(data);
    setLoading(false);
  };

  const handleDownload = async (serverUrl) => {
    // Redirect to shortener
    const shortenerUrl = `https://shortener.example.com/redirect?url=${encodeURIComponent(serverUrl)}&movie=${id}`;
    window.open(shortenerUrl, '_blank');
    
    // Record download
    await recordDownload(id);
  };

  if (loading) return <LoadingSpinner />;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-20">
      {/* Hero Background */}
      <div className="absolute inset-0 h-[70vh] opacity-30">
        <Image
          src={movie.backdropPath || movie.posterPath}
          alt={movie.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="rounded-2xl overflow-hidden glass-effect">
              <Image
                src={movie.posterPath}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full"
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:w-2/3 lg:w-3/4 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-400" />
                <span className="text-xl">{movie.rating?.toFixed(1)}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-blue-400" />
                <span>{movie.releaseYear}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaTags className="text-green-400" />
                <span>{movie.genres?.join(', ')}</span>
              </div>
            </div>

            <p className="text-gray-300 text-lg mb-8">{movie.description}</p>

            {/* Download Servers */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FaDownload /> Download Servers
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {movie.downloadLinks?.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => handleDownload(link.url)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition transform hover:scale-105"
                  >
                    {link.server} - {link.quality}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Movies */}
        <RelatedMovies currentMovie={movie} />
      </div>
    </div>
  );
}
