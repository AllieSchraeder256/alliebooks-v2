package com.alliebooks.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Blob;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name="images")
@Getter
@Setter
public class Image extends BaseModel {

	@Column(name="file_name")
	private String fileName;

	@Column(name="file_type")
	private String fileType;

	private int height;
	private int width;

	@Column(name="compression_quality")
	private double compressionQuality;

	@Column(name="resource_type")
	private String resourceType;

	@Column(name="resource_id")
	private UUID resourceId;

	private byte[] data;
}
