package com.nucleus.iwas.controllers;
import com.nucleus.iwas.models.Employee;
import com.nucleus.iwas.repository.EmployeeRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

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

    @DeleteMapping("/{id}")
    public void deleteEmoloyee(@PathVariable Long id)
    {
        employeeRepository.deleteById(id);
    }
}