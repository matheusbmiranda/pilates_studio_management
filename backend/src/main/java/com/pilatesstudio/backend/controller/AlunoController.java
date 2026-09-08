package com.pilatesstudio.backend.controller;

import com.pilatesstudio.backend.dto.AlunoRequestDTO;
import com.pilatesstudio.backend.dto.AlunoResponseDTO;
import com.pilatesstudio.backend.service.AlunoService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/alunos")
@AllArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AlunoResponseDTO criarAluno(@Valid @RequestBody AlunoRequestDTO request) {

        return alunoService.criar(request);
    }

    @GetMapping
    public Page<AlunoResponseDTO> listarAlunos(@RequestParam(required = false) String nome, Pageable pageable) {

        return alunoService.listar(nome, pageable);

    }

    @GetMapping("/{id}")
    public AlunoResponseDTO buscarPorId(@PathVariable String id) {

        return alunoService.buscarPorId(id);

    }

    @PutMapping("/{id}")
    public AlunoResponseDTO editarAluno(@PathVariable String id, @Valid @RequestBody AlunoRequestDTO request) {

        return alunoService.editar(id, request);
    }
}
