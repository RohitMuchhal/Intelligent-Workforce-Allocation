package com.nucleus.iwas.models;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")

public class LeaveRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id",nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LeaveStatus status;

    public LeaveRequest()
    {
        this.status=LeaveStatus.PENDING;
    }
    public Long getId() 
    { 
        return id; 
    }
    public void setId(Long id) 
    { 
        this.id = id; 
    }

    public Employee getEmployee() 
    { 
        return employee; 
    }
    public void setEmployee(Employee employee) 
    { 
        this.employee = employee; 
    }

    public LocalDate getStartDate() 
    { 
        return startDate; 
    }
    public void setStartDate(LocalDate startDate) 
    { 
        this.startDate = startDate; 
    }

    public LocalDate getEndDate() 
    { 
        return endDate; 
    }
    public void setEndDate(LocalDate endDate) 
    { 
        this.endDate = endDate; 
    }

    public LeaveStatus getStatus() 
    { 
        return status; 
    }
    public void setStatus(LeaveStatus status) 
    { 
        this.status = status; 
    }
}
