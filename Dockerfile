# Étapes d'installation des dépendances
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./prisma prisma
COPY ./src src

# Exposer les ports utilisés par Next.js et Prisma Studio
EXPOSE 3000
EXPOSE 5555

# Démarrer le serveur en mode développement pour activer le hot reload et prisma studio
CMD ["sh", "-c", "npm run dev & npx prisma studio"]
