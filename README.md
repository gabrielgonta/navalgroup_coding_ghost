# FRONT-END PIONEERS’ CHALLENGE 2023

## Description
Ce projet est une application web React qui sert de tableau de bord pour visualiser et configurer une simulation de mobile. Il permet aux utilisateurs de surveiller et de contrôler divers paramètres liés à la simulation, de visualiser les détails des mobiles, de visualiser le mouvement des mobiles sur une carte et d'analyser des diagrammes de densité. De plus, il fournit un lecteur vidéo pour visualiser un flux de vidéo.

## Fonctionnalités
1. **Affichage de l'état de connexion au serveur :** Affiche si le serveur est connecté ou affiche un message d'erreur sinon.
2. **Paramètres de configuration :** Fournit des entrées pour configurer des paramètres tels que le rayon du cercle, le nombre de mobiles, le taux de rafraîchissement, le nombre de zones, le nombre de vidéos, etc.
3. **Section Détails des mobiles :** Affiche les détails d'un mobile sélectionné à partir des données de simulation.
4. **Représentation cartographique des mobiles :** Visualise le mouvement des mobiles sur une carte. Permet de zoomer et de dézoomer sur la carte. Permet de sélectionner des mobiles individuels pour obtenir des informations détaillées.
5. **Diagramme de densité :** Affiche un diagramme représentant la densité des mobiles dans différentes zones.
6. **Éléments interactifs :** Boutons pour mettre à jour les paramètres et basculer la simulation. Bouton pour mettre en pause et reprendre la simulation. Cases à cocher pour filtrer les mobiles en fonction de leur couleur et leur forme.
7. **Lecteur vidéo :** Permet d'afficher et de lire des vidéos'.

## Installation
1. Cloner le répertoire du projet :
```
git clone git@github.com:gabrielgonta/navalgroup_coding_ghost.git
```
2. Accéder au répertoire du projet :
```
cd navalgroup_coding_ghost
cd navalgroup
```
3. Démarrer votre serveur de développement :
```
docker compose up
```
4. Démarrer notre application :
```
npm start
```

5. Ouvrir l'application dans votre navigateur à l'adresse `http://localhost:3000`.

## Technologies Utilisées
- React
- JSX
- SVG
- CSS

## Structure des Fichiers
- **src/ :** Contient les composants React pour différentes sections de la simulation.
- **src/App.js :** Composant principal qui rend l'ensemble de l'application.
- **src/index.js :** Point d'entrée de l'application.
- **public/index.html :** Fichier HTML pour nos contacts.
- **package.json :** Fichier de configuration avec les dépendances du projet et les scripts.
- **README.md :** Documentation du projet.

## Utilisation
- En démarrant l'application, les utilisateurs peuvent interagir avec divers éléments pour configurer les paramètres de la simulation, afficher les données mobiles et contrôler la simulation.
- Les utilisateurs peuvent ajuster les paramètres, tels que le niveau de zoom, le rayon de l'environnement, le nombre de mobiles, le taux de rafraîchissement, etc., en utilisant les champs de saisie fournis.
- La représentation cartographique visualise le mouvement des mobiles, permettant aux utilisateurs de sélectionner des mobiles individuels pour obtenir des informations détaillées.
- Les diagrammes de densité fournissent des informations sur la répartition des mobiles dans différentes zones.
- Le lecteur vidéo permet aux utilisateurs de lire des vidéos envoyées par le serveur.

## Contributeurs
- [Gabriel Gonta](https://github.com/gabrielgonta)
- [Luis Fernandes](https://github.com/Luis06000) 

## Licence
Ce projet est sous licence [MIT License](LICENSE).
