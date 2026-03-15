# 🚀 Quick Reference Card

**College Event Management System**  
**Version**: 1.0.0-SNAPSHOT  
**Last Updated**: March 15, 2026

---

## 🏃 Quick Start (60 seconds)

```bash
# 1. Setup Database
mysql -u root -p < event-manager-service/src/main/resources/init.sql

# 2. Start Backend
cd event-manager-service
mvn spring-boot:run

# 3. Start Frontend (in another terminal)
cd event-manager-ui
npm install
npm start

# 4. Access Application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# Swagger API Docs: http://localhost:8080/api/swagger-ui.html
```

---

## 📍 Key Endpoints

### Authentication
```
POST   /auth/register      - Register new student
POST   /auth/login         - Login (returns access & refresh tokens)
POST   /auth/refresh       - Get new access token
GET    /auth/me            - Current user info (requires auth)
POST   /auth/logout        - Logout
```

### Events (Coming Sprint 3-4)
```
GET    /events             - List all approved events
GET    /events/{id}        - Event details
POST   /events             - Create event (admin only)
PUT    /events/{id}        - Update event (admin only)
DELETE /events/{id}        - Delete event (admin only)
```

### Registrations (Coming Sprint 3-4)
```
POST   /registrations      - Register for event
GET    /registrations      - My registrations
DELETE /registrations/{id} - Cancel registration
```

---

## 🔐 Test Credentials

### Admin User
```
Email:    admin@college.edu
Password: Admin@123
```

### Sample Student
```
Email:    john@student.edu
Password: Admin@123
```

---

## 📋 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "statusCode": 200
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info",
  "statusCode": 400
}
```

---

## 🔑 JWT Token Format

### Access Token
```
Header: Authorization: Bearer <accessToken>
Expires: 24 hours
Contains: email, role claim
```

### Refresh Token
```
Header: Authorization: Bearer <refreshToken>
Expires: 7 days
Used to: Get new access token
```

---

## 🗂️ Project Structure

```
Backend:  event-manager-service/        (Spring Boot + MySQL)
Frontend: event-manager-ui/             (React)
Docs:     docs/                         (Requirements & specs)
Status:   STATUS.md                     (Real-time progress)
```

---

## 🔧 Configuration Files

### Database: `application.properties`
```
URL:      jdbc:mysql://localhost:3306/event_manager
Username: root
Password: root
```

### JWT: `application.properties`
```
Secret:               (configured)
Access Expiry:        86400000 (24h)
Refresh Expiry:       604800000 (7d)
```

---

## 📊 Database Schema

### Users
| Field | Type | Notes |
|-------|------|-------|
| id | BIGINT | PK |
| email | VARCHAR | UNIQUE |
| password | VARCHAR | BCrypt hashed |
| role | ENUM | STUDENT, ADMIN |
| accountStatus | ENUM | ACTIVE, INACTIVE, LOCKED |

### Events
| Field | Type | Notes |
|-------|------|-------|
| id | BIGINT | PK |
| title | VARCHAR | Event name |
| category | VARCHAR | Indexed |
| status | ENUM | PENDING, APPROVED, COMPLETED |
| capacity | INT | Max participants |
| organizer_id | BIGINT | FK to users |

### Registrations
| Field | Type | Notes |
|-------|------|-------|
| id | BIGINT | PK |
| student_id | BIGINT | FK to users |
| event_id | BIGINT | FK to events |
| attendanceStatus | ENUM | PENDING, ATTENDED, CANCELLED |

---

## 🧪 Testing Quick Commands

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=AuthServiceTest

# Build project
mvn clean install

# Check code issues
mvn verify
```

---

## 🐛 Common Fixes

| Issue | Solution |
|-------|----------|
| Port 8080 in use | Change `server.port` in application.properties |
| DB connection failed | Ensure MySQL running: `mysql -u root -p` |
| CORS error | Check `cors.allowed-origins` matches frontend URL |
| Password rejected | Must include: A-Z, a-z, 0-9, special char |
| Token expired | Use `/auth/refresh` endpoint |
| Account locked | Admin must unlock or wait 30 minutes |

---

## 📞 Important Files

| File | Purpose |
|------|---------|
| `STATUS.md` | Real-time progress tracking |
| `SETUP_GUIDE.md` | Detailed setup instructions |
| `SPRINT_1_2_SUMMARY.md` | What was accomplished |
| `docs/` | Requirements & specifications |
| `DEVELOPMENT_PLANNING.md` | 12-week sprint plan |

---

## 🎯 Current Sprint Status

**Sprint 1-2: Foundation & Setup** ✅ COMPLETE

- ✅ Backend entities & repositories
- ✅ Authentication service
- ✅ JWT security
- ✅ Database schema
- ✅ Exception handling

**Next: Sprint 3-4 - Event Management & Registration**

---

## 🔗 Useful Links

- Swagger API Docs: `http://localhost:8080/api/swagger-ui.html`
- Spring Boot Docs: `https://spring.io/projects/spring-boot`
- React Docs: `https://react.dev`
- JWT Docs: `https://jwt.io`

---

## 📧 Support

Check these files in order:
1. `STATUS.md` - Current status & blockers
2. `SETUP_GUIDE.md` - Setup issues
3. `docs/` - Feature specifications
4. `REQUIREMENTS.md` - System requirements

---

**Quick Ref v1.0** | Updated March 15, 2026
