package com.nucleus.iwas.controllers;

import com.nucleus.iwas.models.User;
import com.nucleus.iwas.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String registerUser(@RequestBody Map<String, String> request) {
        return authService.registerUser(request.get("email"), request.get("password"), request.get("name"));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, String> request, HttpSession session) {
    String response = authService.loginUser(request.get("email"), request.get("password"), session);

    if (!response.equals("Login successful!")) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", response));
    }

    User user = authService.getCurrentUser(session);

    if (user == null) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "User retrieval failed!"));
    }

    return ResponseEntity.ok(Map.of(
        "message", response,
        "role", user.getRole().name()
    ));
}

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
        }
        System.out.println("Session User: " + session.getAttribute("user"));
        
        return ResponseEntity.ok(authService.getCurrentUserDetails(user));
    }
    
    @PostMapping("/logout")
    public String logoutUser(HttpSession session) {
        return authService.logoutUser(session);
    }

    @PutMapping("/upgrade/{email}")
    public String upgradeUserToAdmin(@PathVariable String email) {
        return authService.upgradeUserToAdmin(email);
    }
}
