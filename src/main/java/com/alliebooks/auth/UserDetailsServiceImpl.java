package com.alliebooks.auth;

import com.alliebooks.models.User;
import com.alliebooks.repositories.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepo repository;

    public UserDetailsServiceImpl(UserRepo repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String name) {

        var userOpt = repository.findByNameAndDeletedFalse(name);
        User user;
        if (userOpt.isPresent()) {
            user = userOpt.get();
        } else {
            //todo handle user not found
            return null;
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getName())
                .password(user.getPassword())
                .build();
    }
}