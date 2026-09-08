package com.pilatesstudio.backend.service;

import com.pilatesstudio.backend.dto.ExercicioRequestDTO;
import com.pilatesstudio.backend.dto.ExercicioResponseDTO;
import com.pilatesstudio.backend.model.entity.Exercicio;
import com.pilatesstudio.backend.repository.ExercicioRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ExercicioService {

    private final ExercicioRepository exercicioRepository;
    private final MongoTemplate mongoTemplate;

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

    public Page<ExercicioResponseDTO> listar(
            String nome,
            String nivel,
            String aparelho,
            String regiaoCorporal,
            String focoMuscular,
            Pageable pageable
    ) {

        Query query = new Query();

        // Busca por nome ou tradução
        if (nome != null && !nome.isBlank()) {

            Criteria busca = new Criteria().orOperator(
                    Criteria.where("nome").regex(nome, "i"),
                    Criteria.where("traducao").regex(nome, "i")
            );

            query.addCriteria(busca);
        }

        // Filtro por nível
        if (nivel != null && !nivel.isBlank()) {
            query.addCriteria(
                    Criteria.where("niveis").is(nivel)
            );
        }

        // Filtro por aparelho
        if (aparelho != null && !aparelho.isBlank()) {
            query.addCriteria(
                    Criteria.where("aparelhos").is(aparelho)
            );
        }

        // Filtro por região corporal
        if (regiaoCorporal != null && !regiaoCorporal.isBlank()) {
            query.addCriteria(
                    Criteria.where("regioesCorporais").is(regiaoCorporal)
            );
        }

        // Filtro por foco muscular
        if (focoMuscular != null && !focoMuscular.isBlank()) {
            query.addCriteria(
                    Criteria.where("focosMusculares").is(focoMuscular)
            );
        }

        // Total de registros antes da paginação
        long total = mongoTemplate.count(
                query,
                Exercicio.class
        );

        // Aplica paginação e ordenação
        query.with(pageable);

        List<Exercicio> exercicios = mongoTemplate.find(
                query,
                Exercicio.class
        );

        Page<Exercicio> pagina = new PageImpl<>(
                exercicios,
                pageable,
                total
        );

        return pagina.map(exercicio -> {

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

    public ExercicioResponseDTO buscarPorId(String id) {

        Exercicio exercicio = exercicioRepository.findById(id).orElseThrow();

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
    }

    public ExercicioResponseDTO editar(String id, ExercicioRequestDTO request) {

        Exercicio exercicio = exercicioRepository.findById(id).orElseThrow();

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
}