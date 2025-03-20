package com.nucleus.iwas.repository;
import com.nucleus.iwas.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee,Long>{

    
}
