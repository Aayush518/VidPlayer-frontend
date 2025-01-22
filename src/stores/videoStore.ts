import { create } from 'zustand';
import api from '../lib/api';

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string | null;
  description: string | null;
  userId: string;
  user: {
    email: string;
  };
  createdAt: string;
  views: number;
}

interface VideoState {
  videos: Video[];
  isLoading: boolean;
  error: string | null;
  fetchVideos: () => Promise<void>;
  addVideo: (video: Omit<Video, 'id' | 'userId' | 'createdAt' | 'views' | 'user'>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
}

export const useVideoStore = create<VideoState>((set) => ({
  videos: [],
  isLoading: false,
  error: null,
  fetchVideos: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.get('/api/videos');
      set({ videos: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch videos' });
    } finally {
      set({ isLoading: false });
    }
  },
  addVideo: async (videoData) => {
    try {
      set({ isLoading: true, error: null });
      await api.post('/api/videos', videoData);
      const { data } = await api.get('/api/videos');
      set({ videos: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to add video' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteVideo: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/api/videos/${id}`);
      const { data } = await api.get('/api/videos');
      set({ videos: data });
    } catch (error: any) {
      set({ error: error.message || 'Failed to delete video' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));