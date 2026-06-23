# 📋 Contribuyendo a TrendingClips

¡Gracias por querer contribuir al proyecto! Sigue estas pautas para ayudar a que el proyecto crezca.

## 🎯 Cómo Contribuir

### 1. Fork el Proyecto
```bash
# Ve a https://github.com/REAL70-hub/tiktok-clone
# Haz clic en "Fork"
```

### 2. Clona tu Fork
```bash
git clone https://github.com/TU_USUARIO/tiktok-clone.git
cd tiktok-clone
```

### 3. Crea una Rama
```bash
git checkout -b feature/tu-feature
# o
git checkout -b fix/tu-fix
```

### 4. Realiza los Cambios

Asegúrate de:
- ✅ Seguir el estilo de código existente
- ✅ Comentar tu código
- ✅ Probar los cambios localmente

### 5. Commit y Push
```bash
git add .
git commit -m "Descripción clara de los cambios"
git push origin feature/tu-feature
```

### 6. Abre un Pull Request
- Ve a tu fork en GitHub
- Haz clic en "Pull Request"
- Describe qué cambios hiciste y por qué

## 📝 Estándares de Código

### JavaScript/TypeScript
```javascript
// ✅ Bueno
function calculateVideoScore(views, likes, duration) {
  const baseScore = views * 0.1;
  const likeBonus = likes * 5;
  return baseScore + likeBonus;
}

// ❌ Evitar
function calc(a, b, c) {
  return a * 0.1 + b * 5;
}
```

### Nombres descriptivos
- `isLoggedIn` en lugar de `loggedIn`
- `getUserById` en lugar de `getUser`
- `createVideoHandler` en lugar de `handler`

### Comentarios
```javascript
// ✅ Comentario útil
// Calcula el score del video basado en engagement
const score = calculateEngagementScore(video);

// ❌ Comentario innecesario
// Esto es un número
const num = 42;
```

## 🧪 Testing

Antes de hacer commit, verifica:
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev

# Abre http://localhost:3000 y prueba manualmente
```

## 📌 Tipos de Contribución Aceptados

- 🐛 **Fixes**: Correcciones de bugs
- ✨ **Features**: Nuevas características
- 📚 **Docs**: Mejoras en documentación
- 🎨 **UI/UX**: Mejoras de interfaz
- ⚡ **Performance**: Optimizaciones
- 🔒 **Security**: Mejoras de seguridad

## ❌ No Aceptamos

- Cambios que rompan la compatibilidad sin discusión
- Código sin documentar
- Pull requests enormes sin explicación
- Cambios de dependencias mayor sin razón

## 📋 Checklist para Pull Request

Antes de hacer submit:
- [ ] El código funciona localmente
- [ ] Seguí los estándares de código
- [ ] Comenté las partes complejas
- [ ] Actualicé la documentación si es necesario
- [ ] No hay conflictos con main
- [ ] Los cambios son pequeños y enfocados

---

**¡Gracias por contribuir! 🎉**
