package com.devnet.stagetracker.controllers;

import com.devnet.stagetracker.dto.request.LoginRequest;
import com.devnet.stagetracker.dto.response.LoginResponse;
import com.devnet.stagetracker.entities.Utilisateur;
import com.devnet.stagetracker.exception.UnauthorizedException;
import com.devnet.stagetracker.repositories.UtilisateurRepository;
import com.devnet.stagetracker.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {

        Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(loginRequest.getEmail());

        if (utilisateurOpt.isEmpty()) {
            throw new UnauthorizedException("Identifiants invalides");
        }

        Utilisateur utilisateur = utilisateurOpt.get();

        boolean motDePasseCorrect = passwordEncoder.matches(
                loginRequest.getMotDePasse(), utilisateur.getMotDePasse());

        if (!motDePasseCorrect) {
            throw new UnauthorizedException("Identifiants invalides");
        }

        String token = jwtUtil.genererToken(utilisateur.getEmail());
        String role = utilisateur.getClass().getSimpleName().toUpperCase();

        LoginResponse response = new LoginResponse(
                utilisateur.getUserID(),
                token,
                utilisateur.getEmail(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                role
        );

        return ResponseEntity.ok(response);
    }
}