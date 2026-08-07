package com.devnet.stagetracker.services.impl;

import com.devnet.stagetracker.entities.Etudiant;
import com.devnet.stagetracker.repositories.EtudiantRepository;
import com.devnet.stagetracker.services.interfaces.IEtudiantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class EtudiantServiceImpl
        extends AbstractCrudServiceImpl<Etudiant, Integer>
        implements IEtudiantService {

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Override
    protected JpaRepository<Etudiant, Integer> getRepository() {
        return etudiantRepository;
    }

    @Override
    protected void assignerId(Etudiant entite, Integer id) {
        entite.setUserID(id);
    }
}
