package com.pilatesstudio.backend.service;

import com.pilatesstudio.backend.dto.ExercicioRequestDTO;
import com.pilatesstudio.backend.dto.ExercicioResponseDTO;
import com.pilatesstudio.backend.model.entity.Exercicio;
import com.pilatesstudio.backend.repository.ExercicioRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ExercicioService {

    private final ExercicioRepository exercicioRepository;

    // Metodo para criar um exercicio novo
    public ExercicioResponseDTO criar(ExercicioRequestDTO request) {

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

        ExercicioResponseDTO response = new ExercicioResponseDTO();

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

    public Page<ExercicioResponseDTO> listar(String nome, Pageable pageable) {

        Page<Exercicio> exercicios;

        if (nome == null || nome.isBlank()) {
            exercicios = exercicioRepository.findAll(pageable);
        } else {
            exercicios = exercicioRepository.findByNomeContainingIgnoreCaseOrTraducaoContainingIgnoreCase(nome, nome, pageable);
        }

        return exercicios.map(exercicio -> {

            ExercicioResponseDTO response = new ExercicioResponseDTO();

            response.setId(exercicio.getId());
            response.setNome(exercicio.getNome());
            response.setTraducao(exercicio.getTraducao());
            response.setNiveis(exercicio.getNiveis());
            response.setAparelhos(exercicio.getAparelhos());
            response.setRegioesCorporais(exercicio.getRegioesCorporais());
            response.setFocosMusculares(exercicio.getFocosMusculares());
            response.setObjetivos(exercicio.getObjetivos());
            response.setContraindicacoes(exercicio.getContraindicacoes());
            response.setImagemUrl(exercicio.getImagemUrl());

            return response;
        });
    }
}