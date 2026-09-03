package com.pilatesstudio.backend.service;

import com.pilatesstudio.backend.config.CloudinaryProperties;
import com.pilatesstudio.backend.dto.CloudinarySignatureResponseDTO;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CloudinarySignatureServiceTest {

    @Test
    void generatesAClientSafeSignedUploadResponse() {
        CloudinaryProperties properties = new CloudinaryProperties();
        properties.setCloudName("demo-cloud");
        properties.setApiKey("public-api-key");
        properties.setApiSecret("private-api-secret");
        properties.setUploadPreset("pilates-exercicios");

        CloudinarySignatureResponseDTO response = new CloudinarySignatureService(properties).generateUploadSignature();

        assertEquals("demo-cloud", response.cloudName());
        assertEquals("public-api-key", response.apiKey());
        assertEquals("pilates-exercicios", response.uploadPreset());
        assertTrue(response.timestamp() > 0);
        assertTrue(response.signature().matches("[a-f0-9]{40}"));
        assertFalse(response.toString().contains("private-api-secret"));
    }
}
