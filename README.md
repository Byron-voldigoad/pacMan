*Pac-Man Game*
    Ce projet est une implémentation du célèbre jeu Pac-Man en utilisant une architecture MVC (Modèle-Vue-Contrôleur) pour organiser le code. L'objectif est de maintenir une séparation claire entre les données, la logique de contrôle et l'interface utilisateur.

Structure du Projet : 
                        Pac-Man/
                        │
                        │
                        ├── audio/
                        │   └── contient l'ensemble des audio
                        │
                        ├── css/
                        │   └── styles.css
                        │
                        │
                        ├── img/
                        │   └── contient l'ensemble des images
                        │
                        ├── js/   
                        │   ├── controllers/
                        │   │   ├── pacmanController.js
                        │   │   ├── fantomeController.js
                        │   │
                        │   ├── models/
                        │   │   ├── labyrinthModel.js
                        │   │   ├── pacmanModel.js
                        │   │   └── fantomesModel.js
                        │   │
                        │   ├── vues/
                        │   │   ├── labyrinthVue.js
                        │   │   ├── pacmanVue.js
                        │   │   └──  fantomeVue.js
                        │   │
                        │   └──app.js
                        │
                        │
                        ├── index.html
                        ├── Menu.html
                        └── README.md

**Rôles des Dossiers et Fichiers
    1. Dossier controllers/
        Contient la logique qui relie les modèles et les vues en contrôlant le flux des données.

        pacmanController.js
        Contrôle les déplacements de Pac-Man, les interactions avec les Pac-Gommes et les collisions avec les fantômes.

        fantomeController.js
        Gère le comportement des fantômes, y compris leur déplacement aléatoire ou stratégique.

    2. Dossier models/
        Stocke les données et la logique métier.

        labyrinthModel.js
        Contient la structure du labyrinthe (une matrice 2D), ainsi que les informations sur les zones spéciales.

        pacmanModel.js
        Définit les propriétés de Pac-Man (position, direction, état).

        fantomesModel.js
        Stocke les informations sur les fantômes (positions, états, types).


    3. Dossier vues/
        Gère tout ce qui concerne l'affichage dans le canvas ou l'interface utilisateur.

        labyrinthVue.js
        Dessine le labyrinthe et les Pac-Gommes sur le canvas.

        pacmanVue.js
        Gère l'affichage de Pac-Man et ses animations (bouche, déplacements).

        fantomeVue.js
        Dessine les fantômes sur le canvas.

    4. Dossiers audio/ et img/
        audio/ : Contient les fichiers audio utilisés dans le jeu, tels que les sons des Pac-Gommes et la musique de fond.
        img/ : Contient les images utilisées pour Pac-Man, les fantômes, et les bonus comme la cerise.

    5. Fichiers principaux
        index.html
        Point d'entrée de l'application. Contient la structure HTML et le canvas pour le jeu.

        styles.css
        Définit le style général du jeu, y compris les menus et l'apparence extérieure.

        app.js
        Initialise le jeu, charge les éléments nécessaires et démarre les contrôleurs.

**Comment lancer le jeu ?
    Prérequis
        Assurez-vous d'avoir Visual Studio Code (ou tout autre éditeur de code avec Live Server) installé sur votre machine.


    Ouvrez Visual Studio Code.
        Accédez à l'onglet Extensions (icône des blocs ou Ctrl+Shift+X).
        Recherchez Live Server et cliquez sur Installer.
        
    Démarrez Live Server :

        Faites un clic droit sur le fichier index.html dans l'explorateur de fichiers de Visual Studio Code.
        Sélectionnez "Open with Live Server".
    Une nouvelle fenêtre de votre navigateur s'ouvrira automatiquement à l'adresse locale (par exemple, http://127.0.0.1:5500).
    Jouez au jeu :

        Utilisez les touches de direction pour déplacer Pac-Man et essayez de manger toutes les Pac-Gommes tout en évitant les fantômes.

