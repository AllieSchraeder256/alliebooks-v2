package com.alliebooks.services;

import com.alliebooks.models.Image;
import com.alliebooks.repositories.ImageRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class ImageService extends BaseCrudService<Image> {
	private static final Logger logger = Logger.getLogger(ImageService.class.getName());

	public static final String FILE_TYPE = "jpg";
	private final ImageRepo repository;

	public ImageService(ImageRepo repository) {
		super(repository);
		this.repository = repository;
	}

	public Optional<Image> getForResource(UUID resourceId) {
		return repository.findFirstByResourceIdAndDeletedFalse(resourceId);
	}

	public boolean hasImage(UUID resourceId) {
		return repository.existsByResourceIdAndDeletedFalse(resourceId);
	}

	public Image saveRentPayment(UUID resourceId, MultipartFile multipartFile) throws IOException {
		return save(resourceId, "rent_payments", multipartFile);
	}

	public Image saveExpense(UUID resourceId, MultipartFile multipartFile) throws IOException {
		return save(resourceId, "expenses", multipartFile);
	}

	private Image save(UUID resourceId, String resourceType, MultipartFile multipartFile) throws IOException {
		var existing = getForResource(resourceId);
        existing.ifPresent(this::delete);

		var image = new Image();
		image.setResourceId(resourceId);
		image.setResourceType(resourceType);
		image.setFileName(multipartFile.getOriginalFilename());
		image.setFileType(FILE_TYPE);// TODO get real filetype idk if we can trust this
		image.setCompressionQuality(-1);
		image.setData(multipartFile.getBytes());

		return super.save(image);
	}
}