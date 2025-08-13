package com.alliebooks.services;

import com.alliebooks.models.Image;
import com.alliebooks.repositories.ImageRepo;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class ImageService extends BaseCrudService<Image> {
	private static final Logger logger = Logger.getLogger(ImageService.class.getName());

	public static final int MAX_IMAGE_WIDTH = 600;
	public static final int MAX_IMAGE_HEIGHT = 600;
	public static final double COMPRESSION_QUALITY = 0.7;
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

		File output = compressImage(multipartFile);

		var image = new Image();
		image.setResourceId(resourceId);
		image.setResourceType(resourceType);
		image.setFileName(multipartFile.getOriginalFilename());
		image.setFileType(FILE_TYPE);
		image.setCompressionQuality(0.7);
		image.setData(Files.readAllBytes(output.toPath()));

		return super.save(image);
	}

	private static File compressImage(MultipartFile multipartFile) throws IOException {
		File output = new File("output." + FILE_TYPE);
		File tempFile = Files.createTempFile(multipartFile.getOriginalFilename(), ".tmp").toFile();
		multipartFile.transferTo(tempFile);

		Thumbnails.of(tempFile)
			.size(MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT)
			.outputQuality(COMPRESSION_QUALITY)
			.toFile(output);

		logger.info("Compressed image");
		return output;
	}
}