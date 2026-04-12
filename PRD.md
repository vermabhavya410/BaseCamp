# 📘 Project Camp Backend - PRD

## 1. Product Overview

**Product Name:** Project Camp Backend  
**Version:** 2.1.0  
**Product Type:** Backend API for Project Management System  

Project Camp Backend is a RESTful API designed to support collaborative project management. It enables teams to manage projects, tasks, subtasks, and notes with a secure authentication system and role-based access control.


---

## 2. Target Users

- **Project Administrator (Owner)**
  - Create and manage projects  
  - Manage team members and roles  
  - Full control over project  

- **Project Admin**
  - Manage tasks and subtasks  
  - Handle project-level operations  

- **Team Member**
  - View projects and tasks  
  - Update task and subtask status  

---

## 3. Core Features

### 3.1 Authentication (Existing Module)

- User registration with email verification  
- Login with JWT authentication  
- Logout functionality  
- Change password  
- Forgot / reset password  
- Refresh access token  

---

### 3.2 Project Management

- Create project  
- List user projects  
- Get project details  
- Update project (**Owner only**)  
- Delete project (**Soft delete**)  

#### Enhancements:
- Pagination (`page`, `limit`)  
- Search by project name  
- Member count  

---

### 3.3 Team Member Management

- Add member via email  
- List project members  
- Update member role (**Owner only**)  
- Remove member (**Owner only**)  

---

### 3.4 Task Management

- Create task  
- List tasks within project  
- Get task details  
- Update task  
- Delete task (**Soft delete**)  

#### Features:
- Assign to one or multiple users  
- Status:
  - `todo`
  - `in_progress`
  - `done`  
- Priority:
  - `low`, `medium`, `high`  
- Due date support  
- File attachments (multiple)  

---

### 3.5 Subtask Management

- Create subtask  
- Update subtask  
- Delete subtask (**Admin / Project Admin only**)  
- Mark subtask as complete  

---

### 3.6 Project Notes

- Create note (**Admin / Project Admin**)  
- List notes  
- Get note details  
- Update note  
- Delete note (**Admin only**)  

---

### 3.7 System Health

- Health check endpoint for API monitoring  

---

## 4. API Endpoints

### Authentication Routes (`/api/v1/auth`)

POST /register  
POST /login  
POST /logout  
GET /current-user  
POST /change-password  
POST /refresh-token  
GET /verify-email/:verificationToken  
POST /forgot-password  
POST /reset-password/:resetToken  
POST /resend-email-verification  

---

### Project Routes (`/api/v1/projects`)

GET /  
POST /  

GET /:projectId  
PUT /:projectId  
DELETE /:projectId  

GET /:projectId/members  
POST /:projectId/members  
PUT /:projectId/members/:userId  
DELETE /:projectId/members/:userId  

---

### Task Routes (`/api/v1/tasks`)

GET /:projectId  
POST /:projectId  

GET /:projectId/t/:taskId  
PUT /:projectId/t/:taskId  
DELETE /:projectId/t/:taskId  

POST /:projectId/t/:taskId/subtasks  
PUT /:projectId/st/:subTaskId  
DELETE /:projectId/st/:subTaskId  

---

### Note Routes (`/api/v1/notes`)

GET /:projectId  
POST /:projectId  

GET /:projectId/n/:noteId  
PUT /:projectId/n/:noteId  
DELETE /:projectId/n/:noteId  

---

### Health Check

GET /api/v1/healthcheck  

---

## 5. Data Models (Conceptual)

### Project
- name  
- description  
- createdBy  
- isDeleted  
- deletedAt  

---

### ProjectMember
- userId  
- projectId  
- role (`admin`, `project_admin`, `member`)  

---

### Task
- title  
- description  
- projectId  
- assignedTo (array of userIds)  
- status (`todo`, `in_progress`, `done`)  
- priority (`low`, `medium`, `high`)  
- dueDate  
- attachments  
- createdBy  
- isDeleted  

---

### Subtask
- title  
- taskId  
- isCompleted  
- completedBy  

---

### Note
- content  
- projectId  
- createdBy  

---

## 6. Permissions Matrix

| Feature | Owner | Project Admin | Member |
|--------|------|--------------|--------|
| Create Project | ✓ | ✗ | ✗ |
| Update/Delete Project | ✓ | ✗ | ✗ |
| Manage Members | ✓ | ✗ | ✗ |
| Create/Update Tasks | ✓ | ✓ | ✗ |
| View Tasks | ✓ | ✓ | ✓ |
| Update Subtasks | ✓ | ✓ | ✓ |
| Create/Delete Subtasks | ✓ | ✓ | ✗ |
| Manage Notes | ✓ | ✓ | ✗ |
| View Notes | ✓ | ✓ | ✓ |

---

## 7. Security Features

- JWT-based authentication  
- Role-based authorization middleware  
- Input validation (Zod)  
- Email verification  
- Secure password reset  
- File upload security (Multer)  
- CORS configuration  
- Rate limiting (recommended)  

---

## 8. File Management

- Multiple file attachments per task  

### Storage:
- Development: Local (`public/images`)  
- Production: Cloud storage (AWS S3 / Cloudinary)  

### Metadata:
- File URL  
- MIME type  
- File size  

---

## 9. Success Criteria

- Secure authentication system  
- Proper role-based access control  
- Complete project and task workflow  
- Scalable backend structure  
- File attachment support  
- Clean and maintainable API design  