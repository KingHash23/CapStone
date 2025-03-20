# Job Portal Platform

A comprehensive job posting and application platform built with modern web technologies. This platform connects employers with job seekers through an intuitive interface and intelligent matching system.

## Features

### For Job Seekers
- Create and manage professional profiles
- Upload and manage resumes
- Search and filter job listings
- Receive personalized job recommendations
- Track application status
- View application analytics and success rates

### For Employers
- Create and manage company profiles
- Post and manage job listings
- Review and manage applications
- Access candidate recommendations
- View hiring analytics and trends

## Technology Stack

### Frontend
- React.js 18.x
- Material-UI (MUI) for UI components
- React Router for navigation
- Recharts for analytics visualization
- Axios for API communication

### Backend
- Node.js 16.x
- Express.js 4.x
- MySQL 8.x for database
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd job-portal
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Configure environment variables:
Create a `.env` file in the server directory with the following:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=job_portal
JWT_SECRET=your_jwt_secret
```

4. Set up the database:
```bash
mysql -u root -p < server/config/database.sql
```

5. Install frontend dependencies:
```bash
cd ../client
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
job-portal/
├── client/                 # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/       # React context providers
│       ├── pages/         # Page components
│       └── utils/         # Utility functions
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── index.js         # Main server file
└── README.md
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user (job seeker or employer)
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "job_seeker",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /api/auth/login
Login with existing credentials
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Job Endpoints

#### GET /api/jobs
Get all job listings with optional filters
```
Query parameters:
- title: string
- location: string
- jobType: string
- industry: string
- experienceLevel: string
- minSalary: number
- maxSalary: number
- skills: string[]
```

#### POST /api/jobs
Create a new job posting (requires employer authentication)
```json
{
  "title": "Software Engineer",
  "description": "Job description...",
  "requirements": "Requirements...",
  "location": "City, Country",
  "jobType": "full_time",
  "salaryRange": "$80,000 - $100,000",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

### Application Endpoints

#### POST /api/applications/:jobId
Submit a job application
```json
{
  "coverLetter": "Application cover letter..."
}
```

#### GET /api/applications/my-applications
Get user's job applications

### Analytics Endpoints

#### GET /api/analytics/user
Get user-specific analytics
```json
Response:
{
  "applications": {
    "total_applications": number,
    "successful_applications": number,
    "success_rate": number
  },
  "applicationTrends": [
    {
      "date": string,
      "count": number
    }
  ]
}
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Protected API endpoints
- Secure password storage

## Performance Optimizations

- Database query optimization
- Indexed database fields
- API response caching
- Efficient data fetching
- Optimized frontend rendering

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 