# phpSquad - Jeu de Sécurité Informatique

Un jeu éducatif interactif développé avec **Symfony 7.4** et **Phaser 3**, où vous combattez des géants technologiques à travers des énigmes et des batailles stratégiques.

## Table des matières

- [Défis](#defis)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Gameplay](#gameplay)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Contributeurs](#contributeurs)

## Défis

### NUIT DE L'INFO
Afin de lutter contre les GAFAS, on ira directement leur récuperer nos données à coup de virus et d'exploit ! Profitez de ce mini-jeu pour vous défouler sur les boss tels que Zuckerberg ou encore Musk. Et vive la rebellion !

### ft_rube_goldberg
Cliquez sur l'onglet secret dans le header et decouvrez notre machine de Goldberg et son résultat !

### Le défi: L'ergonomie : simplifier pour mieux vivre.
Rendez-vous dans l'onglet frustrant input pour découvrir notre input anti-ergonomique.

### Le formulaire de la Gloire
Dirigez-vous vers la page de contact et preparez-vous à communiquer avec les étoiles (config suffisante recommandée)

### On veut du gros pixel !
Notre systeme de connexion et notre jeu sont OLD-SCHOOL !

### STL Vision
Découvrez notre système de Visionnage 3D

## Fonctionnalités

### Système d'Authentification
- **Combo de touches** : Entrez une combinaison de touches (flèches + U, I, J, K) pour vous connecter
- **Animation Ken Shoryuken** : Victoire épique avec GIF Ken en 1.6s puis redirection
- **Gestion de Session** : Authentification basée sur les sessions avec CustomAuthenticator

### Jeu Principal (DataGuardian)
- **Exploration en grid** : Naviguez dans un monde en cases 32x32
- **Combat au tour par tour** : Système de pierre feuille ciseau (Firewall, Virus, Exploit)
- **Ennemis intelligents** : 
  - Détection d'aggro à 7 cases dans leur direction de regard
  - Patrouille directionnelle
  - Ligne de vue avec blocage par murs
  - Boss spécialisés
- **Système de données** : Gestion des PV du joueur = données volées
- **Coffres** : Bonus de santé et boosters d'attaque

### Machine de Rube Goldberg (Secret)
Une machine complète avec **12 étapes interactives** :

1. **Tirez la corde** - Drag and drop
2. **Démarrer le système** - Bouton activation
3. **Propulsion de balle** - Animation automatique
4. **Synchronisation de gears** - Gears CSS tournants
5. **Cascade de dominos** - 10 dominos qui tombent
6. **Code laser** - Saisissez "42424"
7. **Analyse quantique** - Log de traitement
8. **Séquence sonore** - Jeu Simon avec 4 boutons
9. **Labyrinthe** - Navigation avec flèches (300x300)
10. **Équation du chaos** - Résolvez (7×8)+(3²-4)=61
11. **Réflexes ultimes** - Cliquez 5 cibles
12. **Deuxième corde** - Tirez à nouveau

### Interface Web
- Header responsive avec liens de navigation
- Animations smooth avec transitions 3D
- Design cyberpunk avec thème neon (#0ff, #0f0, #ff0)
- Support mobile et desktop

## Installation

### Prérequis
- PHP 8.5+
- Composer
- Node.js (pour les assets)
- MariaDB 12.1+
- Symfony 7.4

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/wassimztn/phpSquad.git
cd phpSquad
```

2. **Installer les dépendances PHP**
```bash
composer install
```

3. **Installer les dépendances JavaScript**
```bash
npm install
```

4. **Configurer l'environnement**
```bash
cp .env.local.example .env.local
# Éditer .env.local avec vos paramètres
```

5. **Créer la base de données**
```bash
symfony console doctrine:database:create
symfony console doctrine:migrations:migrate
```

6. **Lancer le serveur**
```bash
symfony server:start
```

L'application est accessible sur `http://localhost:8000`

## Configuration

### Variables d'Environnement (.env.local)
```env
DATABASE_URL="mysql://user:password@127.0.0.1:3306/phpSquadBDD"
MAILER_DSN="smtp://localhost"
APP_SECRET="your_secret_key"
```

### Structure de la Base de Données
- **Table users** : stockage des utilisateurs avec email et combo
- **Migrations** : Version20251204190928.php, Version20251204224826.php, Version20251204231633.php, Version20251205023507.php

## Utilisation

### Connexion
1. Allez sur `/login`
2. Entrez votre email
3. Effectuez le combo de touches :
   - Flèche haut/bas/gauche/droite
   - Touches U, I, J, K
   - Max 20 touches
   - Ken donne le signal de victoire après 1.6s
   - Redirection automatique après 1.9s

### Jouer au Jeu
1. Cliquez sur "Jouer" depuis l'accueil
2. Utilisez les **flèches** pour vous déplacer
3. **Pressez E** pour ouvrir les menus
4. Combattez les ennemis avec vos 3 armes cyber

### Machine de Rube Goldberg
1. Cliquez sur "Secret" dans le header
2. Tirez la première corde
3. Complétez les 12 étapes progressivement
4. Découvrez le message final

## Gameplay

### Système de Combat
```
Firewall > Virus > Exploit > Firewall (cycle)
```
- Chaque victoire inflige 20 dégâts (x1.5 avec boost)
- Chaque défaite coûte 20 données
- 3 vies = 3 défaites

### Ennemis

| Nom | Couleur | Santé | Spécial |
|-----|---------|-------|---------|
| Google Bot | Bleu | 40-60 | Standard |
| Apple Tracker | Noir | 40-60 | Standard |
| Meta Spy | Bleu | 40-60 | Standard |
| Amazon Crawler | Orange | 40-60 | Standard |
| MS Telemetry | Vert | 40-60 | Standard |
| BOSS | Rouge | 100+ | Unique |

### Système d'Aggro
- Distance de détection : 7 cases
- Direction de regard : exacte (pas de tolérance)
- Blocage par murs
- Message d'alerte : "${enemyName} vous attaque !"

## Architecture

### Structure du Projet
```
phpSquad/
├── src/
│   ├── Controller/
│   │   ├── MainController.php       (Routes /main, /secret)
│   │   ├── AuthController.php       (Authentification)
│   │   ├── GameController.php       (Jeu DataGuardian)
│   │   └── ThreeDController.php
│   ├── Entity/
│   │   └── User.php                 (Entité utilisateur)
│   ├── Repository/
│   │   └── UserRepository.php
│   └── Security/
│       ├── CustomAuthenticator.php  (Session-based auth)
│       └── LoginFormAuthenticator.php (Entry point)
├── templates/
│   ├── main/
│   │   ├── index.html.twig          (Accueil)
│   │   ├── secret.html.twig         (Machine Rube Goldberg)
│   │   └── contact.html.twig
│   ├── auth/
│   │   ├── login.html.twig          (Connexion combo)
│   │   └── register.html.twig       (Inscription)
│   └── inc/
│       └── header.html.twig         (Navigation)
├── assets/
│   ├── game/
│   │   └── Game.js                  (Logique Phaser)
│   └── styles/
│       ├── app.css                  (Styles généraux)
│       ├── home.css                 (Page d'accueil)
│       ├── contact.css              (Formulaire)
│       └── frustrant.css            (Page frustration)
├── config/
│   ├── routes.yaml
│   ├── services.yaml
│   └── packages/
│       ├── security.yaml            (Configuration auth)
│       └── ...
├── public/
│   └── index.php                    (Point d'entrée)
└── migrations/                      (BD migrations)
```

### Fichiers Clés

**Authentification:**
- `src/Security/CustomAuthenticator.php` - Gère les sessions utilisateur
- `src/Security/LoginFormAuthenticator.php` - Point d'entrée pour redirect login
- `templates/auth/login.html.twig` - Écran de combo

**Jeu:**
- `templates/game/index.html.twig` - Scène principale avec système d'aggro
- `templates/main/secret.html.twig` - Machine Rube Goldberg (1289 lignes)

**Routes:**
- `/main` - Accueil
- `/login` - Connexion
- `/register` - Inscription
- `/game/dataguardian` - Jeu principal
- `/secret` - Machine Rube Goldberg
- `/3d` - Visualisation 3D
- `/contact` - Formulaire contact

## Technologies

### Backend
- **Symfony 7.4.0** - Framework PHP
- **PHP 8.5.0** - Langage
- **Doctrine** - ORM
- **MariaDB 12.1** - Base de données

### Frontend
- **Phaser 3** - Framework jeu 2D
- **Twig** - Moteur de templates
- **CSS 3** - Animations 3D (rotateY, slideIn, slideOut)
- **JavaScript ES6** - Logique client
- **HTML 5** - Markup

### Sécurité
- **CSRF Protection** - Tokens CSRF
- **Session-based Auth** - CustomAuthenticator
- **Password Hashing** - bcrypt (Symfony)

### Performance
- **Asset Mapper** - Gestion des assets
- **Turbo** - Navigation rapide (désactivé pour le jeu)
- **Particle System** - Optimisé (10 particules max)

## Fonctionnalités Avancées

### Transitions Animées
```css
@keyframes slideInFromRight {
    0% { transform: rotateY(90deg) translateX(100px); opacity: 0; }
    100% { transform: rotateY(0) translateX(0); opacity: 1; }
}
```

### Gestion d'État Complexe
- Système de steps numérotés (0-11)
- Transitions avec overlay et connecting-lines
- Révélation progressive du contenu

### Système de Vision des Ennemis
```javascript
- Distance Chebyshev: max(|dx|, |dy|) ≤ 7
- Direction exacte: dx === 0 ou dy === 0
- Ligne de vue: pas de murs entre ennemi et joueur
```

## Déploiement

### Docker (optionnel)
```bash
docker-compose up -d
docker-compose exec app symfony console doctrine:migrations:migrate
```

### Production
```bash
symfony console doctrine:migrations:migrate --env=prod
symfony server:start --env=prod --port=80
```

## Notes de Développement

### Performance Optimisation
- Particules réduites (30 → 0 cascade, 100 → 10 final)
- Animations efficaces (CSS 3D)
- Pas d'événements bulle inutiles
- Destruction rapide des éléments DOM

### Problèmes Résolus
- Animation Ken ne se déplace plus
- Scrollbar pendant screen shake supprimée
- Aggro bizarre des ennemis (distance + direction exacte)
- Labyrinthe responsive
- Header aligné correctement

## Support

Pour toute question ou bug, veuillez :
1. Vérifier que vous utilisez PHP 8.5+ et Symfony 7.4+
2. Vérifier la connexion MariaDB
3. Réinitialiser les migrations : `symfony console doctrine:migrations:migrate --no-interaction`

## Contributeurs

- **Marius Wartel** - Développeur principal
- **Team phpSquad** - NuitInfo 2025

## Licence

Ce projet est développé pour la NuitInfo 2025.

---

**Dernière mise à jour:** 5 Décembre 2025
