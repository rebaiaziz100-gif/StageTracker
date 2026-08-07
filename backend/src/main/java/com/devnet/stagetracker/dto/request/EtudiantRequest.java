package com.devnet.stagetracker.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EtudiantRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 50, message = "Le nom ne doit pas dépasser 50 caractères")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 50, message = "Le prénom ne doit pas dépasser 50 caractères")
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    @Size(max = 100, message = "L'email ne doit pas dépasser 100 caractères")
    private String email;

    // Optionnel : requis à la création, facultatif lors d'une mise à jour de profil
    @Size(min = 6, max = 100, message = "Le mot de passe doit contenir entre 6 et 100 caractères")
    private String motDePasse;

    @NotBlank(message = "La filière est obligatoire")
    @Size(max = 50, message = "La filière ne doit pas dépasser 50 caractères")
    private String filiere;

    @NotBlank(message = "Le niveau est obligatoire")
    @Size(max = 20, message = "Le niveau ne doit pas dépasser 20 caractères")
    private String niveau;

    // Optionnel : requis à la création, facultatif lors d'une mise à jour de profil
    private Integer universiteId;
}
