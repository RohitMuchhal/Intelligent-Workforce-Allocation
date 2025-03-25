package com.nucleus.iwas.controllers;

import com.nucleus.iwas.models.LeaveRequest;
import com.nucleus.iwas.service.AdminLeaveReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/leaves")
public class AdminLeaveReportController {
    @Autowired
    private AdminLeaveReportService adminLeaveReportService;

    @GetMapping
    public List<LeaveRequest> getAllLeaveRequests() 
    {
        return adminLeaveReportService.getAllLeaveRequests();
    }

    @GetMapping("/status/{status}")
    public List<LeaveRequest> getLeaveRequestsByStatus(@PathVariable String status)
    {
        return adminLeaveReportService.getLeaveRequestsByStatus(status);
    }

    @GetMapping("/employee/{employeeId}")
    public List<LeaveRequest> getLeaveRequestsByEmployee(@PathVariable Long employeeId)
    {
        return adminLeaveReportService.getLeaveRequestsByEmployee(employeeId);
    }
    
}
