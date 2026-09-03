package com.pilatesstudio.backend.controller;

import com.pilatesstudio.backend.dto.CloudinarySignatureResponse;
import com.pilatesstudio.backend.service.CloudinarySignatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/uploads/cloudinary")
@RequiredArgsConstructor
public class UploadController {

    private final CloudinarySignatureService cloudinarySignatureService;

    @PostMapping("/signature")
    public CloudinarySignatureResponse generateSignature() {
        return cloudinarySignatureService.generateUploadSignature();
    }
}
