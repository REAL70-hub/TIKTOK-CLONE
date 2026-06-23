'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-dark via-dark to-darker flex items-center justify-center p-4">
      <div className="text-center max-w-2xl animate-slide-up">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            <span className="gradient-text">TrendingClips</span>
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Comparte videos cortos y conecta con el mundo
          </p>
          <p className="text-gray-500 mb-8">
            Crea, descubre y diviértete en la plataforma de videos más rápida
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/auth/register"
            className="btn-primary px-8 py-3 text-lg font-semibold"
          >
            Comenzar Ahora
          </Link>
          <Link
            href="/auth/login"
            className="btn-secondary px-8 py-3 text-lg font-semibold"
          >
            Inicia Sesión
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="card hover:shadow-lg hover:shadow-primary/20 transition-all">
            <div className="text-4xl mb-4">📹</div>
            <h3 className="text-xl font-bold mb-2">Sube Videos</h3>
            <p className="text-gray-400">
              Comparte tus mejores momentos con videos de hasta 5 minutos
            </p>
          </div>

          <div className="card hover:shadow-lg hover:shadow-primary/20 transition-all">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-bold mb-2">Descubre</h3>
            <p className="text-gray-400">
              Explora un feed infinito de contenido personalizado
            </p>
          </div>

          <div className="card hover:shadow-lg hover:shadow-primary/20 transition-all">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Conecta</h3>
            <p className="text-gray-400">
              Sigue a creadores y conversa en tiempo real
            </p>
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-16 p-8 card">
          <h2 className="text-2xl font-bold mb-4">¿Por qué TrendingClips?</h2>
          <ul className="text-left text-gray-300 space-y-3 max-w-xl mx-auto">
            <li className="flex items-center">
              <span className="text-primary mr-3">✓</span>
              Feed inteligente que aprende tus gustos
            </li>
            <li className="flex items-center">
              <span className="text-primary mr-3">✓</span>
              Chat en tiempo real con otros creadores
            </li>
            <li className="flex items-center">
              <span className="text-primary mr-3">✓</span>
              Sistema de notificaciones para no perderte nada
            </li>
            <li className="flex items-center">
              <span className="text-primary mr-3">✓</span>
              Privacidad y control total de tu contenido
            </li>
            <li className="flex items-center">
              <span className="text-primary mr-3">✓</span>
              Comunidad segura y respetuosa
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-gray-500">
          <p>
            Made with ❤️ by{' '}
            <span className="gradient-text font-bold">REAL70</span>
          </p>
          <p className="text-sm mt-2">
            © 2026 TrendingClips. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </main>
  );
}