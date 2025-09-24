package com.alliebooks.controllers;

import com.alliebooks.auth.JwtHelper;
import com.alliebooks.auth.LoginResponse;
import com.alliebooks.models.User;
import com.alliebooks.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<Void> signup(@RequestBody User request) {
        try {
            userService.signup(request);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(value = "/login")
    public ResponseEntity<LoginResponse> login(@RequestBody User request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getName(), request.getPassword()));
        String token = JwtHelper.generateToken(request.getName());
        return ResponseEntity.ok(new LoginResponse(request.getName(), token));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }
}
