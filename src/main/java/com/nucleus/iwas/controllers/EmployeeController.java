package com.nucleus.iwas.controllers;
import com.nucleus.iwas.dto.SkillUpdateRequest;
import com.nucleus.iwas.models.Employee;

import com.nucleus.iwas.repository.EmployeeRepository;


import java.util.List;
import java.util.Optional;
import com.nucleus.iwas.models.User;
import com.nucleus.iwas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.nucleus.iwas.service.EmployeeService;

import java.util.Map;
@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee)
    {
        return employeeRepository.save(employee);
    }

    @GetMapping
    public List<Employee> getallEmployees()
    {
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Employee> getEmployeeById(@PathVariable Long id)
    {
        return employeeRepository.findById(id);
    }

    @GetMapping("/user/{userId}")
    public Employee getEmployeeByUserId(@PathVariable Long userId) 
    {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    Employee emp = user.getEmployee();
    if (emp == null) {
        throw new RuntimeException("Employee not found for this user");
    }

    return emp;
    }

    @PostMapping("/{employeeId}/add-skill")
    public ResponseEntity<String> addSkill(@PathVariable Long employeeId, @RequestBody Map<String, String> request) 
    {
        String newSkill = request.get("skill");
        if (newSkill == null || newSkill.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Skill cannot be empty.");
        }
        employeeService.addEmployeeSkill(employeeId, newSkill.trim());
        return ResponseEntity.ok("Skill added successfully");
    }

   @PutMapping("/update-skills")
   public ResponseEntity<String> updateSkills(@RequestBody SkillUpdateRequest request) 
   {
    employeeService.updateEmployeeSkills(request.getEmployeeId(), request.getSkills());
    return ResponseEntity.ok("Skills updated successfully");
   }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) 
    {
        employeeService.deleteEmployee(id);  
        return ResponseEntity.ok("Employee deleted successfully");
    }
    

}