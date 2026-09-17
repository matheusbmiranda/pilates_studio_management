package com.pilatesstudio.backend.controller;

import com.pilatesstudio.backend.dto.AulaRequestDTO;
import com.pilatesstudio.backend.model.entity.Aula;
import com.pilatesstudio.backend.service.AulaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/aulas")
@RequiredArgsConstructor
public class AulaController {

    private final AulaService aulaService;

    @PostMapping
    public ResponseEntity<Void> criar(
            @Valid @RequestBody AulaRequestDTO dto
    ) {

        aulaService.criar(dto);

        return ResponseEntity.status(201).build();
    }

    @GetMapping
    public ResponseEntity<List<Aula>> listar(
            @RequestParam(required = false) LocalDate data
    ) {

        if (data != null) {
            return ResponseEntity.ok(aulaService.buscarPorData(data));
        }

        return ResponseEntity.ok(aulaService.listarTodas());
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<Aula>> buscarPorAluno(
            @PathVariable String alunoId
    ) {

        return ResponseEntity.ok(aulaService.buscarPorAluno(alunoId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aula> buscarPorId(
            @PathVariable String id
    ) {
        return ResponseEntity.ok(aulaService.buscarPorId(id));
    }
}