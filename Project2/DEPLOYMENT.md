# Deployment Guide

## Prerequisites

### System Requirements
- Node.js v18.x or higher
- MySQL v8.x or higher
- npm v9.x or higher
- Git

### Environment Setup
1. Clone the repository:
```bash
git clone [repository-url]
cd job-portal
```

2. Create environment files:

`.env` for development:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=job_portal_db

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880 # 5MB

# Analytics Configuration
ANALYTICS_RETENTION_DAYS=30
```

`.env.production` for production:
```env
# Server Configuration
PORT=80
NODE_ENV=production

# Database Configuration
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=job_portal_db

# JWT Configuration
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_DIR=/var/www/uploads
MAX_FILE_SIZE=5242880 # 5MB

# Analytics Configuration
ANALYTICS_RETENTION_DAYS=90
```

## Development Setup

1. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

2. Set up the database:
```bash
# Create database and tables
mysql -u root -p < server/database/schema.sql

# Seed initial data (optional)
mysql -u root -p < server/database/seed.sql
```

3. Start development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend development server (from client directory)
npm start
```

## Production Deployment

### Server Setup

1. Install Node.js and MySQL on your production server:
```bash
# Update package list
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server
```

2. Secure MySQL installation:
```bash
sudo mysql_secure_installation
```

3. Create production database and user:
```sql
CREATE DATABASE job_portal_db;
CREATE USER 'job_portal_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON job_portal_db.* TO 'job_portal_user'@'localhost';
FLUSH PRIVILEGES;
```

### Application Deployment

1. Clone and build the application:
```bash
# Clone repository
git clone [repository-url] /var/www/job-portal
cd /var/www/job-portal

# Install dependencies
cd server
npm install --production

cd ../client
npm install
npm run build
```

2. Set up Nginx as reverse proxy:

Install Nginx:
```bash
sudo apt install nginx
```

Configure Nginx (`/etc/nginx/sites-available/job-portal`):
```nginx
server {
    listen 80;
    server_name your_domain.com;

    # Frontend
    location / {
        root /var/www/job-portal/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # File uploads
    location /uploads {
        alias /var/www/uploads;
        client_max_body_size 5M;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/job-portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

3. Set up PM2 for process management:
```bash
# Install PM2
sudo npm install -g pm2

# Start the application
cd /var/www/job-portal/server
pm2 start index.js --name "job-portal"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### SSL Configuration

1. Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d your_domain.com
```

### Monitoring and Maintenance

1. Monitor application logs:
```bash
# View PM2 logs
pm2 logs job-portal

# View Nginx access logs
tail -f /var/log/nginx/access.log

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

2. Setup automated backups:

Create backup script (`/etc/cron.daily/job-portal-backup`):
```bash
#!/bin/bash

# Set variables
BACKUP_DIR="/var/backups/job-portal"
MYSQL_USER="job_portal_user"
MYSQL_PASSWORD="your_password"
DB_NAME="job_portal_db"
DATE=$(date +%Y%m%d)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u $MYSQL_USER -p$MYSQL_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /var/www/uploads

# Remove backups older than 7 days
find $BACKUP_DIR -type f -mtime +7 -exec rm {} \;
```

Make the script executable:
```bash
sudo chmod +x /etc/cron.daily/job-portal-backup
```

3. Setup monitoring (optional):
```bash
# Install and configure monitoring tools
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Security Considerations

1. Configure firewall:
```bash
# Allow only necessary ports
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
sudo ufw enable
```

2. Set up rate limiting in Nginx:

Add to Nginx configuration:
```nginx
http {
    limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;

    server {
        location /api {
            limit_req zone=one burst=5 nodelay;
            # ... existing configuration ...
        }
    }
}
```

3. Regular security updates:
```bash
# Update system packages
sudo apt update
sudo apt upgrade

# Update npm packages
npm audit
npm audit fix
```

## Troubleshooting

### Common Issues

1. Application not starting:
- Check logs: `pm2 logs`
- Verify environment variables
- Check port availability: `netstat -tulpn`

2. Database connection issues:
- Verify MySQL service: `systemctl status mysql`
- Check credentials in `.env`
- Test connection manually: `mysql -u user -p`

3. File upload issues:
- Check directory permissions
- Verify upload directory exists
- Check Nginx client_max_body_size

### Support

For additional support:
1. Check the project's issue tracker
2. Review documentation
3. Contact the development team 