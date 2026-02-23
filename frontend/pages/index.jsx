import { useState, useEffect } from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import TrendingSection from '@/components/home/TrendingSection';
import LatestSection from '@/components/home/LatestSection';
import PopularSection from '@/components/home/PopularSection';
import AnimeSection from '@/components/home/AnimeSection';
import WebSeriesSection from '@/components/home/WebSeriesSection';
import KDramaSection from '@/components/home/KDramaSection';
import { getMovies } from '@/utils/api';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [trendingRes, latestRes, popularRes] = await Promise.all([
        getMovies({ trending: true, limit: 10 }),
        getMovies({ limit: 10 }),
        getMovies({ sort: 'views', limit: 10 })
      ]);
      
      setTrending(trendingRes.movies);
      setLatest(latestRes.movies);
      setPopular(popularRes.movies);
    };
    
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <HeroBanner movies={trending.slice(0, 5)} />
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        <TrendingSection movies={trending} />
        <LatestSection movies={latest} />
        <PopularSection movies={popular} />
        <AnimeSection />
        <WebSeriesSection />
        <KDramaSection />
      </div>
    </div>
  );
}
