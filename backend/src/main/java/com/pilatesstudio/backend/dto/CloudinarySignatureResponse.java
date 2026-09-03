package com.pilatesstudio.backend.dto;

public record CloudinarySignatureResponse(
        String cloudName,
        String apiKey,
        String uploadPreset,
        long timestamp,
        String signature
) {
}
