package com.pilatesstudio.backend.controller;

import com.pilatesstudio.backend.dto.ExercicioRequest;
import com.pilatesstudio.backend.dto.ExercicioResponse;
import com.pilatesstudio.backend.service.ExercicioService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exercicios")
@AllArgsConstructor
public class ExercicioController {

    private final ExercicioService exercicioService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExercicioResponse criar(@RequestBody ExercicioRequest request) {
        return exercicioService.criar(request);
    }
}