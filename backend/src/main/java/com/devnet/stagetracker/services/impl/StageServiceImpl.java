package com.devnet.stagetracker.services.impl;

import com.devnet.stagetracker.entities.Stage;
import com.devnet.stagetracker.exception.BadRequestException;
import com.devnet.stagetracker.repositories.StageRepository;
import com.devnet.stagetracker.services.interfaces.IStageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class StageServiceImpl
        extends AbstractCrudServiceImpl<Stage, Integer>
        implements IStageService {

    @Autowired
    private StageRepository stageRepository;

    @Override
    protected JpaRepository<Stage, Integer> getRepository() {
        return stageRepository;
    }

    @Override
    protected void assignerId(Stage entite, Integer id) {
        entite.setId(id);
    }

    @Override
    public Stage valider(Integer id) {
        Stage stage = rechercherParId(id);

        if (stage.getEtat() != Stage.EtatStage.TERMINE) {
            throw new BadRequestException("Seul un stage terminé peut être validé.");
        }

        stage.setEtat(Stage.EtatStage.VALIDE);
        return stageRepository.save(stage);
    }
}
