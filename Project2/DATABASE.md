# Database Schema Documentation

## Overview
The job portal uses MySQL as its primary database. The schema is designed to support job seekers, employers, job postings, applications, and analytics data.

## Tables

### Users
Stores user authentication and basic profile information.
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('job_seeker', 'employer', 'admin') NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### JobSeekerProfiles
Stores detailed information about job seekers.
```sql
CREATE TABLE job_seeker_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(100),
    summary TEXT,
    experience_years INT,
    education_level VARCHAR(100),
    skills TEXT,
    resume_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### CompanyProfiles
Stores information about employer companies.
```sql
CREATE TABLE company_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employer_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Jobs
Stores job postings.
```sql
CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employer_id INT NOT NULL,
    company_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location VARCHAR(255),
    job_type ENUM('full_time', 'part_time', 'contract', 'internship') NOT NULL,
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    skills TEXT,
    status ENUM('open', 'closed', 'draft') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES company_profiles(id) ON DELETE CASCADE
);
```

### Applications
Stores job applications.
```sql
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT NOT NULL,
    job_seeker_id INT NOT NULL,
    cover_letter TEXT,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (job_seeker_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Analytics
Stores system analytics data.
```sql
CREATE TABLE analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    metric_name VARCHAR(100) NOT NULL,
    metric_value JSON NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### UserAnalytics
Stores user-specific analytics data.
```sql
CREATE TABLE user_analytics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value JSON NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Indexes

### Performance Optimization Indexes
```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Jobs table indexes
CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_type ON jobs(job_type);

-- Applications table indexes
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_seeker ON applications(job_seeker_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Analytics indexes
CREATE INDEX idx_analytics_metric ON analytics(metric_name);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp);

-- User analytics indexes
CREATE INDEX idx_user_analytics_user ON user_analytics(user_id);
CREATE INDEX idx_user_analytics_metric ON user_analytics(metric_name);
CREATE INDEX idx_user_analytics_timestamp ON user_analytics(timestamp);
```

## Relationships

### One-to-One Relationships
- User -> JobSeekerProfile (for job seekers)
- User -> CompanyProfile (for employers)

### One-to-Many Relationships
- User (employer) -> Jobs
- CompanyProfile -> Jobs
- User (job seeker) -> Applications
- Job -> Applications

## Data Integrity

### Cascade Delete Rules
- When a user is deleted:
  - Their profile (job seeker or company) is deleted
  - Their job postings are deleted (if employer)
  - Their applications are deleted (if job seeker)
  - Their analytics data is deleted

- When a job is deleted:
  - All applications for that job are deleted

### Constraints
- Email addresses must be unique
- Required fields are enforced through NOT NULL constraints
- Enum fields ensure valid values for:
  - User roles
  - Job types
  - Application status
  - Job status

## Backup and Recovery
The database should be backed up regularly using MySQL's built-in backup tools:
```bash
# Full backup
mysqldump -u [username] -p [database_name] > backup.sql

# Incremental backup
mysqldump -u [username] -p [database_name] --single-transaction > incremental_backup.sql
``` 