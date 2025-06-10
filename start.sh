#!/bin/sh

# Attendre que la base de données soit prête
echo "Waiting for database to be ready..."
npx prisma migrate deploy

# Démarrer l'application
echo "Starting application..."
node server.js