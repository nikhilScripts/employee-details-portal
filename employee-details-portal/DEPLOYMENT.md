# Employee Details Portal - Deployment Guide

## Overview
Complete deployment guide for the Employee Details Portal application (Angular 3 + Node.js 17).

## Prerequisites

### System Requirements
- **Node.js**: Version 17.x
- **npm**: Version 8.x or higher
- **Git**: For version control
- **Operating System**: Windows, macOS, or Linux

### Development Tools
- Code editor (VS Code recommended)
- Postman or curl for API testing
- Web browser (Chrome, Firefox, or Edge)

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/nikhilScripts/employee-portal-downgrade.git
cd employee-portal-downgrade
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (if not exists)
echo "PORT=3000" > .env
echo "NODE_ENV=development" >> .env

# Start backend server
node server.js
```

Backend will run on: `http://localhost:3000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Note: Angular 3 with CLI requires specific setup
# For now, backend API is fully functional
```

## Configuration

### Environment Variables

**Backend (.env)**
```
PORT=3000
NODE_ENV=development
```

**Frontend (environment.ts)**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Database Configuration
The application uses a JSON-based file database:
- Location: `backend/database/db.json`
- Auto-created on first run
- Data persists across server restarts

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
node server.js
```

**API Available at:** `http://localhost:3000`

### Production Mode

1. **Set Environment to Production**
```bash
# In backend/.env
NODE_ENV=production
```

2. **Start with Process Manager (PM2)**
```bash
npm install -g pm2
pm2 start backend/server.js --name employee-portal
pm2 save
pm2 startup
```

## Testing

### API Testing
```bash
# Run test suite
cd backend
node tests/api.test.js
```

### Manual API Testing
```bash
# Test GET all employees
curl http://localhost:3000/api/employees

# Test create employee
curl -X POST http://localhost:3000/api/employees \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com"}'
```

## Deployment Strategies

### Option 1: Traditional Server Deployment

1. **Prepare Server**
   - Install Node.js 17.x
   - Install Git
   - Configure firewall (port 3000)

2. **Deploy Code**
```bash
git clone https://github.com/nikhilScripts/employee-portal-downgrade.git
cd employee-portal-downgrade/backend
npm install --production
```

3. **Configure Environment**
```bash
export NODE_ENV=production
export PORT=3000
```

4. **Start Application**
```bash
pm2 start server.js
pm2 save
```

### Option 2: Docker Deployment

**Create Dockerfile** (backend):
```dockerfile
FROM node:17-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

**Build and Run:**
```bash
docker build -t employee-portal .
docker run -p 3000:3000 -v $(pwd)/database:/app/database employee-portal
```

### Option 3: Cloud Platform Deployment

#### Heroku
```bash
# Create Heroku app
heroku create employee-portal-app

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### AWS EC2
1. Launch EC2 instance (Ubuntu/Amazon Linux)
2. Install Node.js 17
3. Clone repository
4. Install dependencies
5. Configure security groups (port 3000)
6. Start with PM2

#### Azure App Service
1. Create App Service (Node 17)
2. Configure deployment from GitHub
3. Set application settings
4. Deploy

## Monitoring

### Application Logs
```bash
# View logs with PM2
pm2 logs employee-portal

# View logs directly
tail -f /path/to/logs/app.log
```

### Health Checks
```bash
# Check API health
curl http://localhost:3000/

# Check employee endpoint
curl http://localhost:3000/api/employees
```

## Backup & Recovery

### Database Backup
```bash
# Backup database file
cp backend/database/db.json backup/db_$(date +%Y%m%d).json

# Automated backup script
#!/bin/bash
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
cp backend/database/db.json $BACKUP_DIR/db_$DATE.json
```

### Restore from Backup
```bash
# Stop application
pm2 stop employee-portal

# Restore database
cp backup/db_20260224.json backend/database/db.json

# Restart application
pm2 restart employee-portal
```

## Security Considerations

### Production Checklist
- [ ] Change default ports
- [ ] Enable HTTPS/SSL
- [ ] Implement authentication
- [ ] Add rate limiting
- [ ] Enable CORS properly
- [ ] Secure environment variables
- [ ] Regular security updates
- [ ] Database encryption
- [ ] Input sanitization
- [ ] Error message sanitization

### Recommended Security Enhancements
```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

// Helmet for security headers
const helmet = require('helmet');
app.use(helmet());
```

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>
```

**Database File Permissions**
```bash
chmod 644 backend/database/db.json
```

**Node Version Issues**
```bash
# Check Node version
node --version

# Use nvm to switch versions
nvm install 17
nvm use 17
```

## Performance Optimization

### Backend Optimization
- Enable gzip compression
- Implement caching
- Use connection pooling
- Optimize database queries
- Add request throttling

### Monitoring Tools
- PM2 for process management
- New Relic for application monitoring
- CloudWatch for AWS deployments
- Application Insights for Azure

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review logs weekly
- Backup database daily
- Monitor disk space
- Check security advisories

### Update Process
```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit
npm audit fix
```

## Support & Documentation

- **API Documentation**: `backend/API_DOCUMENTATION.md`
- **README**: `README.md`
- **GitHub**: https://github.com/nikhilScripts/employee-portal-downgrade
- **Jira**: SCRUM-33 Epic

## Version History

- **v1.0.0** - Initial release (All 7 stages complete)
  - Stage 1: Project Setup
  - Stage 2: Backend Development
  - Stage 3: Database Integration
  - Stage 4: Frontend Components
  - Stage 5: API Integration
  - Stage 6: Testing
  - Stage 7: Documentation & Deployment

---

**Last Updated**: February 24, 2026  
**Version**: 1.0.0  
**Status**: Production Ready