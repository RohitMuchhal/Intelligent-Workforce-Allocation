package com.nucleus.iwas.service;
import com.nucleus.iwas.models.Employee;
import com.nucleus.iwas.models.Project;
import com.nucleus.iwas.repository.EmployeeRepository;
import com.nucleus.iwas.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service

public class AdminDashboardService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<Employee> getAllEmployees()
    {
        return employeeRepository.findAll();
    }

    public List<Project> getAllProjects()
    {
        return projectRepository.findAll();
    }
    
}
