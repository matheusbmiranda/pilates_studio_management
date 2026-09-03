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
    public Page<ExercicioResponseDTO> listar(@RequestParam(required = false) String nome, Pageable pageable) {

        return exercicioService.listar(nome, pageable);
    }
}