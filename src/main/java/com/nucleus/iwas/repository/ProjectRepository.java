package com.nucleus.iwas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.nucleus.iwas.models.Project;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project,Long>{
    List<Project> findByAssignedEmployees_Id(Long employeeId); 
}
