package com.devnet.stagetracker.helper;

import com.devnet.stagetracker.entities.Utilisateur;
import com.devnet.stagetracker.exception.ResourceNotFoundException;
import com.devnet.stagetracker.repositories.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityHelper {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public Utilisateur getUtilisateurConnecte() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + email));
    }

    public Integer getUserIdConnecte() {
        return getUtilisateurConnecte().getUserID();
    }

    public boolean estAdminOuProprietaire(Integer idDemande) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean estAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        return estAdmin || getUserIdConnecte().equals(idDemande);
    }
}
