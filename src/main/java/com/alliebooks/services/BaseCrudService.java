package com.alliebooks.services;

import com.alliebooks.models.BaseModel;
import com.alliebooks.models.ExpenseType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

public class BaseCrudService<T extends BaseModel> {
    private static final Logger logger = Logger.getLogger(BaseCrudService.class.getName());
    private final JpaRepository<T, UUID> repository;

    public BaseCrudService(JpaRepository<T, UUID> repository) {
        this.repository = repository;
    }

    public T save(T entity) {
        var now = Instant.now();
		if (entity.getId() == null) {
            entity.setId(UUID.randomUUID());
            entity.setCreatedAt(now);
		}
        entity.setUpdatedAt(now);

		var saved = repository.save(entity);
        logger.info(String.format("Saved resource %s id=%s", saved.getClass(), saved.getId()));
        return saved;
    }

    public Optional<T> findById(UUID id) {
        return repository.findById(id);
    }

    public T delete(T entity) {
        entity.setDeletedAt(Instant.now());
        entity.setDeleted(true);

        var deleted = repository.save(entity);
        logger.info(String.format("Deleted resource %s id=%s", deleted.getClass(), deleted.getId()));
        return deleted;
    }

    public T delete(UUID id) throws Exception {
        var entity = findById(id);
        if (entity.isPresent()) {
            return delete(entity.get());
        } else {
            throw new Exception("Entity with id {id} not found");
        }
    }
}
