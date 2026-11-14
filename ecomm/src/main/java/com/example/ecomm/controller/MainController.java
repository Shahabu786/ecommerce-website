
package com.example.ecomm.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ecomm.model.User;
import com.example.ecomm.service.UserService;

@RestController
@RequestMapping("/api")
public class MainController {

    // Constructor Injection
    private final UserService uService;

    public MainController(UserService uService) {
        this.uService = uService;
    }

    // Save User
    @PostMapping("/user")
    public User saveUser(@RequestBody User user) {
        return uService.addUser(user);
    }
}
