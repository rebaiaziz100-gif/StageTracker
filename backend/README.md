# StageTracker

**StageTracker** est une API REST de gestion des stages permettant de centraliser les informations liées aux offres de stage, aux étudiants, aux encadrants et aux candidatures. Elle facilite le suivi des candidatures, l'affectation des stagiaires, le suivi des tâches et la validation des stages.

> Projet développé dans le cadre d'un stage d'été / PFE — ESPRIT.

## Fonctionnalités principales

- **Authentification JWT** avec gestion de rôles via héritage d'entités (`Utilisateur` → `Etudiant` / `Admin` / `Encadrant`)
- **Gestion des offres de stage** : création, consultation, fermeture automatique lorsque toutes les places sont pourvues
- **Gestion des candidatures** : dépôt, acceptation (avec vérification de disponibilité et création automatique du stage), refus
- **Gestion des stages** : suivi de l'état (`EN_COURS` / `TERMINE` / `VALIDE`), spécialisation Stage d'été / PFE
- **Gestion des tâches** : attribution et suivi par l'encadrant
- **Gestion des entretiens** : planification entre candidature et encadrant
- **Encadrants** : distinction entre encadrant universitaire et encadrant d'entreprise

## Stack technique

| Composant | Technologie |
|---|---|
| Backend | Java 17, Spring Boot 4 |
| Sécurité | Spring Security, JWT (jjwt) |
| Persistance | Spring Data JPA / Hibernate |
| Base de données | MySQL |
| Build | Maven |
| Mapping objet | ModelMapper |

## Architecture

Architecture en couches classique :

```
Controller  →  Service (interface + impl)  →  Repository  →  Base de données
```

```
com.devnet.stagetracker/
├── config/          # Configuration Spring (CORS, sécurité)
├── controllers/      # Contrôleurs REST
├── dto/
│   ├── request/      # Objets reçus du client
│   └── response/     # Objets renvoyés au client (sans données sensibles)
├── entities/         # Entités JPA
├── repositories/      # Interfaces Spring Data JPA
├── security/         # JWT (génération, filtre, UserDetailsService)
├── services/
│   ├── interfaces/
│   └── impl/
└── StageTrackerApplication.java
```

### Modèle de données — hiérarchies d'héritage

```
Utilisateur (abstract)
 ├── Etudiant
 ├── Admin
 └── Encadrant (abstract)
      ├── EncadrantUniversitaire
      └── EncadrantEntreprise

Stage (abstract)
 ├── StageEte
 └── StagePFE
```

Stratégie d'héritage JPA : `InheritanceType.JOINED` — chaque sous-classe a sa propre table, reliée par clé primaire partagée.

## Endpoints principaux

| Méthode | Endpoint | Description | Accès |
|---|---|---|---|
| POST | `/api/auth/login` | Authentification, retourne un token JWT | Public |
| GET | `/api/offres` | Liste des offres de stage | Public |
| POST | `/api/offres` | Créer une offre | Authentifié |
| GET / POST | `/api/candidatures` | Consulter / déposer une candidature | Authentifié |
| PUT | `/api/candidatures/{id}/accepter` | Accepter une candidature (crée le stage) | Authentifié |
| GET / PUT | `/api/stages` | Consulter / mettre à jour un stage | Authentifié |
| PUT | `/api/stages/{id}/valider` | Valider un stage terminé | Authentifié |
| GET / POST | `/api/taches` | Consulter / créer une tâche | Authentifié |
| GET / POST | `/api/entretiens` | Consulter / planifier un entretien | Authentifié |
| GET / POST | `/api/etudiants` | Gestion des étudiants | Authentifié |
| GET / POST | `/api/universites` | Gestion des universités | Authentifié |

## Installation et démarrage

### Prérequis

- JDK 17+
- Maven
- MySQL (ou XAMPP)

### Configuration

1. Cloner le dépôt :
```bash
git clone https://github.com/rebaiaziz100-gif/StageTracker.git
```

2. Créer la base de données MySQL :
```sql
CREATE DATABASE stagetracker;
```

3. Créer un fichier `src/main/resources/application.properties` (non versionné) :
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

4. Lancer l'application :
```bash
mvn spring-boot:run
```

L'API est alors accessible sur `http://localhost:8081`.

## Sécurité

- Mots de passe hashés avec **BCrypt**
- Authentification **stateless** via token **JWT**
- Le rôle de l'utilisateur (`ETUDIANT`, `ADMIN`, `ENCADRANT`...) est déterminé automatiquement via le type concret de l'entité authentifiée

## Auteur

Aziz Rebai — ESPRIT

## Licence

Projet académique — usage personnel / pédagogique.
