package com.nucleus.iwas.controllers;
import com.nucleus.iwas.models.LeaveRequest;
import com.nucleus.iwas.models.LeaveStatus;
import com.nucleus.iwas.repository.LeaveRequestRepository;
import com.nucleus.iwas.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
// import java.util.Optional;


@RestController
@RequestMapping("/leaves")

public class LeaveRequestController {
    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @PostMapping("/{employeeId}")
    public LeaveRequest requestLeave(@PathVariable Long employeeId, @RequestBody LeaveRequest leaveRequest)
    {
        leaveRequest.setEmployee(employeeRepository.findById(employeeId).orElseThrow(()->new RuntimeException("Employee not found")));
        leaveRequest.setStatus(LeaveStatus.PENDING);
        return leaveRequestRepository.save(leaveRequest);
    }

    @GetMapping
    public List<LeaveRequest> getAllLeaveRequests()
    {
        return leaveRequestRepository.findAll();
    }

    @GetMapping("/employee/{employeeId}")
    public List<LeaveRequest> getEmployeeLeaves(@PathVariable Long employeeId)
    {
        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    @PutMapping("/{leaveId}/{status}")
    public LeaveRequest updateLeaveStatus(@PathVariable Long leaveId,@PathVariable LeaveStatus status)
    {
        LeaveRequest leaveRequest=leaveRequestRepository.findById(leaveId).orElseThrow(()->new RuntimeException("leave not found"));
        leaveRequest.setStatus(status);
        return leaveRequestRepository.save(leaveRequest);
    }
}
