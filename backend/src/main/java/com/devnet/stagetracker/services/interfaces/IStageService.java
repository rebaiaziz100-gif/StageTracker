package com.devnet.stagetracker.services.interfaces;

import com.devnet.stagetracker.entities.Stage;

public interface IStageService extends ICRUD<Stage, Integer> {
    Stage valider(Integer id);
}
