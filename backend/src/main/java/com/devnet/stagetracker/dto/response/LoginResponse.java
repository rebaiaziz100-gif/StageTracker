package com.devnet.stagetracker.dto.response;

public class LoginResponse {

    private Integer id;
    private String token;
    private String email;
    private String nom;
    private String prenom;
    private String role;

    public LoginResponse(Integer id, String token, String email, String nom, String prenom, String role) {
        this.id = id;
        this.token = token;
        this.email = email;
        this.nom = nom;
        this.prenom = prenom;
        this.role = role;
    }

    public Integer getId() { return id; }
    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getRole() { return role; }
}