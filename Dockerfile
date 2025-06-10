# Utilise une image Node.js 18 Alpine comme base pour toutes les étapes
FROM node:18-alpine AS base

# ==================================================
# ÉTAPE 1 : Installation des dépendances
# ==================================================
FROM base AS deps
WORKDIR /app

# Copie des fichiers de verrouillage des dépendances
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Installation des dépendances en fonction du gestionnaire de paquets détecté
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then \
    yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ==================================================
# ÉTAPE 2 : Construction de l'application
# ==================================================
FROM base AS builder
WORKDIR /app

# Copie des dépendances installées depuis l'étape précédente
COPY --from=deps /app/node_modules ./node_modules

# Copie de l'ensemble du code source
COPY . .

# Désactive la télémétrie Next.js pour la construction
ENV NEXT_TELEMETRY_DISABLED 1

# Génère le client Prisma
RUN npx prisma generate

# Construit l'application Next.js
RUN yarn build

# ==================================================
# ÉTAPE 3 : Image finale de production
# ==================================================
FROM base AS runner
WORKDIR /app

# Configure les variables d'environnement
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Installe OpenSSL 1.1 (requis par Prisma)
RUN apk add --no-cache openssl1.1-compat

# Crée un groupe et un utilisateur dédiés pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copie les ressources statiques
COPY --from=builder /app/public ./public

# Prépare le répertoire .next avec les bonnes permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copie l'application construite en préservant les permissions
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copie les fichiers nécessaires pour Prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Passe à l'utilisateur non-privilégié
USER nextjs

# Exposition du port et configuration
EXPOSE 3000
ENV PORT 3000

# Commande de démarrage : 
# 1. Applique les migrations de base de données
# 2. Démarre le serveur Next.js
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]