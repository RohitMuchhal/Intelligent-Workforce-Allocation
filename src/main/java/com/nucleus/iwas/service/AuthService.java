package com.nucleus.iwas.service;

import com.nucleus.iwas.models.Employee;
import com.nucleus.iwas.models.User;
import com.nucleus.iwas.models.UserRole;
import com.nucleus.iwas.repository.EmployeeRepository;
import com.nucleus.iwas.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class AuthService {  

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public String registerUser(String email, String password, String name) {
        if (userRepository.findByEmail(email).isPresent()) {
            return "Email already exists!";
        }
    
        Employee newEmployee = new Employee();
        newEmployee.setEmail(email);
        newEmployee.setName(name);
        newEmployee.setSkills("Not Provided");      
    
        employeeRepository.save(newEmployee);
    
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setEmployee(newEmployee);
        newUser.setRole(UserRole.EMPLOYEE);
    
        userRepository.save(newUser);
    
        return "User registered successfully!";
    }

    public String loginUser(String email, String password, HttpSession session) {
        Optional<User> userOptional = userRepository.findByEmail(email);
    
        if (userOptional.isEmpty()) {
            return "User not found!";
        }
        System.out.println("Session set: hoo rha h" + session.getAttribute("userId"));

        User user = userOptional.get();
    
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return "Invalid password!";
        }
    
        session.setAttribute("user", user);
        session.setAttribute("userId", user.getId());
        session.setAttribute("role", user.getRole());
    
        return "Login successful!";
    }
    


    public User getCurrentUser(HttpSession session) {
        Object userIdObj = session.getAttribute("userId");
    
    
        if (userIdObj == null) {
            return null;
        }
    
        Long userId = (Long) userIdObj;
    
        return userRepository.findById(userId).orElse(null);
    }
    


    public String logoutUser(HttpSession session) {
        session.invalidate();
        return "Logged out successfully!";
    }

    public String upgradeUserToAdmin(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            User updatedUser = user.get();
            updatedUser.setRole(UserRole.ADMIN);
            userRepository.save(updatedUser);
            return "User upgraded to Admin!";
        }
        return "User not found!";
    }

    public Map<String, Object> getCurrentUserDetails(User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getId());
        response.put("employeeId", user.getEmployee() != null ? user.getEmployee().getId() : null);
        response.put("email", user.getEmail());
        response.put("name", user.getEmployee() != null ? user.getEmployee().getName() : null);
        response.put("role", user.getRole().toString());
        return response;
    }
}
