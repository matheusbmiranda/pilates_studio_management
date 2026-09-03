package com.pilatesstudio.backend.service;

import com.pilatesstudio.backend.config.CloudinaryProperties;
import com.pilatesstudio.backend.dto.CloudinarySignatureResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
@RequiredArgsConstructor
public class CloudinarySignatureService {

    private final CloudinaryProperties cloudinaryProperties;

    public CloudinarySignatureResponse generateUploadSignature() {
        validateConfiguration();

        long timestamp = System.currentTimeMillis() / 1000;
        String parametersToSign = "timestamp=" + timestamp + "&upload_preset=" + cloudinaryProperties.getUploadPreset();
        String signature = sha1(parametersToSign + cloudinaryProperties.getApiSecret());

        return new CloudinarySignatureResponse(
                cloudinaryProperties.getCloudName(),
                cloudinaryProperties.getApiKey(),
                cloudinaryProperties.getUploadPreset(),
                timestamp,
                signature
        );
    }

    private void validateConfiguration() {
        if (!StringUtils.hasText(cloudinaryProperties.getCloudName())
                || !StringUtils.hasText(cloudinaryProperties.getApiKey())
                || !StringUtils.hasText(cloudinaryProperties.getApiSecret())
                || !StringUtils.hasText(cloudinaryProperties.getUploadPreset())) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Cloudinary não está configurado.");
        }
    }

    private String sha1(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-1").digest(value.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Algoritmo SHA-1 indisponível.", exception);
        }
    }
}
