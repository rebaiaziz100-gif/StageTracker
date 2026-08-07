package com.devnet.stagetracker.services.impl;

import com.devnet.stagetracker.exception.BadRequestException;
import com.devnet.stagetracker.entities.Candidature;
import com.devnet.stagetracker.entities.Encadrant;
import com.devnet.stagetracker.entities.OffreStage;
import com.devnet.stagetracker.entities.Stage;
import com.devnet.stagetracker.entities.StageEte;
import com.devnet.stagetracker.entities.StagePfe;
import com.devnet.stagetracker.repositories.CandidatureRepository;
import com.devnet.stagetracker.repositories.OffreStageRepository;
import com.devnet.stagetracker.repositories.StageEteRepository;
import com.devnet.stagetracker.repositories.StagePfeRepository;
import com.devnet.stagetracker.repositories.StageRepository;
import com.devnet.stagetracker.services.interfaces.ICandidatureService;
import com.devnet.stagetracker.util.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class CandidatureServiceImpl
        extends AbstractCrudServiceImpl<Candidature, Integer>
        implements ICandidatureService {

    @Autowired
    private CandidatureRepository candidatureRepository;

    @Autowired
    private OffreStageRepository offreStageRepository;

    @Autowired
    private StageEteRepository stageEteRepository;

    @Autowired
    private StagePfeRepository stagePfeRepository;

    @Autowired
    private StageRepository stageRepository;

    @Override
    protected JpaRepository<Candidature, Integer> getRepository() {
        return candidatureRepository;
    }

    @Override
    protected void assignerId(Candidature entite, Integer id) {
        entite.setId(id);
    }

    @Override
    public Candidature ajouter(Candidature entite) {
        boolean stageActif = !stageRepository
                .findByEtudiantAndEtat(entite.getEtudiant(), Stage.EtatStage.EN_COURS)
                .isEmpty();

        if (stageActif) {
            throw new BadRequestException(
                    "Vous avez déjà un stage en cours, vous ne pouvez pas déposer de nouvelle candidature.");
        }

        return super.ajouter(entite);
    }

    @Override
    @Transactional
    public Candidature accepter(Integer id, Encadrant encadrant, LocalDate dateDebut, LocalDate dateFin,
                                 String type, String sujetPFE, LocalDate dateSoutenance) {

        if (!DateUtil.estPeriodeValide(dateDebut, dateFin)) {
            throw new BadRequestException("La date de fin doit être postérieure à la date de début.");
        }

        Candidature candidature = rechercherParId(id);

        boolean chevauchement = stageRepository
                .findByEtudiantAndEtat(candidature.getEtudiant(), Stage.EtatStage.EN_COURS)
                .stream()
                .anyMatch(stageExistant -> DateUtil.periodesSeChevauchent(
                        stageExistant.getDateDebut(), stageExistant.getDateFin(), dateDebut, dateFin));

        if (chevauchement) {
            throw new BadRequestException("Cet étudiant a déjà un stage actif sur cette période.");
        }

        OffreStage offre = candidature.getOffre();
        if (offre.getNombrePlaces() == null || offre.getNombrePlaces() <= 0) {
            throw new BadRequestException("Aucune place disponible pour cette offre");
        }

        offre.setNombrePlaces(offre.getNombrePlaces() - 1);
        if (offre.getNombrePlaces() == 0) {
            offre.setStatut(OffreStage.StatutOffre.FERMEE);
        }
        offreStageRepository.save(offre);

        candidature.setStatut(Candidature.StatutCandidature.ACCEPTEE);
        candidature.setDateTraitement(LocalDate.now());
        candidatureRepository.save(candidature);

        Stage stage;
        if ("PFE".equalsIgnoreCase(type)) {
            StagePfe stagePfe = new StagePfe();
            stagePfe.setSujetPFE(sujetPFE);
            stagePfe.setDateSoutenance(dateSoutenance);
            stage = stagePfe;
        } else {
            stage = new StageEte();
        }

        stage.setDateDebut(dateDebut);
        stage.setDateFin(dateFin);
        stage.setEtat(Stage.EtatStage.EN_COURS);
        stage.setEtudiant(candidature.getEtudiant());
        stage.setEncadrant(encadrant);
        stage.setCandidature(candidature);

        if (stage instanceof StagePfe stagePfe) {
            stagePfeRepository.save(stagePfe);
        } else {
            stageEteRepository.save((StageEte) stage);
        }

        return candidature;
    }

    @Override
    @Transactional
    public Candidature refuser(Integer id, String commentaire) {

        Candidature candidature = rechercherParId(id);

        candidature.setStatut(Candidature.StatutCandidature.REFUSEE);
        candidature.setDateTraitement(LocalDate.now());
        candidature.setCommentaire(commentaire);

        return candidatureRepository.save(candidature);
    }
}