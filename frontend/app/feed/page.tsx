'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Feed() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/auth/login';
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(response.data.user);
      setLoading(false);
    } catch (err) {
      setError('No autorizado');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/" className="btn-primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-darker border-b border-gray-800 sticky top-0 z-10">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold gradient-text">
            TrendingClips
          </Link>
          
          <nav className="flex items-center gap-4">
            <span className="text-gray-400">
              👋 Hola, {user?.username}
            </span>
            <Link
              href={`/profile/${user?.id}`}
              className="btn-secondary px-4 py-2 text-sm"
            >
              👤 Perfil
            </Link>
            <Link
              href="/auth/logout"
              className="btn-secondary px-4 py-2 text-sm"
            >
              🚪 Salir
            </Link>
          </nav>
        </div>
      </header>

      {/* Feed */}
      <main className="container py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">📊 Estadísticas</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Videos</p>
                  <p className="text-2xl font-bold">{user?._count?.videos || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Seguidores</p>
                  <p className="text-2xl font-bold">{user?._count?.followers || 0}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Seguiendo</p>
                  <p className="text-2xl font-bold">{user?._count?.following || 0}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="md:col-span-2">
            <div className="card p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">🎬 Bienvenido a TrendingClips</h1>
              <p className="text-gray-400 mb-6">
                ¡Autenticación trabajando correctamente!
              </p>
              <p className="text-gray-500 mb-8">
                El sistema de feed, videos, comentarios y más se agregarán pronto.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <Link
                  href="#"
                  className="btn-primary px-6 py-3 font-semibold"
                >
                  📹 Subir Video (próximamente)
                </Link>
                <Link
                  href="#"
                  className="btn-secondary px-6 py-3 font-semibold"
                >
                  🔎 Explorar Videos (próximamente)
                </Link>
              </div>
            </div>

            {/* Info Box */}
            <div className="card p-6 mt-6 border-l-4 border-primary">
              <h3 className="font-bold mb-2">✨ Próximas Features:</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ Subida y streaming de videos</li>
                <li>✓ Feed infinito estilo TikTok</li>
                <li>✓ Sistema de likes y comentarios</li>
                <li>✓ Seguimiento de usuarios</li>
                <li>✓ Chat en tiempo real</li>
                <li>✓ Notificaciones</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}