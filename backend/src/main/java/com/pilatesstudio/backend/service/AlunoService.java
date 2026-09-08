package com.pilatesstudio.backend.service;

import com.pilatesstudio.backend.dto.AlunoRequestDTO;
import com.pilatesstudio.backend.dto.AlunoResponseDTO;
import com.pilatesstudio.backend.model.entity.Aluno;
import com.pilatesstudio.backend.repository.AlunoRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;

    //Metodo para criar um aluno novo
    public AlunoResponseDTO criar(AlunoRequestDTO request) {

        Aluno aluno = new Aluno();

        aluno.setNome(request.getNome());
        aluno.setDataNascimento(request.getDataNascimento());
        aluno.setTelefone(request.getTelefone());
        aluno.setEmail(request.getEmail());
        aluno.setStatus(request.getStatus());
        aluno.setObservacoes(request.getObservacoes());

        Aluno alunoSalvo = alunoRepository.save(aluno);

        AlunoResponseDTO alunoResponseDTO = new AlunoResponseDTO();

        alunoResponseDTO.setId(alunoSalvo.getId());
        alunoResponseDTO.setNome(alunoSalvo.getNome());
        alunoResponseDTO.setDataNascimento(alunoSalvo.getDataNascimento());
        alunoResponseDTO.setTelefone(alunoSalvo.getTelefone());
        alunoResponseDTO.setEmail(alunoSalvo.getEmail());
        alunoResponseDTO.setStatus(alunoSalvo.getStatus());
        alunoResponseDTO.setObservacoes(alunoSalvo.getObservacoes());

        return alunoResponseDTO;
    }

    public Page<AlunoResponseDTO> listar(String nome, Pageable pageable) {

        Page<Aluno> alunos;

        if (nome == null || nome.isBlank()) {
            alunos = alunoRepository.findAll(pageable);
        } else {
            alunos = alunoRepository.findByNomeContainingIgnoreCase(nome, pageable);
        }

        return alunos.map(aluno -> {

            AlunoResponseDTO response = new AlunoResponseDTO();

            response.setId(aluno.getId());
            response.setNome(aluno.getNome());
            response.setDataNascimento(aluno.getDataNascimento());
            response.setTelefone(aluno.getTelefone());
            response.setEmail(aluno.getEmail());
            response.setStatus(aluno.getStatus());
            response.setObservacoes(aluno.getObservacoes());

            return response;
        });

    }
}
