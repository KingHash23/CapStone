# Job Portal API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
```
Create a new user account.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "job_seeker | employer",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "job_seeker",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login
```
POST /auth/login
```
Login with existing credentials.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "job_seeker",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Job Seeker Endpoints

### Profile Management

#### Get Profile
```
GET /job-seeker/profile
```
Get the job seeker's profile.

Response:
```json
{
  "id": 1,
  "userId": 1,
  "title": "Software Engineer",
  "summary": "Experienced software engineer...",
  "experienceYears": 5,
  "educationLevel": "Bachelor's Degree",
  "skills": "JavaScript,React,Node.js",
  "resumeUrl": "path/to/resume.pdf"
}
```

#### Update Profile
```
POST /job-seeker/profile
```
Create or update job seeker profile.

Request Body:
```json
{
  "title": "Software Engineer",
  "summary": "Experienced software engineer...",
  "experienceYears": 5,
  "educationLevel": "Bachelor's Degree",
  "skills": ["JavaScript", "React", "Node.js"],
  "resumeUrl": "path/to/resume.pdf"
}
```

## Employer Endpoints

### Company Profile Management

#### Get Company Profile
```
GET /employer/company
```
Get the employer's company profile.

Response:
```json
{
  "id": 1,
  "employerId": 1,
  "companyName": "Tech Corp",
  "description": "Leading tech company...",
  "industry": "Technology",
  "website": "https://example.com",
  "location": "New York, USA"
}
```

#### Update Company Profile
```
POST /employer/company
```
Create or update company profile.

Request Body:
```json
{
  "companyName": "Tech Corp",
  "description": "Leading tech company...",
  "industry": "Technology",
  "website": "https://example.com",
  "location": "New York, USA"
}
```

## Job Management

### Get Jobs
```
GET /jobs
```
Get job listings with optional filters.

Query Parameters:
- title (string)
- location (string)
- jobType (string)
- industry (string)
- experienceLevel (string)
- minSalary (number)
- maxSalary (number)
- skills (string[])

Response:
```json
[
  {
    "id": 1,
    "title": "Software Engineer",
    "company_name": "Tech Corp",
    "description": "Job description...",
    "requirements": "Requirements...",
    "location": "New York, USA",
    "job_type": "full_time",
    "salary_range": "$80,000 - $100,000",
    "skills": "JavaScript,React,Node.js",
    "status": "open"
  }
]
```

### Create Job
```
POST /jobs
```
Create a new job posting (employers only).

Request Body:
```json
{
  "title": "Software Engineer",
  "description": "Job description...",
  "requirements": "Requirements...",
  "location": "New York, USA",
  "jobType": "full_time",
  "salaryRange": "$80,000 - $100,000",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### Update Job
```
PUT /jobs/:id
```
Update an existing job posting.

### Delete Job
```
DELETE /jobs/:id
```
Delete a job posting.

## Applications

### Submit Application
```
POST /applications/:jobId
```
Submit a job application.

Request Body:
```json
{
  "coverLetter": "Application cover letter..."
}
```

### Get My Applications
```
GET /applications/my-applications
```
Get user's job applications.

Response:
```json
[
  {
    "id": 1,
    "job_title": "Software Engineer",
    "company_name": "Tech Corp",
    "status": "pending",
    "created_at": "2024-03-17T10:00:00Z"
  }
]
```

## Analytics

### Get User Analytics
```
GET /analytics/user
```
Get user-specific analytics.

Response:
```json
{
  "applications": {
    "total_applications": 10,
    "successful_applications": 3,
    "success_rate": 0.3
  },
  "applicationTrends": [
    {
      "date": "2024-03-17",
      "count": 2
    }
  ]
}
```

### Get System Analytics (Admin Only)
```
GET /analytics/system
```
Get system-wide analytics.

Response:
```json
{
  "totalCounts": {
    "total_job_seekers": 100,
    "total_employers": 20,
    "total_jobs": 50,
    "total_applications": 200
  },
  "applicationStats": {
    "total": 200,
    "accepted": 80,
    "rejected": 40,
    "successRate": "40.00"
  },
  "jobTrends": [],
  "applicationTrends": [],
  "matchMetrics": {
    "acceptance_rate": 0.4,
    "jobs_with_applications": 45,
    "active_job_seekers": 75
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
``` 