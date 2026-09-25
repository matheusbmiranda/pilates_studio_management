package com.pilatesstudio.backend.exception;

public class AlunoNaoEncontradoException extends RuntimeException {

    public AlunoNaoEncontradoException() {
        super("Aluno não encontrado.");
    }
}