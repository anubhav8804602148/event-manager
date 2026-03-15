# College Event Management System - Setup & Development Guide

**Version**: 1.0  
**Last Updated**: March 15, 2026  
**Status**: Sprint 1-2 Complete (Authentication & Entities Ready)

---

## 📋 Project Structure

```
event_manager/
├── event-manager-service/          # Spring Boot Backend
│   ├── src/main/java/com/shaan/event/manager/service/
│   │   ├── controller/             # REST API Controllers
│   │   ├── service/                # Business Logic
│   │   ├── repository/             # Data Access Layer
│   │   ├── entity/                 # JPA Entities
│   │   ├── dto/                    # Data Transfer Objects
│   │   ├── exception/              # Custom Exceptions
│   │   ├── security/               # JWT & Security
│   │   ├── config/                 # Spring Configurations
│   │   └── EventManagerServiceApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties   # Configuration
│   │   └── init.sql               # Database initialization
│   └── pom.xml
│
├── event-manager-ui/               # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
│
├── docs/                           # Documentation
├── README.md
├── REQUIREMENTS.md
├── DEVELOPMENT_PLANNING.md
└── STATUS.md                       # Current implementation status
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Java**: JDK 21 or higher
- **Node.js**: 18.0 or higher  
- **MySQL**: 8.0 or higher
- **Maven**: 3.8 or higher
- **npm**: 8.0 or higher
- **Git**: For version control

### 1. Backend Setup (Spring Boot)

#### Step 1: Navigate to Backend Directory
```bash
cd event-manager-service
```

#### Step 2: Create Database
```bash
# Open MySQL client
mysql -u root -p

# Run the initialization script
source src/main/resources/init.sql;

# Verify
SHOW DATABASES;
USE event_manager;
SHOW TABLES;
```

**Default Database Credentials** (configured in `application.properties`):
- Host: `localhost:3306`
- Database: `event_manager`
- Username: `root`
- Password: `root`

#### Step 3: Build the Project
```bash
mvn clean install
```

#### Step 4: Run the Application
```bash
mvn spring-boot:run
```

The application will start at `http://localhost:8080/api`

#### Verify Backend is Running:
```bash
# Test the health endpoint
curl http://localhost:8080/api/auth/me

# You should get 401 Unauthorized (expected, no token)
```

---

### 2. Frontend Setup (React)

#### Step 1: Navigate to Frontend Directory
```bash
cd event-manager-ui
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Start Development Server
```bash
npm start
```

The application will start at `http://localhost:3000`

---

## 🔐 Authentication Test

### Using Postman or cURL

