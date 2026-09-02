package com.pilatesstudio.backend.service;

import com.pilatesstudio.backend.dto.ExercicioRequest;
import com.pilatesstudio.backend.dto.ExercicioResponse;
import com.pilatesstudio.backend.model.entity.Exercicio;
import com.pilatesstudio.backend.repository.ExercicioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ExercicioService {

    private final ExercicioRepository exercicioRepository;

    // Metodo para criar um exercicio novo
    public ExercicioResponse criar(ExercicioRequest request) {

        Exercicio exercicio = new Exercicio();

        exercicio.setNome(request.getNome());
        exercicio.setTraducao(request.getTraducao());
        exercicio.setNiveis(request.getNiveis());
        exercicio.setAparelhos(request.getAparelhos());
        exercicio.setRegioesCorporais(request.getRegioesCorporais());
        exercicio.setFocosMusculares(request.getFocosMusculares());
        exercicio.setObjetivos(request.getObjetivos());
        exercicio.setContraindicacoes(request.getContraindicacoes());
        exercicio.setImagemUrl(request.getImagemUrl());

        Exercicio exercicioSalvo = exercicioRepository.save(exercicio);

        ExercicioResponse response = new ExercicioResponse();

        response.setId(exercicioSalvo.getId());
        response.setNome(exercicioSalvo.getNome());
        response.setTraducao(exercicioSalvo.getTraducao());
        response.setNiveis(exercicioSalvo.getNiveis());
        response.setAparelhos(exercicioSalvo.getAparelhos());
        response.setRegioesCorporais(exercicioSalvo.getRegioesCorporais());
        response.setFocosMusculares(exercicioSalvo.getFocosMusculares());
        response.setObjetivos(exercicioSalvo.getObjetivos());
        response.setContraindicacoes(exercicioSalvo.getContraindicacoes());
        response.setImagemUrl(exercicioSalvo.getImagemUrl());

        return response;
    }
}