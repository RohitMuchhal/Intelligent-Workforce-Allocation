package com.nucleus.iwas.models;
import jakarta.persistence.*;
// import com.nucleus.iwas.models.Project;
// import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String skills;

    @ManyToMany(mappedBy = "assignedEmployees") 
    // @JsonBackReference 
    @JsonIgnore
    private List<Project> assignedProjects;

    public Long getId()
    {
        return id;
    }
    public void setId(Long id)
    {
        this.id=id;
    }
    public String getName()
    {
        return name;
    }
    public void setName(String name)
    {
        this.name=name;
    }
    public String getEmail()
    {
        return email;
    }
    public void setEmail(String email)
    {
        this.email=email;
    }
    public String getSkills()
    {
        return skills;
    }
    public void setSkills(String skills)
    {
        this.skills=skills;
    }
    public List<Project> getAssignedProjects() 
    {
         return assignedProjects; 
    }  
    public void setAssignedProjects(List<Project> assignedProjects) 
    { 
        this.assignedProjects = assignedProjects; 
    }
}