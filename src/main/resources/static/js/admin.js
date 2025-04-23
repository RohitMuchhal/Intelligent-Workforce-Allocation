
let currentProjectId = null;

function showSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(sec => {
        sec.classList.remove('active-section');
    });
    document.getElementById(sectionId).classList.add('active-section');
    
    switch(sectionId) {
        case 'projects': loadProjects(); break;
        case 'employees': loadEmployees(); break;
        case 'leaves': loadLeaves(); break;
    }
}

async function checkAdminSession() {
    try {
        const response = await fetch("/auth/current", { credentials: "include" });
        if (!response.ok) throw new Error("Not authenticated");
        const user = await response.json();
        if (user.role !== "ADMIN") throw new Error("Unauthorized access");
    } catch (error) {
        alert("Admin access required");
        window.location.href = "login.html";
    }
}

function toggleProjectForm() {
    document.getElementById('addProjectForm').classList.toggle('hidden');
}

async function addProject(event) {
    event.preventDefault();
    try {
        const projectData = {
            name: document.getElementById('projectName').value,
            description: document.getElementById('projectDesc').value,
            requiredSkills: document.getElementById('projectSkills').value
                .split(',')
                .map(s => s.trim()) 
                .join(', '),          
            startDate: new Date(document.getElementById('projectStartDate').value).toISOString(),
            endDate: new Date(document.getElementById('projectEndDate').value).toISOString()
        };

        const response = await fetch('/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData),
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to add project');

        showNotification('Project added successfully');
        toggleProjectForm();
        loadProjects();
    } catch (error) {
        console.error('Add project error:', error);
        showNotification(error.message || 'Failed to add project');
    }
}

async function loadProjects() {
    try {
        const response = await fetch("/projects", { credentials: "include" });
        const projects = await response.json();
        const container = document.getElementById("projectsList");
        container.innerHTML = "";
        const currentDate = new Date();

        projects.forEach(project => {
            const projectEndDate = new Date(project.endDate);
            const isActive = projectEndDate > currentDate;
            const statusText = isActive ? 'Active' : 'Complete';
            const statusColor = isActive ? 'text-green-600' : 'text-gray-600';

            const projectDiv = document.createElement("div");
            projectDiv.className = "bg-white p-4 rounded-lg shadow mb-4";
            projectDiv.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold">${project.name}</h3>
                        <p class="text-gray-600 mb-2">${project.description}</p>
                        <p class="text-sm"><strong>Status:</strong> <span class="${statusColor}">${statusText}</span></p>
                        <p class="text-sm"><strong>Skills:</strong> ${project.requiredSkills}</p>
                        <p class="text-sm"><strong>Dates:</strong> ${formatDate(project.startDate)} - ${formatDate(project.endDate)}</p>
                        ${project.assignedEmployees?.length ? `
                            <div class="mt-3">
                                <h4 class="font-bold mb-2">${isActive ? 'Assigned Employees' : 'Past Team'}:</h4>
                                ${project.assignedEmployees.map(emp => `
                                    <div class="flex items-center justify-between bg-gray-50 p-2 rounded mb-2">
                                        <span>${emp.name} (${emp.email})</span>
                                        ${isActive ? `
                                            <button onclick="removeEmployee('${project.id}', '${emp.id}', '${emp.name}')" 
                                                    class="text-red-500 hover:text-red-700 text-sm">
                                                Remove
                                            </button>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    ${isActive ? `
                        <button onclick="toggleEditForm('${project.id}')" 
                                class="text-blue-500 hover:text-blue-700 ml-4">
                            Edit
                        </button>
                        <button onclick="confirmDelete('${project.id}')" 
                            class="delete-btn hover:text-red-700 ml-2 text-red-500">
                            Delete
                       </button>
                    ` : ''}
                </div>
                ${isActive ? `
                    <div id="editForm-${project.id}" class="hidden mt-4">
                        <form onsubmit="editProject(event, '${project.id}')" class="space-y-3">
                            <input type="text" id="editProjectName-${project.id}" 
                                   value="${project.name}" class="w-full p-2 border rounded">
                            <textarea id="editProjectDesc-${project.id}" 
                                      class="w-full p-2 border rounded">${project.description}</textarea>
                            <input type="text" id="editProjectSkills-${project.id}" 
                                   value="${project.requiredSkills}" class="w-full p-2 border rounded">
                            <input type="datetime-local" id="editProjectStartDate-${project.id}" 
                                   value="${formatDateTimeLocal(project.startDate)}" class="w-full p-2 border rounded">
                            <input type="datetime-local" id="editProjectEndDate-${project.id}" 
                                   value="${formatDateTimeLocal(project.endDate)}" class="w-full p-2 border rounded">
                            <div class="flex gap-2">
                                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                                <button type="button" onclick="toggleEditForm('${project.id}')" 
                                        class="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                            </div>
                        </form>
                    </div>
                    <button onclick="showSuggestedEmployees('${project.id}','${project.startDate}','${project.endDate}')" 
                            class="mt-2 text-blue-500 hover:text-blue-700">
                        Show Suggested Employees
                    </button>
                ` : ''}
                <div id="suggestions-${project.id}" class="mt-2"></div>
            `;
            container.appendChild(projectDiv);
        });
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

async function confirmDelete(projectId) {
    const confirmed = confirm('Are you sure you want to delete this project? This action cannot be undone.');
    if (!confirmed) return;

    try {
        const response = await fetch(`/projects/${projectId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.ok) {
            loadProjects(); 
        } else {
            alert('Failed to delete project');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
    }
}

async function assignEmployee(employeeId, employeeName) {
    try {
        await fetch(`/match/${currentProjectId}/assign/${employeeId}`, {
            method: "POST",
            credentials: "include"
        });
        
      
        const container = document.getElementById(`suggestions-${currentProjectId}`);
        const employeeDiv = container.querySelector(`[onclick*="${employeeId}"]`);
        if (employeeDiv) employeeDiv.parentElement.parentElement.remove();
        
        showNotification(`${employeeName} assigned to project`);
        loadProjects();
    } catch (error) {
        console.error("Assignment error:", error);
        showNotification(`Error assigning ${employeeName}`);
    }
}

async function loadEmployees() {
    try {
        const [employeesRes, usersRes] = await Promise.all([
            fetch("/employees", { credentials: "include" }),
            fetch("/users", { credentials: "include" })
        ]);
        
        const [employees, users] = await Promise.all([
            employeesRes.json(),
            usersRes.json()
        ]);

        const adminEmails = users.filter(u => u.role === "ADMIN").map(u => u.email);
        const nonAdminEmployees = employees.filter(emp => !adminEmails.includes(emp.email));

        const container = document.getElementById("employeesList");
        container.innerHTML = "";

        nonAdminEmployees.forEach(employee => {
            const div = document.createElement("div");
            div.className = "bg-white p-4 rounded-lg shadow mb-4";
            div.innerHTML = `
                <h3 class="font-bold">${employee.name}</h3>
                <p class="text-gray-600">${employee.email}</p>
                <p class="text-sm mt-2"><strong>Skills:</strong> ${employee.skills}</p>
                <div class="flex gap-2 mt-3">
                    <button onclick="handleUpgrade('${employee.email}')" 
                            class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Make Admin
                    </button>
                    <button onclick="handleDelete('${employee.id}', '${employee.name}')" 
                            class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Delete
                    </button>
                </div>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Error loading employees:", error);
    }
}

async function handleUpgrade(email) 
{
    if (!confirm(`Make this user (${email}) an admin?`)) return;
    
    try {
        const response = await fetch(`/auth/upgrade/${email}`, {
            method: "PUT",
            credentials: "include"
        });
        
        if (!response.ok) throw new Error("Upgrade failed");
        showNotification(`User upgraded to admin successfully`);
        loadEmployees();
    } catch (error) {
        console.error("Upgrade error:", error);
        showNotification(`Error upgrading user`);
    }
}

async function handleDelete(id, name) 
{
    if (!confirm(`Delete employee ${name}? This cannot be undone.`)) return;
    
    try {
        const response = await fetch(`/employees/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        
        if (!response.ok) throw new Error("Delete failed");
        showNotification(`Employee ${name} deleted successfully`);
        loadEmployees();
    } catch (error) {
        console.error("Delete error:", error);
        showNotification(`Error deleting employee`);
    }
}

async function loadLeaves() 
{
    try {
        const response = await fetch("/leaves", { credentials: "include" });
        const leaves = await response.json();
        const currentDate = new Date();
        
       
        const validLeaves = leaves.filter(leave => {
            const endDate = new Date(leave.endDate);
            return endDate >= currentDate;
        });

        const expiredLeaves = leaves.filter(leave => {
            const endDate = new Date(leave.endDate);
            return endDate < currentDate;
        });

        
        await Promise.all(expiredLeaves.map(leave => 
            fetch(`/leaves/${leave.id}/REJECTED`, { method: 'PUT' })
        ));

        renderLeaves(validLeaves);
    } catch (error) {
        console.error("Error loading leaves:", error);
    }
}

function renderLeaves(leaves) 
{
    const container = document.getElementById("leavesList");
    container.innerHTML = "";

    if (leaves.length === 0) {
        container.innerHTML = "<p>No leave requests found</p>";
        return;
    }

    leaves.forEach(leave => {
        const div = document.createElement("div");
        div.className = "bg-white p-4 rounded-lg shadow mb-4";
        div.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <p><strong>Employee:</strong> ${leave.employee.name}</p>
                    <p>${formatDate(leave.startDate)} - ${formatDate(leave.endDate)}</p>
                    <span class="status-badge ${getStatusClass(leave.status)}">
                        ${leave.status}
                    </span>
                </div>
                ${leave.status === "PENDING" ? `
                <div>
                    <span class="action-btn text-green-500" 
                          onclick="updateLeaveStatus('${leave.id}', 'APPROVED')">✓</span>
                    <span class="action-btn text-red-500" 
                          onclick="updateLeaveStatus('${leave.id}', 'REJECTED')">✗</span>
                </div>
                ` : ''}
            </div>
        `;
        container.appendChild(div);
    });
}

async function updateLeaveStatus(leaveId, status) 
{
    try {
        await fetch(`/leaves/${leaveId}/${status}`, {
            method: "PUT",
            credentials: "include"
        });
        loadLeaves();
    } catch (error) {
        console.error("Status update error:", error);
    }
}

function showNotification(message) 
{
    const notification = document.createElement("div");
    notification.className = "fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

function formatDate(dateString) 
{
    return new Date(dateString).toLocaleDateString();
}

function getStatusClass(status) 
{
    const classes = {
        APPROVED: "bg-green-100 text-green-800",
        PENDING: "bg-yellow-100 text-yellow-800",
        REJECTED: "bg-red-100 text-red-800"
    };
    return classes[status] || "bg-gray-100 text-gray-800";
}

function logout() 
{
    fetch("/auth/logout", { 
        method: "POST",
        credentials: "include"
    }).then(() => {
        window.location.href = "login.html";
    });
}


document.addEventListener("DOMContentLoaded", () => {
    checkAdminSession();
    showSection('projects');
});

async function showSuggestedEmployees(projectId,projectStartDate,projectEndDate) 
{
    currentProjectId = projectId;
    try {
        const [matchResp, leavesResp, projectsResp, employeesResp, usersResp] = await Promise.all([
            fetch(`/match/${projectId}`, { credentials: "include" }),
            fetch("/leaves", { credentials: "include" }),
            fetch("/projects", { credentials: "include" }),
            fetch("/employees", { credentials: "include" }),
            fetch("/users", { credentials: "include" }) 
        ]);

        const [suggestions, allLeaves, allProjects, allEmployees, allUsers] = await Promise.all([
            matchResp.json(),
            leavesResp.json(),
            projectsResp.json(),
            employeesResp.json(),
            usersResp.json()
        ]);

      
        const assignedIDs = new Set();
        allProjects.forEach(proj => {
            if (proj.assignedEmployees) {
                proj.assignedEmployees.forEach(e => assignedIDs.add(e.id));
            }
        });

        const start = new Date(projectStartDate);
        const end = new Date(projectEndDate);
    

        const adminIDs = new Set(allUsers.filter(user => user.role === "ADMIN").map(user => user.id));

        const filteredSuggestions = suggestions.filter(emp => {
            
            if (assignedIDs.has(emp.id)) return false;

           
            const onLeave = allLeaves.some(leave => {
                if (leave.employee.id === emp.id && leave.status === "APPROVED") {
                    const leaveStart = new Date(leave.startDate);
                    const leaveEnd = new Date(leave.endDate);
                  
                    return leaveStart <= end && leaveEnd >= start;    
                }
                return false;
            });
         

            
            if (adminIDs.has(emp.id)) return false;

            return !onLeave;
            
        });

        const container = document.getElementById(`suggestions-${projectId}`);
        container.innerHTML = filteredSuggestions.length > 0
            ? "<h4 class='font-bold mt-4'>Suggested Employees:</h4>"
            : "<p>No available employees matching skills</p>";

        filteredSuggestions.forEach(employee => {
            const div = document.createElement("div");
            div.className = "flex items-center justify-between bg-gray-50 p-2 rounded mt-2";
          div.innerHTML = `<div class="flex-1">
            <div class="font-medium">${employee.name}</div>
            <div class="text-gray-600 text-sm">${employee.email}</div>
            <div class="text-xs mt-1 text-gray-500">
              Skills: ${employee.skills}
            </div>
          </div>
          <div>
            <span class="action-btn text-green-500" 
                  onclick="assignEmployee('${employee.id}', '${employee.name}')">✓</span>
            <span class="action-btn text-red-500" 
                  onclick="removeEmployee('${employee.id}', '${employee.name}')">✗</span>
          </div>`
        ;
            container.appendChild(div);
        });

        container.style.display = "block";

        document.addEventListener("click", function closeSuggestions(e) {
            if (!container.contains(e.target)) {
                container.style.display = "none";
                document.removeEventListener("click", closeSuggestions);
            }
        });

    } catch (error) {
        console.error("Error loading suggestions:", error);
    }
}

async function removeEmployee(projectId, employeeId, employeeName) 
{
    checkAdminSession();
    try {
        await fetch(`/match/${projectId}/remove/${employeeId}`, {
            method: "DELETE",
            credentials: "include"
        });
        
        const container = document.querySelector(`#project-${projectId}-assigned`);
        const employeeDiv = container?.querySelector(`[onclick*="${employeeId}"]`);
        if (employeeDiv) employeeDiv.closest('div').remove();
        
        showNotification(`${employeeName} removed from project`);
        loadProjects();
    } catch (error) {
        console.error("Removal error:", error);
        showNotification(`Error removing ${employeeName}`);
    }
}

function toggleEditForm(projectId) {
    const editForm = document.getElementById(`editForm-${projectId}`);
    editForm.classList.toggle('hidden');
}


async function editProject(event, projectId) 
{
    event.preventDefault();
    try {
        const projectData = {
            name: document.getElementById(`editProjectName-${projectId}`).value,
            description: document.getElementById(`editProjectDesc-${projectId}`).value,
            requiredSkills: document.getElementById(`editProjectSkills-${projectId}`).value.split(',').map(s => s.trim()).join(', '),
            startDate: new Date(document.getElementById(`editProjectStartDate-${projectId}`).value).toISOString(),
            endDate: new Date(document.getElementById(`editProjectEndDate-${projectId}`).value).toISOString()
        };

        const response = await fetch(`/projects/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData),
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to update project');
        showNotification('Project updated successfully');
        toggleEditForm(projectId);
        loadProjects();
    } catch (error) {
        console.error('Edit project error:', error);
        showNotification(error.message || 'Failed to update project');
    }
}


function formatDateTimeLocal(dateString) 
{
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function toggleEmployeeForm() 
{
    document.getElementById('addEmployeeForm').classList.toggle('hidden');
}


async function addEmployee(event) 
{
    checkAdminSession();
    event.preventDefault();
    try {
        const employeeData = {
            name: document.getElementById('employeeName').value,
            email: document.getElementById('employeeEmail').value,
            password: document.getElementById('employeePassword').value,
            role: "EMPLOYEE"
        };

        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData),
            credentials: 'include'
        });

        const result = await response.text();
        
        if (!response.ok) throw new Error(result || 'Failed to add employee');

        showNotification('Employee added successfully');
        toggleEmployeeForm();
        loadEmployees();
    } catch (error) {
        console.error('Add employee error:', error);
        showNotification(error.message || 'Failed to add employee');
    }
}