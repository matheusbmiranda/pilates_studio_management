package com.pilatesstudio.backend.service;

import com.pilatesstudio.backend.dto.AlunoRequestDTO;
import com.pilatesstudio.backend.dto.AlunoResponseDTO;
import com.pilatesstudio.backend.exception.AlunoNaoEncontradoException;
import com.pilatesstudio.backend.model.entity.Aluno;
import com.pilatesstudio.backend.model.enums.StatusAluno;
import com.pilatesstudio.backend.repository.AlunoRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.text.Normalizer;
import java.util.Locale;


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

        aluno.setNomeNormalizado(Normalizer.normalize(aluno.getNome(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT));

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

    public Page<AlunoResponseDTO> listar(
            String nome,
            String status,
            Pageable pageable
    ) {

        Page<Aluno> alunos;

        boolean temNome = nome != null && !nome.isBlank();
        boolean temStatus = status != null && !status.isBlank();

        if (temNome) {

            String nomeNormalizado = Normalizer.normalize(
                    nome,
                    Normalizer.Form.NFD
            ).replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT);

            if (temStatus) {

                StatusAluno statusEnum = StatusAluno.valueOf(
                        status.toUpperCase(Locale.ROOT)
                );

                alunos = alunoRepository
                        .findByNomeNormalizadoContainingIgnoreCaseAndStatus(
                                nomeNormalizado,
                                statusEnum,
                                pageable
                        );

            } else {

                alunos = alunoRepository
                        .findByNomeNormalizadoContainingIgnoreCase(
                                nomeNormalizado,
                                pageable
                        );
            }

        } else if (temStatus) {

            StatusAluno statusEnum = StatusAluno.valueOf(
                    status.toUpperCase(Locale.ROOT)
            );

            alunos = alunoRepository.findByStatus(
                    statusEnum,
                    pageable
            );

        } else {

            alunos = alunoRepository.findAll(pageable);
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

    public AlunoResponseDTO buscarPorId(String id) {

        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(AlunoNaoEncontradoException::new);

        AlunoResponseDTO response = new AlunoResponseDTO();

        response.setId(aluno.getId());
        response.setNome(aluno.getNome());
        response.setDataNascimento(aluno.getDataNascimento());
        response.setTelefone(aluno.getTelefone());
        response.setEmail(aluno.getEmail());
        response.setStatus(aluno.getStatus());
        response.setObservacoes(aluno.getObservacoes());

        return response;
    }

    public AlunoResponseDTO editar(String id, AlunoRequestDTO request) {

        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(AlunoNaoEncontradoException::new);

        aluno.setNome(request.getNome());
        aluno.setDataNascimento(request.getDataNascimento());
        aluno.setTelefone(request.getTelefone());
        aluno.setEmail(request.getEmail());
        aluno.setStatus(request.getStatus());
        aluno.setObservacoes(request.getObservacoes());

        aluno.setNomeNormalizado(
                Normalizer.normalize(aluno.getNome(), Normalizer.Form.NFD)
                        .replaceAll("\\p{M}", "")
                        .toLowerCase(Locale.ROOT)
        );

        Aluno alunoSalvo = alunoRepository.save(aluno);

        AlunoResponseDTO response = new AlunoResponseDTO();

        response.setId(alunoSalvo.getId());
        response.setNome(alunoSalvo.getNome());
        response.setDataNascimento(alunoSalvo.getDataNascimento());
        response.setTelefone(alunoSalvo.getTelefone());
        response.setEmail(alunoSalvo.getEmail());
        response.setStatus(alunoSalvo.getStatus());
        response.setObservacoes(alunoSalvo.getObservacoes());

        return response;
    }
}
