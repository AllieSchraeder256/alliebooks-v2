package com.alliebooks.services;

import com.alliebooks.models.Image;
import com.alliebooks.repositories.ExpenseRepo;
import com.alliebooks.repositories.ImageRepo;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Slf4j
@Service
public class ImageService extends BaseCrudService<Image> {
	private static final Logger logger = Logger.getLogger(ImageService.class.getName());

	public static final String IMAGE_FILE_LOCATION = "/home/allie/alliebooks/legacy-receipts";

	public static final String FILE_TYPE = "jpg";
	private final ImageRepo repository;
	private final ExpenseRepo expenseRepo;

	public ImageService(ImageRepo repository, ExpenseRepo expenseRepo) {
		super(repository);
		this.repository = repository;
		this.expenseRepo = expenseRepo;
	}

	public Optional<Image> getForResource(UUID resourceId) {
		var image = repository.findFirstByResourceIdAndDeletedFalse(resourceId);
		if (image.isEmpty()) {
			var expenseOpt = expenseRepo.findById(resourceId);
			if (expenseOpt.isPresent()) {
				var expense = expenseOpt.get();
				if (expense.getLegacyImageFilename() != null) {
					return getImageFromFileSystem(expense.getId(), expense.getLegacyImageFilename());
				}
			}
		}
		return image;
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

	private Optional<Image> getImageFromFileSystem(UUID resourceId, String filename) {
		File file = new File(IMAGE_FILE_LOCATION + "/" + filename);
		try {
			if(file.exists()) {
				var stream = new FileInputStream(file);

				var image = new Image();
				image.setData(IOUtils.toByteArray(stream));
				image.setFileName(filename);
				image.setResourceId(resourceId);
				image.setResourceType("expenses");
				return Optional.of(image);
			}
		} catch (FileNotFoundException e) {
			logger.severe("File not found " + filename);
		} catch (IOException e) {
			logger.severe("IO exception for " + filename);
		}
		return Optional.empty();
	}
}