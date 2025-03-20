package com.nucleus.iwas.models;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")

public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String requiredSkills;

    @Column(nullable = false)
    private int estimatedDuration;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Project()
    {
        this.createdAt=LocalDateTime.now();
        this.updatedAt=LocalDateTime.now();
    }
    public Long getId()
    {
        return id;
    }
    public void setId(Long id) 
    { 
        this.id = id;
    }

    public String getName() 
    { 
        return name; 
    }
    public void setName(String name) 
    { 
        this.name = name; 
    }

    public String getDescription() 
    { 
        return description; 
    }
    public void setDescription(String description) 
    { 
        this.description = description; 
    }

    public String getRequiredSkills() 
    { 
        return requiredSkills; 
    }
    public void setRequiredSkills(String requiredSkills) 
    { 
        this.requiredSkills = requiredSkills; 
    }

    public int getEstimatedDuration() 
    { 
        return estimatedDuration; 
    }
    public void setEstimatedDuration(int estimatedDuration) 
    { 
        this.estimatedDuration = estimatedDuration; 
    }

    public LocalDateTime getCreatedAt() 
    { 
        return createdAt; 
    }

    public LocalDateTime getUpdatedAt() 
    { 
        return updatedAt; 
    }
    public void setUpdatedAt(LocalDateTime updatedAt) 
    { 
        this.updatedAt = updatedAt; 
    }
}

