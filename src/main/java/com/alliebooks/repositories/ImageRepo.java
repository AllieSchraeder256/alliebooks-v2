package com.alliebooks.repositories;

import com.alliebooks.models.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ImageRepo extends JpaRepository<Image, UUID> {
    Optional<Image> findFirstByResourceIdAndDeletedFalse(UUID resourceId);
    boolean existsByResourceIdAndDeletedFalse(UUID resourceId);
}