#### 1. Register a New User
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "testuser@college.edu",
  "password": "TestPassword123!",
  "firstName": "Test",
  "lastName": "User",
  "department": "Computer Science",
  "phone": "9876543210"
}
```

#### 2. Login
```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "testuser@college.edu",
  "password": "TestPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "user": {
      "id": 1,
      "email": "testuser@college.edu",
      "firstName": "Test",
      "lastName": "User",
      "role": "STUDENT",
      "accountStatus": "ACTIVE"
    }
  },
  "statusCode": 200
}
```

#### 3. Get Current User (with Token)
```bash
GET http://localhost:8080/api/auth/me
Authorization: Bearer <accessToken>
```

---

## 📚 Available Endpoints (Implemented)

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/auth/register` | Register new student | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/refresh` | Refresh access token | ✅ |
| GET | `/api/auth/me` | Get current user info | ✅ |
| POST | `/api/auth/logout` | Logout user | ✅ |

---

## 🗄️ Database Schema

### Users Table
```sql
- id (PK, Auto-increment)
- email (Unique, indexed)
- password (BCrypt hashed)
- firstName, lastName
- phone, department
- role (STUDENT, ADMIN)
- accountStatus (ACTIVE, INACTIVE, LOCKED)
- failedLoginAttempts
- createdAt, updatedAt (audit timestamps)
```

### Events Table
```sql
- id (PK, Auto-increment)
- title, description, category
- startDateTime, endDateTime
- location, capacity
- registrationDeadline
- status (PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED)
- organizer_id (FK to users)
- createdAt, updatedAt
```

### Registrations Table
```sql
- id (PK, Auto-increment)
- student_id (FK to users)
- event_id (FK to events)
- registrationDate
- attendanceStatus (PENDING, ATTENDED, CANCELLED, REMOVED)
- createdAt, updatedAt
```

---

## 🔒 Security Features

### JWT Configuration
- **Algorithm**: HS512
- **Access Token Expiry**: 24 hours
- **Refresh Token Expiry**: 7 days
- **Secret**: Configured in `application.properties`

### Password Policy
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 digit
- At least 1 special character
- Hashed with BCrypt (10 rounds)

### Account Security
- Account lockout after 5 failed login attempts
- 30-minute lockout duration
- Failed attempts tracking
- CORS enabled for localhost:3000 and localhost:5173

---

## 📝 Configuration Files

### Backend Configuration: `application.properties`

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/event_manager
spring.datasource.username=root
spring.datasource.password=root

# JWT
jwt.expiration=86400000           # 24 hours
jwt.refresh-expiration=604800000  # 7 days

# CORS
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

---

## 🧪 Testing the System

### Unit Testing
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthServiceTest

# Run with coverage
mvn test jacoco:report
```

### Manual Testing with Postman
1. Import Postman collection (to be created)
2. Set variables: `base_url=http://localhost:8080/api`
3. Test endpoints in order: Register → Login → Refresh Token → Get Current User

---

## 🐛 Common Issues & Solutions

### Issue: "Connection refused" on database
**Solution:**
```bash
# Ensure MySQL is running
mysql -u root -p

# Check if event_manager database exists
SHOW DATABASES;
```

### Issue: "Port 8080 already in use"
**Solution:**
```bash
# Kill process using port 8080 (Windows)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in application.properties
server.port=8081
```

### Issue: "Invalid password" errors
**Solution:**
```bash
# Ensure password meets requirements:
# - 8+ characters
# - 1 uppercase (A-Z)
# - 1 lowercase (a-z)
# - 1 digit (0-9)
# - 1 special character (!@#$%^&*)

# Example: "ValidPass123!"
```

### Issue: "CORS error" on frontend
**Solution:**
Ensure CORS configuration in `application.properties` matches your frontend URL:
```properties
cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

---

## 📊 Current Sprint Status

**Sprint 1-2: Foundation & Setup** ✅ COMPLETE (65% overall)

### Completed:
- ✅ Maven project with all dependencies
- ✅ JPA entities with relationships
- ✅ Repository layer with custom queries
- ✅ DTOs with validation
- ✅ JWT security components
- ✅ Exception handling
- ✅ AuthService & AuthController
- ✅ Database initialization script
- ✅ Spring Security configuration

### Next (Sprint 3-4):
- EventService & EventController
- RegistrationService
- Admin dashboard endpoints
- Frontend React setup
- Integration tests

---

## 📖 Documentation Files

- `docs/BACKEND_REQUIREMENTS.md` - API design and architecture
- `docs/DATABASE_REQUIREMENTS.md` - Schema and optimization
- `docs/SYSTEM_FEATURES.md` - Feature specifications
- `docs/SYSTEM_WORKFLOW.md` - User workflows
- `DEVELOPMENT_PLANNING.md` - 12-week sprint plan
- `STATUS.md` - Real-time progress tracking

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request for review

---

## 📞 Support

For issues or questions:
1. Check the `STATUS.md` for current implementation status
2. Review `docs/` folder for detailed specifications
3. Check `DEVELOPMENT_PLANNING.md` for sprint timeline

---

**Last Updated**: March 15, 2026  
**Version**: 1.0.0-SNAPSHOT
