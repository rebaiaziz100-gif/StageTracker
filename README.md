# StageTracker

**StageTracker** est une application de gestion des stages permettant de centraliser les informations liées aux offres de stage, aux étudiants, aux encadrants et aux candidatures. Elle facilite le suivi des candidatures, l'affectation des stagiaires, le suivi des tâches et la validation des stages.

> Projet développé dans le cadre d'un stage d'été / PFE — ESPRIT.

Ce dépôt regroupe le backend et le frontend dans un seul repository :

```
StageTracker/
├── backend/     # API REST — Java 17, Spring Boot 4, Spring Security, JPA/Hibernate, MySQL
└── frontend/    # Interface web — React 19, Vite, React Router, axios
```

## Backend (`backend/`)

API REST fournissant l'authentification JWT, la gestion des offres de stage, des candidatures (dépôt, acceptation avec création automatique du stage, refus), des stages (suivi d'état, spécialisation Été / PFE), des tâches et des entretiens.

### Prérequis

- JDK 17+
- Maven
- MySQL (ou XAMPP)

### Configuration et lancement

1. Créer la base de données MySQL :
```sql
CREATE DATABASE stagetracker;
```

2. Créer le fichier `backend/src/main/resources/application.properties` (non versionné) :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/stagetracker
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=validate
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

jwt.secret=<votre_cle_secrete_base64>
jwt.expiration=36000000

server.port=8081
```

3. Lancer l'application :
```bash
cd backend
mvn spring-boot:run
```

L'API est alors accessible sur `http://localhost:8081/api`.

Voir [backend/README.md](backend/README.md) pour le détail de l'architecture, du modèle de données et des endpoints.

## Frontend (`frontend/`)

Interface web React (Vite) consommant l'API backend : authentification, tableau de bord, consultation et candidature aux offres, gestion des candidatures/stages/tâches selon le rôle de l'utilisateur (ETUDIANT, ADMIN, ENCADRANTENTREPRISE, ENCADRANTUNIVERSITAIRE).

### Prérequis

- Node.js 18+

### Configuration et lancement

```bash
cd frontend
npm install
npm run dev
```

L'application est alors accessible sur `http://localhost:5173`. Elle attend le backend sur `http://localhost:8081/api` (voir `src/api/axiosClient.js`).

## Sécurité

- Mots de passe hashés avec **BCrypt**
- Authentification **stateless** via token **JWT**
- Le rôle de l'utilisateur (`ETUDIANT`, `ADMIN`, `ENCADRANTENTREPRISE`, `ENCADRANTUNIVERSITAIRE`) est déterminé automatiquement via le type concret de l'entité authentifiée

## Auteur

Aziz Rebai — ESPRIT

## Licence

Projet académique — usage personnel / pédagogique.
