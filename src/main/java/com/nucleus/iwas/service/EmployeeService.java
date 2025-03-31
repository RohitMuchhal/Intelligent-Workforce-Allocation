package com.nucleus.iwas.service;

import com.nucleus.iwas.repository.EmployeeRepository;
import com.nucleus.iwas.repository.LeaveRequestRepository;
import com.nucleus.iwas.repository.ProjectRepository;
import com.nucleus.iwas.repository.UserRepository;
import com.nucleus.iwas.models.Employee;
import com.nucleus.iwas.models.Project;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

@Service
@Transactional
public class EmployeeService {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserRepository userRepository;

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public void updateEmployeeSkills(Long employeeId, List<String> skills) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setSkills(String.join(", ", skills)); 
        employeeRepository.save(employee);
    }
    public void addEmployeeSkill(Long employeeId, String newSkill) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        String currentSkills = employee.getSkills();
        if (currentSkills == null || currentSkills.trim().isEmpty() || currentSkills.equals("Not Provided")) {
            employee.setSkills(newSkill);
        } else {
            employee.setSkills(currentSkills + ", " + newSkill);
        }
        employeeRepository.save(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found"));
    
        List<Project> projects = projectRepository.findByAssignedEmployees_Id(id);
        for (Project project : projects) {
            project.getAssignedEmployees().remove(employee);
            projectRepository.save(project);
        }
    
        userRepository.deleteByEmail(employee.getEmail());
    
        leaveRequestRepository.deleteByEmployeeId(id);
    
        employeeRepository.deleteById(id);
    }

}
