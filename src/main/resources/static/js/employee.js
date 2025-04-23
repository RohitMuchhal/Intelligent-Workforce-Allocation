
document.addEventListener("DOMContentLoaded", async () => {
  await checkSessionAndFetchUser();
  showView('assignedProjects');
  loadAssignedProjects();
  setupLeaveForm();
  loadProfile();
  loadLeaves();
});

async function checkSessionAndFetchUser() 
{
  try 
  {
        const response = await fetch("/auth/current", {
        method: "GET",
        credentials: "include"
        });
        if (!response.ok) throw new Error("Not authenticated");
      
        const userData = await response.json();
        sessionStorage.setItem("employeeId", userData.employeeId);
        sessionStorage.setItem("userRole", userData.role);
        sessionStorage.setItem("userName", userData.name);
        sessionStorage.setItem("userEmail", userData.email);

        document.getElementById("employeeName").textContent = userData.name;
        document.getElementById("employeeRole").textContent = userData.role;
  } 
  catch (error) 
  {
       alert("Please login first");
       window.location.href = "login.html";
  }
}


function showView(viewId) 
{

  document.querySelectorAll('.view-section').forEach(section => {
      section.style.display = 'none';
  });
  
  const section = document.getElementById(viewId);
  if (section) {
      section.style.display = 'block';
  }
  
 
  switch(viewId) {
      case 'assignedProjects':
          loadAssignedProjects();
          break;
      case 'profile':
          loadProfile();
          break;
  }
}



async function loadAssignedProjects() 
{
  const employeeId = sessionStorage.getItem("employeeId");
  if (!employeeId) {
      console.error("No employee ID found");
      return;
  }

  try {
      const response = await fetch("/projects", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load projects");
      
      const allProjects = await response.json();
      const projectsGrid = document.getElementById("projectsGrid");
      projectsGrid.innerHTML = ''; 

      const assignedProjects = allProjects.filter(project => 
          project.assignedEmployees?.some(employee => employee.id == employeeId)
      );

      if (assignedProjects.length === 0) {
          projectsGrid.innerHTML = '<li class="text-gray-600">No assigned projects</li>';
          return;
      }

    assignedProjects.forEach(project => {
        const card = document.createElement("div");
        card.className = "bg-white p-6 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow";
    
        
        const header = document.createElement("div");
        header.className = "flex justify-between items-start mb-4";
    
        const title = document.createElement("h3");
        title.className = "text-xl font-semibold text-gray-800";
        title.textContent = project.name || "Unnamed Project";

        const details = document.createElement("div");
    details.className = "space-y-2 text-sm";

    const description = document.createElement("p");
    description.className = "text-gray-600";
    description.innerHTML = `<span class="font-semibold text-gray-800">Description:</span> ${project.description || "No description available"}`;

    const dates = document.createElement("p");
    dates.className = "text-gray-600";
    dates.innerHTML = `<span class="font-semibold text-gray-800">Duration:</span> 
        ${project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not specified'} 
        - 
        ${project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not specified'}`;

    const skills = document.createElement("div");
    skills.className = "mt-2";
    skills.innerHTML = `<p class="font-semibold text-gray-800 mb-1">Required Skills:</p>`;
    
    const skillsList = document.createElement("div");
    skillsList.className = "flex flex-wrap gap-2";
    
    if (project.requiredSkills) {
        const skillsArray = project.requiredSkills.split(', ');
        
        skillsArray.forEach(skill => {
            const skillBadge = document.createElement("span");
            skillBadge.className = "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs";
            skillBadge.textContent = skill.trim();
            skillsList.appendChild(skillBadge);
        });
    } else {
        skillsList.textContent = "No specific skills required";
    }
    
    skills.appendChild(skillsList);

        const today=new Date();
        const endDate=new Date(project.endDate);
        const isActive=endDate>today;

        const status = document.createElement("span");
        status.className = `px-3 py-1 rounded-full text-sm ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`;
        status.textContent = isActive ? 'Active' : 'Completed';


       
        const teamContainer = document.createElement("div");
        teamContainer.className = "mt-4 hidden"; 
    
        const teamButton = document.createElement("button");
        teamButton.className = "bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors mt-3";
        teamButton.textContent = "View Team";
        teamButton.onclick = async () => {
            try {
                const response = await fetch(`/projects/${project.id}`);
                const projectData = await response.json();
                
                teamContainer.innerHTML = '';
            
                const teamList = document.createElement("ul");
                teamList.className = "space-y-2";
                
                projectData.assignedEmployees?.forEach(employee => {
                    const li = document.createElement("li");
                    li.className = "flex justify-between items-center bg-gray-50 p-3 rounded";
                    
                    const name = document.createElement("span");
                    name.textContent = employee.name;
                    
                    const connectButton = document.createElement("button");
                    connectButton.className = "bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm";
                    connectButton.textContent = "Connect";
                    
                    li.appendChild(name);
                    li.appendChild(connectButton);
                    teamList.appendChild(li);
                });
    
                teamContainer.appendChild(teamList);
                teamContainer.classList.remove('hidden');
            } catch (error) {
                console.error('Error fetching team:', error);
            }
        };

        header.appendChild(title);
        header.appendChild(status);
        details.appendChild(description);
        details.appendChild(dates);
        skills.appendChild(skillsList);
        details.appendChild(skills)
        
        card.appendChild(header);
        card.appendChild(details);
        card.appendChild(teamContainer);
        card.appendChild(teamButton);
    
        projectsGrid.appendChild(card);
    });
  } catch (error) {
      console.error("Error loading assigned projects:", error);
      projectsGrid.innerHTML = 
          '<li class="text-red-500">Error loading projects</li>';
  }
}

function setupLeaveForm() 
{
  const form = document.getElementById("leaveForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const employeeId = sessionStorage.getItem("employeeId");
    if (!employeeId) {
        alert("Please login first");
        return;
    }
    
    const formData = {
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value
    };

    // Basic presence check
    if (!formData.startDate || !formData.endDate) {
        alert("Please select both start and end dates");
        return;
    }

    // Parse dates in local timezone
    const parseDateLocal = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return new Date(year, month - 1, day);
    };

    const startDate = parseDateLocal(formData.startDate);
    const endDate = parseDateLocal(formData.endDate);

    // Validate date objects
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert("Invalid date values");
        return;
    }

    // Date comparison validations
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    if (startDate > endDate) {
        alert("Start date cannot be after end date");
        return;
    }

    if (startDate < today) {
        alert("Start date cannot be in the past");
        return;
    }

    // Calculate duration in days
    const timeDiff = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    // Maximum leave duration check
    const maxLeaveDays = 30;
    if (diffDays > maxLeaveDays) {
        alert(`Leave duration cannot exceed ${maxLeaveDays} days`);
        return;
    }

    // Submit if all validations pass
    try {
        const response = await fetch(`/leaves/${employeeId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include"
        });
        
        if (!response.ok) throw new Error("Leave request failed");
        
        alert("Leave Submitted");
        loadLeaves();
        form.reset();
    } catch (error) {
        console.error("Leave error:", error);
        alert(error.message || "Failed to submit leave request");
    }
});
}


async function loadProfile() {
  const employeeId = sessionStorage.getItem("employeeId");
  if (!employeeId) {
      console.error("No employee ID found");
      return;
  }

  try {
      const response = await fetch(`/employees/${employeeId}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to load profile");
      
      const profile = await response.json();
      if (!profile) throw new Error("No profile data received");

      document.getElementById("profileName").textContent = profile.name || "Not available";
      document.getElementById("profileEmail").textContent = profile.email || "Not available";

      
      let skillsText;
      if (Array.isArray(profile.skills)) {
          skillsText = profile.skills.join(", ");
      } else if (typeof profile.skills === 'string') {
          skillsText = profile.skills;
      } else {
          skillsText = "No skills listed";
      }
      document.getElementById("profileSkills").textContent = skillsText;
  } catch (error) {
      console.error("Error loading profile:", error);
      document.getElementById("profileName").textContent = "Error loading profile";
      document.getElementById("profileSkills").textContent = "Error loading skills";
  }
}

function showAddSkillForm() 
{
    const form = document.getElementById("skillAddForm");
    const select = document.getElementById("skillSelect");
    
    form.classList.remove("hidden");
    select.selectedIndex = 0; 
    select.focus();
}

function hideAddSkillForm() {
    const form = document.getElementById("skillAddForm");
    const select = document.getElementById("skillSelect");
    
    form.classList.add("hidden");
    select.selectedIndex = 0; 
}


async function addSkill() {
    const select = document.getElementById("skillSelect");
    const newSkill = select.value.trim();

    if (!newSkill) {
        alert("Please select a skill");
        return;
    }

    const employeeId = sessionStorage.getItem("employeeId");
    if (!employeeId) {
        alert("Please login first");
        return;
    }

    try {
        const response = await fetch(`/employees/${employeeId}/add-skill`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skill: newSkill }),
            credentials: "include"
        });

        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Failed to add skill");
        }

        alert("Skill added successfully!");
        loadProfile();
        hideAddSkillForm(); 
        
    } catch (error) {
        console.error("Error adding skill:", error);
        alert(error.message || "Failed to add skill");
    }
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function logout() {
  fetch("/auth/logout", { 
      method: "POST",
      credentials: "include"
  })
  .then(() => {
      sessionStorage.clear();
      window.location.href = "login.html";
  })
  .catch(error => {
      console.error("Logout error:", error);
      sessionStorage.clear();
      window.location.href = "login.html";
  });
}


