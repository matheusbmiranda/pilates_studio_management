package com.pilatesstudio.backend.service;

import com.pilatesstudio.backend.dto.AulaRequestDTO;
import com.pilatesstudio.backend.model.entity.Aula;
import com.pilatesstudio.backend.repository.AulaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AulaService {

    private final AulaRepository aulaRepository;

    public Aula criar(AulaRequestDTO dto) {

        Aula aula = new Aula();

        aula.setNiveis(dto.getNiveis());
        aula.setAparelhos(dto.getAparelhos());
        aula.setRegioesCorporais(dto.getRegioesCorporais());
        aula.setFocosMusculares(dto.getFocosMusculares());
        aula.setExercicioIds(dto.getExercicioIds());
        aula.setAlunoIds(dto.getAlunoIds());
        aula.setCriadaEm(LocalDateTime.now());

        return aulaRepository.save(aula);
    }

    public List<Aula> listarTodas() {
        return aulaRepository.findAllByOrderByCriadaEmDesc();
    }

    public List<Aula> buscarPorData(LocalDate data) {

        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim = data.plusDays(1).atStartOfDay();

        return aulaRepository.findByCriadaEmBetweenOrderByCriadaEmDesc(
                inicio,
                fim
        );
    }

    public List<Aula> buscarPorAluno(String alunoId) {
        return aulaRepository.findByAlunoIdsContainingOrderByCriadaEmDesc(alunoId);
    }

    public Aula buscarPorId(String id) {
        return aulaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aula não encontrada."));
    }
}

