FROM node:18-alpine

WORKDIR /app

# Copia package.json
COPY package*.json ./

# Instala dependencias
RUN npm ci

# Copia el código
COPY . .

# Instala Prisma
RUN npx prisma generate

# Expone puerto
EXPOSE 5000

# Comando para iniciar
CMD ["npm", "run", "dev"]