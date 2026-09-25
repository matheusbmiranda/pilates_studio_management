package com.pilatesstudio.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Map;

// Classe para definir o formato da resposta dos possíveis erros

@Getter
@AllArgsConstructor
public class ApiErrorResponse {

    private int status;
    private String message;
    private Map<String, String> errors;
}