async function loadLeaves() {
  const employeeId = sessionStorage.getItem("employeeId");
  if (!employeeId) return;

  try {
      const response = await fetch(`/leaves/employee/${employeeId}`, {
          credentials: "include"
      });
      
      if (!response.ok) throw new Error("Failed to load leaves");
      
      const leaves = await response.json();
      const leavesList = document.getElementById("leavesList");
      leavesList.innerHTML = "";

      if (!leaves || leaves.length === 0) {
          leavesList.innerHTML = `
              <tr>
                  <td colspan="3" class="py-4 px-4 border text-center text-gray-600">
                      No leave applications found
                  </td>
              </tr>`;
          return;
      }

      leaves.forEach(leave => {
          const row = document.createElement("tr");
          row.className = "hover:bg-gray-50";
          row.innerHTML = `
              <td class="py-2 px-4 border">${formatDate(leave.startDate)}</td>
              <td class="py-2 px-4 border">${formatDate(leave.endDate)}</td>
              <td class="py-2 px-4 border">
                  <span class="px-2 py-1 rounded-full text-xs 
                      ${getStatusClass(leave.status)}">
                      ${leave.status}
                  </span>
              </td>`;
          leavesList.appendChild(row);
      });
  } catch (error) {
      console.error("Error loading leaves:", error);
      document.getElementById("leavesList").innerHTML = `
          <tr>
              <td colspan="3" class="py-4 px-4 border text-center text-red-500">
                  Error loading leaves: ${error.message}
              </td>
          </tr>`;
  }
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function getStatusClass(status) {
  switch(status?.toLowerCase()) {
      case 'approved':
          return 'bg-green-100 text-green-800';
      case 'pending':
          return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
          return 'bg-red-100 text-red-800';
      default:
          return 'bg-gray-100 text-gray-800';
  }
}