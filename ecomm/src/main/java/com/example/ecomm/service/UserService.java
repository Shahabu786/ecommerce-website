package com.example.ecomm.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.example.ecomm.dto.AuthResponse;
import com.example.ecomm.mapper.DtoMapper;
import com.example.ecomm.model.Cart;
import com.example.ecomm.model.User;
import com.example.ecomm.repo.UserRepo;
import com.example.ecomm.util.PasswordUtil;

@Service
public class UserService {

    private final UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    // 1. Add User (signup): validates, hashes password, creates the user's cart
    @Transactional
    public User addUser(User user) {
        if (user.getName() == null || user.getName().isBlank()) {
            throw bad("Name is required");
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw bad("Email is required");
        }
        if (user.getPassword() == null || user.getPassword().length() < 6) {
            throw bad("Password must be at least 6 characters");
        }
        String email = user.getEmail().trim().toLowerCase();
        if (userRepo.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This email is already registered. Please login.");
        }
        user.setEmail(email);
        user.setPassword(PasswordUtil.hash(user.getPassword()));
        user.setRole("CUSTOMER"); // public signup can never create an admin
        Cart cart = new Cart();
        cart.setUser(user);
        user.setCart(cart);
        return userRepo.save(user);
    }

    // Login
    @Transactional
    public AuthResponse login(String email, String password) {
        User user = userRepo.findByEmailIgnoreCase(email == null ? "" : email.trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password."));
        if (!PasswordUtil.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        boolean changed = false;
        if (!PasswordUtil.isHashed(user.getPassword())) {
            user.setPassword(PasswordUtil.hash(password)); // upgrade old plain-text row
            changed = true;
        }
        if (user.getCart() == null) {
            Cart cart = new Cart();
            cart.setUser(user);
            user.setCart(cart);
            changed = true;
        }
        if (changed) {
            user = userRepo.saveAndFlush(user);
        }
        return new AuthResponse(DtoMapper.toUserDto(user), user.getCart().getId());
    }

    // 2. Get All Users
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    // 3. Get User By ID
    public Optional<User> getUserById(Long id) {
        return userRepo.findById(id);
    }

    // 4. Update User (password is only changed when a new one is sent)
    @Transactional
    public Optional<User> updateUser(Long id, User newUser) {
        Optional<User> optionalUser = userRepo.findById(id);
        if (optionalUser.isEmpty()) {
            return Optional.empty();
        }
        User user = optionalUser.get();
        if (newUser.getName() != null && !newUser.getName().isBlank()) {
            user.setName(newUser.getName());
        }
        if (newUser.getEmail() != null && !newUser.getEmail().isBlank()) {
            String email = newUser.getEmail().trim().toLowerCase();
            if (!email.equalsIgnoreCase(user.getEmail()) && userRepo.existsByEmailIgnoreCase(email)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is already registered.");
            }
            user.setEmail(email);
        }
        if (newUser.getPassword() != null && !newUser.getPassword().isBlank()) {
            if (newUser.getPassword().length() < 6) {
                throw bad("Password must be at least 6 characters");
            }
            user.setPassword(PasswordUtil.hash(newUser.getPassword()));
        }
        if (newUser.getContact() != null) {
            user.setContact(newUser.getContact());
        }
        if (newUser.getAddress() != null) {
            user.setAddress(newUser.getAddress());
        }
        return Optional.of(userRepo.save(user));
    }

    // 5. Delete User
    public boolean deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            return false;
        }
        userRepo.deleteById(id);
        return true;
    }

    private static ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
