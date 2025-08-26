package com.alliebooks.services;

import com.alliebooks.models.OcrToken;
import com.alliebooks.repositories.OcrTokenRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OcrTokenService extends BaseCrudService<OcrToken> {
	
	@Autowired
	private OcrTokenRepo ocrTokenRepo;

	public OcrTokenService(OcrTokenRepo repository) {
		super(repository);
	}

	@Cacheable(cacheNames = "ocrTokens")
	public List<OcrToken> getOcrTokens() {
		return ocrTokenRepo.findByDeletedFalseOrderByMerchantAscRegexAsc();
	}

	@Override
	@Cacheable(cacheNames = "ocrTokenById", key = "#id")
	public Optional<OcrToken> findById(UUID id) {
		return super.findById(id);
	}

	@Override
	@Caching(
		put = { @CachePut(cacheNames = "ocrTokenById", key = "#result.id") },
		evict = { @CacheEvict(cacheNames = "ocrTokens", allEntries = true) }
	)
	public OcrToken save(OcrToken entity) {
		return super.save(entity);
	}

	@Override
	@Caching(
		evict = {
			@CacheEvict(cacheNames = "ocrTokens", allEntries = true),
			@CacheEvict(cacheNames = "ocrTokenById", key = "#id")
		}
	)
	public OcrToken delete(UUID id) throws Exception {
		return super.delete(id);
	}
}
