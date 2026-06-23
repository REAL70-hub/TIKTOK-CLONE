/**
 * Middleware para manejo de errores
 */

const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);

  // Errores de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.message
    });
  }

  // Errores de base de datos
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'campo';
    return res.status(400).json({
      success: false,
      error: `${field} ya existe`,
      message: `El ${field} ya está registrado en el sistema`
    });
  }

  // Error por defecto
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Error interno del servidor',
    status: err.status || 500
  });
};

module.exports = errorHandler;