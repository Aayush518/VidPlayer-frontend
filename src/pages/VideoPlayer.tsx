import React from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useVideoStore } from '../stores/videoStore';
import { Eye, Calendar, User } from 'lucide-react';

export default function VideoPlayer() {
  const { id } = useParams();
  const { videos } = useVideoStore();
  const video = videos.find(v => v.id === id);

  if (!video) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Video not found</h2>
          <p className="text-gray-500">The video you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-black rounded-xl overflow-hidden shadow-2xl mb-8">
        <div className="aspect-video">
          <ReactPlayer
            url={video.url}
            width="100%"
            height="100%"
            controls
            playing
            config={{
              youtube: {
                playerVars: { showinfo: 1 }
              }
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>
        
        <div className="flex items-center space-x-6 text-gray-600 mb-6">
          <div className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            <span>{video.views.toLocaleString()} views</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{formatDate(video.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            <span>{video.user.email}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos
            .filter(v => v.id !== video.id)
            .slice(0, 3)
            .map(relatedVideo => (
              <a
                key={relatedVideo.id}
                href={`/video/${relatedVideo.id}`}
                className="card hover:scale-[1.02] transition-all duration-300"
              >
                <img
                  src={relatedVideo.thumbnailUrl}
                  alt={relatedVideo.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {relatedVideo.title}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {relatedVideo.views.toLocaleString()} views
                  </div>
                </div>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}