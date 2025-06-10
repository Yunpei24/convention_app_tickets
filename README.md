# Application d'Enregistrement avec QR Code

Une application web responsive permettant l'enregistrement de personnes avec génération de QR codes uniques et système de scan en temps réel.

## 🚀 Fonctionnalités

- **Enregistrement de personnes** : Formulaire complet avec validation
- **Génération de QR codes** : QR code unique pour chaque personne
- **Tickets imprimables** : Génération de tickets PDF avec QR code
- **Scanner en temps réel** : Scan de QR codes via caméra mobile/desktop
- **Liste des personnes** : Visualisation et export des données
- **Interface responsive** : Compatible mobile et desktop
- **Base de données PostgreSQL** : Stockage sécurisé des données

## 🛠️ Technologies Utilisées

- **Frontend** : Next.js 15, React, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes
- **Base de données** : PostgreSQL avec Prisma ORM
- **QR Code** : react-qr-code, html5-qrcode
- **PDF** : jsPDF
- **Validation** : Zod
- **UI Components** : shadcn/ui
- **Déploiement** : Docker, Docker Compose

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- PostgreSQL (ou Docker pour l'option containerisée)

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd registration-qr-app
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

### 3. Configuration de la base de données

#### Option A : Avec Docker (Recommandé)

```bash
# Lancer PostgreSQL avec Docker
docker run --name postgres-registration \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=registration_app \
  -p 5432:5432 \
  -d postgres:14
```

#### Option B : Installation locale de PostgreSQL

**Sur Ubuntu/Debian :**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Créer la base de données
sudo -u postgres createdb registration_app
```

**Sur macOS :**
```bash
# Avec Homebrew
brew install postgresql
brew services start postgresql

# Créer la base de données
createdb registration_app
```

**Sur Windows :**
1. Télécharger PostgreSQL depuis https://www.postgresql.org/download/windows/
2. Installer et suivre l'assistant
3. Créer une base de données nommée `registration_app`

#### Option C : Service cloud (Neon, Supabase, etc.)

1. Créer un compte sur [Neon](https://neon.tech) ou [Supabase](https://supabase.com)
2. Créer une nouvelle base de données
3. Copier l'URL de connexion

### 4. Configuration des variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
# Base de données
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/registration_app"

# Pour un service cloud, remplacer par votre URL
# DATABASE_URL="postgresql://username:password@host:port/database"
```

### 5. Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev --name init

# (Optionnel) Ajouter des données de test
npm run seed
```

### 6. Lancer l'application

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur http://localhost:3000

## 📁 Structure du Projet

```
registration-qr-app/
├── app/                          # Pages et API Routes (Next.js App Router)
│   ├── api/
│   │   ├── register/route.ts     # API d'enregistrement
│   │   ├── verify/route.ts       # API de vérification QR
│   │   └── persons/route.ts      # API liste des personnes
│   ├── register/page.tsx         # Page d'enregistrement
│   ├── scanner/page.tsx          # Page de scan
│   ├── persons/page.tsx          # Page liste des personnes
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Page d'accueil
├── components/                   # Composants React
│   ├── ui/                       # Composants UI (shadcn)
│   ├── registration-form.tsx     # Formulaire d'enregistrement
│   ├── ticket-preview.tsx        # Aperçu et génération de ticket
│   ├── qr-scanner.tsx            # Scanner QR code
│   └── persons-list.tsx          # Liste des personnes
├── lib/                          # Utilitaires
│   ├── db.ts                     # Configuration Prisma
│   └── utils.ts                  # Fonctions utilitaires
├── prisma/                       # Configuration base de données
│   ├── schema.prisma             # Schéma de la base
│   └── migrations/               # Migrations
├── scripts/                      # Scripts utilitaires
│   ├── seed.ts                   # Script de seeding
│   └── init-db.ts                # Script d'initialisation
├── docker-compose.yml            # Configuration Docker
├── Dockerfile                    # Image Docker
└── README.md                     # Documentation
```

## 🔌 API Endpoints

### POST /api/register
Enregistre une nouvelle personne et génère un QR code.

**Body :**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean.dupont@exemple.fr",
  "phone": "0612345678"
}
```

**Response :**
```json
{
  "person": {
    "id": "uuid",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@exemple.fr",
    "phone": "0612345678",
    "qrCodeData": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "qrCode": "uuid"
}
```

### GET /api/verify?code={qr_code}
Vérifie un QR code et retourne les informations de la personne.

**Response (succès) :**
```json
{
  "success": true,
  "message": "Personne trouvée",
  "person": {
    "id": "uuid",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@exemple.fr",
    "phone": "0612345678",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (erreur) :**
```json
{
  "success": false,
  "message": "Personne non trouvée"
}
```

### GET /api/persons
Récupère la liste de toutes les personnes enregistrées.

**Response :**
```json
{
  "success": true,
  "persons": [
    {
      "id": "uuid",
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@exemple.fr",
      "phone": "0612345678",
      "qrCodeData": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

## 🐳 Déploiement avec Docker

### Déploiement complet (App + Base de données)

```bash
# Construire et lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

### Déploiement de l'app uniquement

```bash
# Construire l'image
docker build -t registration-qr-app .

# Lancer le container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:port/db" \
  registration-qr-app
```

## 🔄 Intégration dans une autre application

### 1. Intégration via API REST

L'application expose des API REST que vous pouvez utiliser pour l'intégrer dans une autre application :

#### Enregistrement d'une personne
```javascript
// Exemple avec fetch
const response = await fetch('https://votre-domaine.com/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@exemple.fr',
    phone: '0612345678',
  }),
});

const data = await response.json();
// data.qrCode contient le QR code à afficher
```

#### Vérification d'un QR code
```javascript
// Exemple avec fetch
const code = 'qr-code-data';
const response = await fetch(`https://votre-domaine.com/api/verify?code=${encodeURIComponent(code)}`);
const data = await response.json();

if (data.success) {
  // Personne trouvée
  console.log(data.person);
} else {
  // Personne non trouvée
  console.log(data.message);
}
```

#### Récupération de la liste des personnes
```javascript
// Exemple avec fetch
const response = await fetch('https://votre-domaine.com/api/persons');
const data = await response.json();

if (data.success) {
  // Liste des personnes
  console.log(data.persons);
}
```

### 2. Intégration via iframe

Vous pouvez intégrer les pages de l'application dans une autre application via des iframes :

```html
<!-- Intégration du formulaire d'enregistrement -->
<iframe src="https://votre-domaine.com/register" width="100%" height="600px" frameborder="0"></iframe>

<!-- Intégration du scanner QR -->
<iframe src="https://votre-domaine.com/scanner" width="100%" height="500px" frameborder="0"></iframe>

<!-- Intégration de la liste des personnes -->
<iframe src="https://votre-domaine.com/persons" width="100%" height="700px" frameborder="0"></iframe>
```

### 3. Intégration comme microservice

Vous pouvez déployer l'application comme un microservice dans votre architecture :

1. Déployez l'application avec Docker (voir section suivante)
2. Configurez un reverse proxy (Nginx, Traefik) pour router les requêtes vers le microservice
3. Utilisez les API REST pour communiquer avec le microservice

## 🐳 Déploiement avec Docker (Détaillé)

### 1. Création de l'image Docker

Le projet inclut déjà un `Dockerfile` optimisé pour Next.js. Pour construire l'image :

```bash
# Construire l'image
docker build -t registration-qr-app:latest .
```

### 2. Exécution de l'image Docker

```bash
# Exécuter le conteneur
docker run -d \
  --name registration-app \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:password@host:port/db" \
  -e NODE_ENV=production \
  registration-qr-app:latest
```

### 3. Déploiement avec Docker Compose

Le fichier `docker-compose.yml` inclut la configuration pour déployer l'application avec une base de données PostgreSQL :

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f app
```

### 4. Configuration des variables d'environnement Docker

Vous pouvez configurer les variables d'environnement dans le fichier `docker-compose.yml` ou lors de l'exécution du conteneur :

```yaml
# Extrait du docker-compose.yml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/registration_app
      - NODE_ENV=production
      # Ajoutez d'autres variables d'environnement ici
```

### 5. Déploiement sur un registre Docker

Pour déployer votre image sur un registre Docker (comme Docker Hub ou GitHub Container Registry) :

```bash
# Se connecter au registre
docker login

# Tagger l'image
docker tag registration-qr-app:latest username/registration-qr-app:latest

# Pousser l'image
docker push username/registration-qr-app:latest
```

### 6. Déploiement sur Kubernetes

Si vous utilisez Kubernetes, vous pouvez créer un fichier de déploiement `deployment.yaml` :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: registration-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: registration-app
  template:
    metadata:
      labels:
        app: registration-app
    spec:
      containers:
      - name: registration-app
        image: username/registration-qr-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: url
        - name: NODE_ENV
          value: production
---
apiVersion: v1
kind: Service
metadata:
  name: registration-app-service
spec:
  selector:
    app: registration-app
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

Puis appliquer la configuration :

```bash
kubectl apply -f deployment.yaml
```

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev                    # Lancer en mode développement
npm run build                  # Construire pour la production
npm run start                  # Lancer en mode production

# Base de données
npx prisma studio             # Interface graphique pour la DB
npx prisma migrate dev        # Créer une nouvelle migration
npx prisma migrate reset      # Reset de la base de données
npx prisma db push           # Pousser le schéma sans migration
npm run seed                 # Ajouter des données de test

# Docker
docker-compose up -d         # Lancer tous les services
docker-compose down          # Arrêter tous les services
docker-compose logs -f app   # Voir les logs de l'app
```

## 🔒 Sécurité

- Validation des données côté client et serveur avec Zod
- Sanitisation des entrées utilisateur
- Gestion appropriée des erreurs
- UUID sécurisés pour les identifiants
- CORS configuré automatiquement par Next.js

## 📱 Utilisation

### 1. Enregistrer une personne
1. Aller sur `/register`
2. Remplir le formulaire
3. Valider l'enregistrement
4. Télécharger ou imprimer le ticket avec QR code

### 2. Scanner un QR code
1. Aller sur `/scanner`
2. Autoriser l'accès à la caméra
3. Scanner le QR code
4. Voir les informations de la personne

### 3. Consulter la liste des personnes
1. Aller sur `/persons`
2. Voir toutes les personnes enregistrées
3. Cliquer sur "Voir QR Code" pour afficher le QR code
4. Utiliser "Exporter CSV" pour télécharger les données

## 🐛 Dépannage

### Problème de connexion à la base de données
```bash
# Vérifier que PostgreSQL est lancé
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Tester la connexion
psql -h localhost -U postgres -d registration_app
```

### Problème de permissions caméra
- Vérifier que l'application est servie en HTTPS en production
- Autoriser l'accès à la caméra dans les paramètres du navigateur

### Erreur de build Docker
```bash
# Nettoyer les images Docker
docker system prune -a

# Reconstruire sans cache
docker-compose build --no-cache
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Vérifier la documentation ci-dessus
2. Consulter les issues GitHub existantes
3. Créer une nouvelle issue si nécessaire

## 🔄 Roadmap

- [ ] Authentification et autorisation
- [ ] Tableau de bord administrateur
- [ ] Export des données (CSV, Excel)
- [ ] Notifications en temps réel
- [ ] API REST complète
- [ ] Tests automatisés
- [ ] Monitoring et logs
