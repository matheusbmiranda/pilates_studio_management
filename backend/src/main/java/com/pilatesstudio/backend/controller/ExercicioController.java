package com.pilatesstudio.backend.controller;

import com.pilatesstudio.backend.dto.ExercicioRequestDTO;
import com.pilatesstudio.backend.dto.ExercicioResponseDTO;
import com.pilatesstudio.backend.service.ExercicioService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


@RestController
@RequestMapping("/exercicios")
@AllArgsConstructor
public class ExercicioController {

    private final ExercicioService exercicioService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExercicioResponseDTO criar(@Valid @RequestBody ExercicioRequestDTO request) {
        return exercicioService.criar(request);
    }

    @GetMapping
    public Page<ExercicioResponseDTO> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) List<String> nivel,
            @RequestParam(required = false) List<String> aparelho,
            @RequestParam(required = false) List<String> regiaoCorporal,
            @RequestParam(required = false) List<String> focoMuscular,
            Pageable pageable
    ) {
        return exercicioService.listar(
                nome,
                nivel,
                aparelho,
                regiaoCorporal,
                focoMuscular,
                pageable
        );
    }

    @GetMapping("/{id}")
    public ExercicioResponseDTO buscarPorId(@PathVariable String id) {

        return exercicioService.buscarPorId(id);

    }

    @PutMapping("/{id}")
    public ExercicioResponseDTO editarExercicio(@PathVariable String id, @Valid @RequestBody ExercicioRequestDTO request) {

        return exercicioService.editar(id, request);
    }
}