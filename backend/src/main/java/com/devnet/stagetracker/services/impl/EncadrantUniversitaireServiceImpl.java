package com.devnet.stagetracker.services.impl;

import com.devnet.stagetracker.entities.EncadrantUniversitaire;
import com.devnet.stagetracker.repositories.EncadrantUniversitaireRepository;
import com.devnet.stagetracker.services.interfaces.IEncadrantUniversitaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class EncadrantUniversitaireServiceImpl
        extends AbstractCrudServiceImpl<EncadrantUniversitaire, Integer>
        implements IEncadrantUniversitaireService {

    @Autowired
    private EncadrantUniversitaireRepository encadrantUniversiteRepository;

    @Override
    protected JpaRepository<EncadrantUniversitaire, Integer> getRepository() {
        return encadrantUniversiteRepository;
    }

    @Override
    protected void assignerId(EncadrantUniversitaire entite, Integer id) {
        entite.setUserID(id);
    }
}
