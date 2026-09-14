package com.pilatesstudio.backend.repository;

import com.pilatesstudio.backend.model.entity.Aluno;
import com.pilatesstudio.backend.model.enums.StatusAluno;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AlunoRepository extends MongoRepository<Aluno, String> {

    Page<Aluno> findByNomeNormalizadoContainingIgnoreCase(
            String nomeNormalizado,
            Pageable pageable
    );

    Page<Aluno> findByStatus(
            StatusAluno status,
            Pageable pageable
    );

    Page<Aluno> findByNomeNormalizadoContainingIgnoreCaseAndStatus(
            String nomeNormalizado,
            StatusAluno status,
            Pageable pageable
    );

}