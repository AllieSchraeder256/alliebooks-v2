package com.alliebooks.repositories;

import com.alliebooks.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepo extends JpaRepository<User, UUID> {
    Optional<User> findByNameAndDeletedFalse(String name);
    List<User> findByDeletedFalseOrderByNameDesc();
}
