package com.nucleus.iwas.controllers;
import com.nucleus.iwas.models.Employee;
import com.nucleus.iwas.models.Project;
import com.nucleus.iwas.repository.EmployeeRepository;
import com.nucleus.iwas.repository.ProjectRepository;
import com.nucleus.iwas.service.SkillMatchingService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/match")
public class SkillMatchingController {
    @Autowired
    private SkillMatchingService skillMatchingService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping("/{projectId}")
    public List<Employee> getMatchingEmployees(@PathVariable Long projectId)
    {
        return skillMatchingService.findMatchingEmployees(projectId);
    }

    @PostMapping("/{projectId}/assign/{employeeId}")
    public String assignEmployeeToProject(@PathVariable Long projectId,@PathVariable Long employeeId)
    {
        Project project=projectRepository.findById(projectId).orElseThrow(()->new RuntimeException("Project Not Found"));
        Employee employee=employeeRepository.findById(employeeId).orElseThrow(()->new RuntimeException("Employee Not Found"));

        project.getAssignedEmployees().add(employee);
        projectRepository.save(project);

        return "Employee "+ employee.getName()+" assigned to project "+project.getName();
    }

    @DeleteMapping("/{projectId}/remove/{employeeId}")
    public String removeEmployeeFromProject(@PathVariable Long projectId, @PathVariable Long employeeId) {
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("Employee not found"));

        project.getAssignedEmployees().remove(employee);
        projectRepository.save(project);

        return "Employee " + employee.getName() + " removed from project " + project.getName();
    }
}
