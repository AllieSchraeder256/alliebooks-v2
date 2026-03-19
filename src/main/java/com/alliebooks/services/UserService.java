package com.alliebooks.services;

import com.alliebooks.models.User;
import com.alliebooks.repositories.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService extends BaseCrudService<User> {

	private final UserRepo repository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepo repository, PasswordEncoder passwordEncoder) {
		super(repository);
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

	public List<User> getUsers() {
		return repository.findByDeletedFalseOrderByNameDesc();
	}

	public void signup(User request) throws Exception {
		var existingUser = repository.findByNameAndDeletedFalse(request.getName());
		if (existingUser.isPresent()) {
			throw new Exception(String.format("User '%s' already exists.", request.getName()));
		}

		var hashedPassword = passwordEncoder.encode(request.getPassword());
		request.setPassword(hashedPassword);
		repository.save(request);
	}
}
