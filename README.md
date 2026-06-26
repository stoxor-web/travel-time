# TripPlanner - Planificateur de Voyages

Une application web moderne de planification de voyages construite avec React, TypeScript, Firebase et Tailwind CSS.

## 🌍 Caractéristiques

- ✅ **Authentification Firebase** - Google et Email/Password
- 📅 **Gestion des Voyages** - Créer, modifier, supprimer des voyages
- 💰 **Suivi du Budget** - Gérer les dépenses et le budget par voyage
- 📝 **Détails du Voyage** - Descriptions, destinations, dates
- 🎨 **Interface Moderne** - Design réactif avec Tailwind CSS
- ⚡ **Performance** - Construite avec Vite et React

## 🚀 Installation Rapide

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/trip-planner-app.git
cd trip-planner-app
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configurer Firebase

**Étape 1:** Créer un projet Firebase
- Allez sur [Firebase Console](https://console.firebase.google.com/)
- Cliquez sur "Créer un projet"
- Donnez un nom à votre projet (ex: "trip-planner")
- Acceptez les conditions et créez le projet

**Étape 2:** Activer l'authentification
- Dans Firebase Console, allez à "Authentication"
- Cliquez sur "Commencer"
- Activez les fournisseurs:
  - Email/Password
  - Google

**Étape 3:** Créer une base de données Firestore
- Allez à "Firestore Database"
- Cliquez sur "Créer une base de données"
- Choisissez "Mode test" (pour développement)
- Sélectionnez votre région

**Étape 4:** Récupérer vos credentials Firebase
- Allez aux Paramètres du Projet
- Dans "Vos applications", cliquez sur Web (</>)
- Copiez la configuration Firebase

**Étape 5:** Ajouter les credentials
```bash
# Ouvrez src/config/firebase.ts et remplacez:
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
}
```

### 4. Lancer l'application

```bash
npm run dev
```

L'application se lancera sur `http://localhost:3000`

## 📦 Structure du Projet

```
trip-planner-app/
├── src/
│   ├── config/
│   │   └── firebase.ts           # Configuration Firebase
│   ├── contexts/
│   │   └── AuthContext.tsx       # Contexte d'authentification
│   ├── pages/
│   │   ├── LoginPage.tsx         # Page de connexion
│   │   ├── DashboardPage.tsx     # Page d'accueil
│   │   ├── CreateTripPage.tsx    # Créer/modifier un voyage
│   │   └── TripDetailPage.tsx    # Détails du voyage
│   ├── types/
│   │   └── index.ts              # Types TypeScript
│   ├── App.tsx                   # Composant principal
│   ├── main.tsx                  # Point d'entrée
│   └── index.css                 # Styles globaux
├── index.html                    # HTML principal
├── package.json                  # Dépendances
├── tsconfig.json                 # Configuration TypeScript
├── vite.config.ts                # Configuration Vite
├── tailwind.config.js            # Configuration Tailwind
├── postcss.config.js             # Configuration PostCSS
└── .gitignore
```

## 🔐 Règles Firestore

Ajoutez ces règles dans Firestore pour sécuriser votre base de données:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Trips - Accès uniquement au propriétaire
    match /trips/{tripId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
    
    // Expenses - Accès uniquement si propriétaire du voyage
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🛠️ Commandes Disponibles

```bash
# Développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview

# Linting
npm run lint
```

## 📱 Déployer sur Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel
```

## 📱 Déployer sur Firebase Hosting

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Initialiser
firebase init hosting

# Build l'app
npm run build

# Déployer
firebase deploy
```

## 🎨 Customisation

### Changer les couleurs

Modifiez `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#VOTRE_COULEUR',
        600: '#VOTRE_COULEUR_FONCÉE',
      }
    }
  }
}
```

### Changer les fonts

Modifiez `tailwind.config.js` et `index.css`

## 🐛 Dépannage

**Problem:** "Firebase is not defined"
- Vérifiez que `src/config/firebase.ts` est correct
- Assurez-vous que les credentials sont valides

**Problem:** "Cannot sign in with Google"
- Vérifiez que Google est activé dans Firebase Authentication
- Vérifiez que votre domaine est autorisé dans Firebase

**Problem:** Les données ne se sauvegardent pas
- Vérifiez les règles Firestore
- Vérifiez que vous êtes connecté
- Vérifiez la console pour les erreurs

## 📄 Licence

MIT

## 🤝 Contributions

Les contributions sont les bienvenues! Créez une branche, faites vos changements et ouvrez une PR.

## 📞 Support

Pour l'aide avec Firebase, consultez la [documentation officielle](https://firebase.google.com/docs).

## 🔗 Liens Utiles

- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)

---

**Créé avec ❤️ en 2024**
