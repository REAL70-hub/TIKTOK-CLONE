'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function UserProfile({ params }) {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('videos');

  const userId = parseInt(params.id);

  useEffect(() => {
    loadUserData();
    loadCurrentUser();
  }, [userId]);

  const loadCurrentUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (err) {
      console.error('Error loading current user:', err);
    }
  };

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Obtener perfil
      const profileRes = await axios.get(
        `${API_URL}/api/users/${userId}`
      );
      setUser(profileRes.data.user);

      // Obtener videos
      const videosRes = await axios.get(
        `${API_URL}/api/users/${userId}/videos`
      );
      setVideos(videosRes.data.videos);

      // Verificar si está siendo seguido
      const token = localStorage.getItem('token');
      if (token && currentUser?.id !== userId) {
        const followRes = await axios.get(
          `${API_URL}/api/follows/${userId}/check`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setIsFollowing(followRes.data.isFollowing);
      }
    } catch (err) {
      setError('Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }

      if (isFollowing) {
        await axios.delete(`${API_URL}/api/follows/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/api/follows/${userId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-dark">
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error || 'Usuario no encontrado'}</p>
          <Link href="/feed" className="btn-primary">
            Volver al feed
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-darker border-b border-gray-800 sticky top-0 z-10">
        <div className="container flex items-center justify-between py-4">
          <Link href="/feed" className="text-2xl font-bold gradient-text">
            TrendingClips
          </Link>
          <Link href="/feed" className="text-gray-400 hover:text-primary">
            ← Volver
          </Link>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-gradient-to-b from-darker to-dark py-8 border-b border-gray-800">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={user.avatar || 'https://via.placeholder.com/150'}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-primary"
              />
            </div>

            {/* Info */}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
              <p className="text-gray-400 mb-4">{user.bio || 'Sin biografía'}</p>
              <div className="text-sm text-gray-500 mb-4">
                Se unió {new Date(user.createdAt).toLocaleDateString('es-ES')}
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-6">
                <div>
                  <p className="text-2xl font-bold text-primary">{user._count?.videos || 0}</p>
                  <p className="text-gray-400">Videos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{user._count?.followers || 0}</p>
                  <p className="text-gray-400">Seguidores</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{user._count?.following || 0}</p>
                  <p className="text-gray-400">Siguiendo</p>
                </div>
              </div>

              {/* Actions */}
              {!isOwnProfile && (
                <button
                  onClick={handleFollowToggle}
                  className={isFollowing ? 'btn-secondary' : 'btn-primary'}
                >
                  {isFollowing ? '✓ Siguiendo' : '+ Seguir'}
                </button>
              )}
              {isOwnProfile && (
                <Link href={`/profile/${userId}/edit`} className="btn-primary">
                  ✏️ Editar Perfil
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-darker border-b border-gray-800 sticky top-16 z-10">
        <div className="container flex gap-8">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-4 font-semibold border-b-2 ${
              activeTab === 'videos'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-400'
            }`}
          >
            📹 Videos ({videos.length})
          </button>
          <Link
            href={`/profile/${userId}/followers`}
            className="py-4 font-semibold border-b-2 border-transparent text-gray-400 hover:text-primary"
          >
            👥 Seguidores
          </Link>
        </div>
      </div>

      {/* Content */}
      <main className="container py-8">
        {activeTab === 'videos' && (
          <div>
            {videos.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                  <div key={video.id} className="card overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer">
                    <div className="relative bg-black h-64 overflow-hidden">
                      <video
                        src={video.videoUrl}
                        className="w-full h-full object-cover"
                        onMouseEnter={e => e.currentTarget.play()}
                        onMouseLeave={e => e.currentTarget.pause()}
                      />
                      {video.thumbnail && (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold truncate">{video.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{video.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500 mt-2">
                        <span>❤️ {video._count?.likes || 0}</span>
                        <span>💬 {video._count?.comments || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">Este usuario no ha subido videos aún</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}