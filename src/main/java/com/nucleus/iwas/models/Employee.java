package com.nucleus.iwas.models;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
//import java.util.List;

@Entity
@Table(name = "employees")
public class Employee implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false,length = 500)
    private String skills="Not Provided";

    @OneToOne(mappedBy = "employee")
    @JsonIgnore
    private User user;  

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
