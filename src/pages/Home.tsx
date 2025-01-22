import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useVideoStore } from '../stores/videoStore';
import { Play, Clock, Eye } from 'lucide-react';

export default function Home() {
  const { videos, isLoading, fetchVideos } = useVideoStore();

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Featured Videos</h1>
        <div className="flex space-x-4">
          <button className="btn btn-secondary">
            Latest
          </button>
          <button className="btn btn-secondary">
            Most Viewed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video) => (
          <Link
            key={video.id}
            to={`/video/${video.id}`}
            className="group card hover:scale-[1.02] transition-all duration-300"
          >
            <div className="relative aspect-video">
              <img
                src={video.thumbnailUrl || 'https://via.placeholder.com/640x360'}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <Play className="text-white opacity-0 group-hover:opacity-100 transform scale-150 transition-all duration-300" />
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h2>
              
              <p className="text-gray-600 mb-4 line-clamp-2">
                {video.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {formatViews(video.views)} views
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(video.createdAt)}
                  </span>
                </div>
                <span className="text-blue-500">
                  {video.user.email.split('@')[0]}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}