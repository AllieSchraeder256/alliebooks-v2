package com.alliebooks.services;

import com.alliebooks.models.BaseModel;
import com.alliebooks.models.ExpenseType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public class BaseCrudService<T extends BaseModel> {
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

		return repository.save(entity);
    }

    public Optional<T> findById(UUID id) {
        return repository.findById(id);
    }

    public T delete(T entity) {
        entity.setDeletedAt(Instant.now());
        entity.setDeleted(true);

        return repository.save(entity);
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
