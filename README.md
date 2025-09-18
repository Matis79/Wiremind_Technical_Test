# WireMind Case Study — Matis Roux

Application **Angular** (TypeScript) monopage, avec un **compteur interactif** dont la **vélocité (/s)** est contrôlable .

---

## ✨ Fonctionnalités

- Compteur **continu** dont la vitesse est contrôlable (peut être **négative**)
- **Champ texte** pour définir la vitesse
- **Boutons −1 / +1** pour ajuster par pas de `1`
- **Bouton Snapshot** : enregistre **Date/heure**, **valeur du compteur**, **vélocité**
- **Tableau** des snapshots de la session (3 colonnes)
- **Bouton Start/Pause** :
  - En mode **Start**, la vélocité est automatiquement mise à `1`
  - En mode **Pause**, la vélocité est automatiquement mise à `0`
- **Target Score** : objectif à atteindre
- **Leaderboard** : affiche les 5 tentatives les plus proches du *Target Score*


> Exemple : si la vélocité = `2/s`, le compteur passe de `0` à `10` en ~`5 s`.

---

## 🧰 Prérequis

- **Node.js ≥ 18** (LTS recommandé) — [nodejs.org](https://nodejs.org/)
- **npm ≥ 9** (installé avec Node)
- *(Optionnel)* **Angular CLI** :
  ```bash
  npm i -g @angular/cli
  ```

---

## 🚀 Installation & Lancement

### 1. Installation

1. Installer Node.js et npm.
2. Cloner ce dépôt :
   ```bash
   git clone <url-du-repo>
   ```
3. Aller dans le dossier client :
   ```bash
   cd client
   ```
4. Installer les dépendances :
   ```bash
   npm ci
   ```

### 2. Lancement en développement

Dans le dossier `client` :

```bash
npm start
```
ou :

```bash
ng serve -o --port 4200
```

Puis ouvrir [http://localhost:4200](http://localhost:4200).

---