'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Logout() {
  useEffect(() => {
    // Limpiar token y usuario
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirigir al inicio después de 2 segundos
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-dark to-darker flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-4">
          Adiós 👋
        </h1>
        <p className="text-gray-400 mb-4">
          Tu sesión ha sido cerrada exitosamente
        </p>
        <p className="text-gray-500 mb-6">
          Redirigiendo al inicio...
        </p>
        <Link
          href="/"
          className="btn-primary px-8 py-3 inline-block"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}