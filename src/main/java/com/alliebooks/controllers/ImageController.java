package com.alliebooks.controllers;

import com.alliebooks.models.Image;
import com.alliebooks.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/images")
public class ImageController {
    @Autowired
    private ImageService imageService;

    @GetMapping()
    public Image getImage(@RequestParam UUID resourceId) throws Exception {
        var imageOption = imageService.getForResource(resourceId);
        if (imageOption.isPresent()) {
            return imageOption.get();
        } else {
            throw new Exception("Image not found for resource id: " + resourceId);
        }
    }
}
