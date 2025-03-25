package com.nucleus.iwas.repository;
import com.nucleus.iwas.models.LeaveRequest;
import com.nucleus.iwas.models.LeaveStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest,Long>
{
    List<LeaveRequest> findByEmployeeId(Long employeeId);

    List<LeaveRequest> findByStatus(LeaveStatus status);
}
