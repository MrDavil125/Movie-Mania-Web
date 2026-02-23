import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaDownload } from 'react-icons/fa';

export default function MovieCard({ movie }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="relative group cursor-pointer"
    >
      <Link href={`/movie/${movie._id}`}>
        <div className="relative overflow-hidden rounded-xl glass-effect">
          <div className="aspect-[2/3] relative">
            <Image
              src={movie.posterPath || '/placeholder.jpg'}
              alt={movie.title}
              fill
              className="object-cover transition-transform group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 p-4 w-full">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{movie.rating?.toFixed(1)}</span>
                  </div>
                  <span className="text-sm">{movie.releaseYear}</span>
                </div>
                
                <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition">
                  <FaDownload /> Download
                </button>
              </div>
            </div>
          </div>
          
          {/* Info */}
          <div className="p-3">
            <h3 className="font-semibold text-white truncate">{movie.title}</h3>
            <p className="text-sm text-gray-400">{movie.category}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
