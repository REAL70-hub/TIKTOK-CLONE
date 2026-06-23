FROM node:18-alpine

WORKDIR /app

# Copia package.json
COPY package*.json ./

# Instala dependencias
RUN npm ci

# Copia el código
COPY . .

# Build de Next.js
RUN npm run build

# Expone puerto
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]