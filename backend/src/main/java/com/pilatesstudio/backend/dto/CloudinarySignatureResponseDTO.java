package com.pilatesstudio.backend.dto;

public record CloudinarySignatureResponseDTO(
        String cloudName,
        String apiKey,
        String uploadPreset,
        long timestamp,
        String signature
) {
}
