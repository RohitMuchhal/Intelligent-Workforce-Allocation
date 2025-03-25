package com.nucleus.iwas.service;

import com.nucleus.iwas.models.LeaveRequest;
import com.nucleus.iwas.models.LeaveStatus;
import com.nucleus.iwas.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminLeaveReportService 
{
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    public List<LeaveRequest> getAllLeaveRequests()
    {
        return leaveRequestRepository.findAll();
    }

    public List<LeaveRequest> getLeaveRequestsByStatus(String status)
    {
        return leaveRequestRepository.findByStatus(LeaveStatus.valueOf(status.toUpperCase()));
    }

    public List<LeaveRequest> getLeaveRequestsByEmployee(Long employeeId)
    {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }
    
}
