package com.nucleus.iwas.controllers;
import com.nucleus.iwas.models.Project;
import com.nucleus.iwas.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/projects")


public class ProjectController {
    
    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping
    public Project addProject(@RequestBody Project project)
    {
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }

    @GetMapping
    public List<Project> getallProjects()
    {
        return projectRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Project> getProjectById(@PathVariable Long id)
    {
        return projectRepository.findById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id)
    {
        projectRepository.deleteById(id);
    }

}
