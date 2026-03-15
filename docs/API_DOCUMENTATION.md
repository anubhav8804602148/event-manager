# 📡 College Event Management System - API Documentation

**Version**: 1.0.1  
**Status**: Sprint 3-4 Complete (26 Endpoints)
**Base URL**: `http://localhost:8080/api`

---

## 🔑 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

### Token Acquisition

1. **Register**: `POST /auth/register`
2. **Login**: `POST /auth/login` → Returns `accessToken` and `refreshToken`
3. **Refresh**: `POST /auth/refresh` → Get new `accessToken`

---

## 📋 API Endpoints

### 🔐 Authentication Endpoints

#### 1. Register New User
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "email": "student@college.edu",
  "password": "Pass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "department": "Computer Science"
}

Response (201 Created):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 3,
    "email": "student@college.edu",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "accountStatus": "ACTIVE"
  },
  "statusCode": 201
}
```

#### 2. Login
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "student@college.edu",
  "password": "Pass123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMi...",
    "refreshToken": "eyJhbGciOiJIUzUxMi...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "user": {
      "id": 3,
      "email": "student@college.edu",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT",
      "accountStatus": "ACTIVE"
    }
  },
  "statusCode": 200
}
```

#### 3. Refresh Token
```
POST /auth/refresh
Authorization: Bearer <refreshToken>

Response (200 OK):
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzUxMi...",
    "refreshToken": "eyJhbGciOiJIUzUxMi...",
    "tokenType": "Bearer",
    "expiresIn": 86400000,
    "user": {...}
  },
  "statusCode": 200
}
```

#### 4. Get Current User
```
GET /auth/me
Authorization: Bearer <accessToken>

Response (200 OK):
{
  "success": true,
  "message": "Current user fetched",
  "data": {
    "id": 3,
    "email": "student@college.edu",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "accountStatus": "ACTIVE"
  },
  "statusCode": 200
}
```

#### 5. Logout
```
POST /auth/logout

Response (200 OK):
{
  "success": true,
  "message": "Logout successful",
  "statusCode": 200
}
```

---

### 📅 Event Endpoints

#### 1. Create Event (Admin Only)
```
POST /events
Authorization: Bearer <adminToken>
Content-Type: application/json

Request Body:
{
  "title": "Spring Boot Workshop",
  "description": "Learn modern Spring Boot development with hands-on exercises...",
  "category": "Workshop",
  "startDateTime": "2026-03-22T10:00:00",
  "endDateTime": "2026-03-22T12:00:00",
  "location": "Room 101, Engineering Block",
  "capacity": 50,
  "registrationDeadline": "2026-03-20T23:59:00",
  "imageUrl": "https://..."
}

Response (201 Created):
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": 3,
    "title": "Spring Boot Workshop",
    "status": "PENDING",
    "capacity": 50,
    "currentRegistrations": 0,
    "organizer": {...}
  },
  "statusCode": 201
}
```

#### 2. Get Event by ID
```
GET /events/{eventId}

Response (200 OK):
{
  "success": true,
  "message": "Event fetched successfully",
  "data": {
    "id": 1,
    "title": "Spring Boot Workshop",
    "description": "...",
    "category": "Workshop",
    "startDateTime": "2026-03-22T10:00:00",
    "endDateTime": "2026-03-22T12:00:00",
    "location": "Room 101, Engineering Block",
    "capacity": 50,
    "status": "APPROVED",
    "currentRegistrations": 12
  },
  "statusCode": 200
}
```

#### 3. Get All Approved Events (With Pagination)
```
GET /events?page=0&size=10&sort=startDateTime,desc

Response (200 OK):
{
  "success": true,
  "message": "Events fetched successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Spring Boot Workshop",
        "status": "APPROVED",
        "currentRegistrations": 12
      }
    ],
    "pageable": {...},
    "totalElements": 25,
    "totalPages": 3
  },
  "statusCode": 200
}
```

#### 4. Search Events
```
GET /events/search?keyword=workshop&page=0&size=10

Response (200 OK):
{
  "success": true,
  "message": "Events searched successfully",
  "data": {
    "content": [{...}],
    "pageable": {...},
    "totalElements": 5
  },
  "statusCode": 200
}
```

#### 5. Filter Events by Category
```
GET /events/category/Workshop?page=0&size=10

Response (200 OK): {...}
```

#### 6. Filter Events by Date Range
```
GET /events/date-range?startDate=2026-03-20T00:00:00&endDate=2026-03-31T23:59:59&page=0&size=10

Response (200 OK): {...}
```

#### 7. Get Upcoming Events
```
GET /events/upcoming

Response (200 OK):
{
  "success": true,
  "message": "Upcoming events fetched",
  "data": [
    {
      "id": 1,
      "title": "Spring Boot Workshop",
      "startDateTime": "2026-03-22T10:00:00"
    }
  ],
  "statusCode": 200
}
```

#### 8. Update Event (Admin Only)
```
PUT /events/{eventId}
Authorization: Bearer <adminToken>
Content-Type: application/json

Request Body:
{
  "title": "Advanced Spring Boot Workshop",
  "description": "...",
  "capacity": 60
}

Response (200 OK): {...}
```

#### 9. Delete Event (Admin Only)
```
DELETE /events/{eventId}
Authorization: Bearer <adminToken>

Response (200 OK):
{
  "success": true,
  "message": "Event deleted successfully",
  "statusCode": 200
}
```

#### 10. Approve Event (Admin Only)
```
POST /events/{eventId}/approve
Authorization: Bearer <adminToken>

Response (200 OK):
{
  "success": true,
  "message": "Event approved successfully",
  "data": {
    "id": 1,
    "status": "APPROVED"
  },
  "statusCode": 200
}
```

#### 11. Reject Event (Admin Only)
```
POST /events/{eventId}/reject?rejectionReason=Insufficient%20details
Authorization: Bearer <adminToken>

Response (200 OK):
{
  "success": true,
  "message": "Event rejected successfully",
  "data": {
    "id": 1,
    "status": "REJECTED",
    "rejectionReason": "Insufficient details"
  },
  "statusCode": 200
}
```

#### 12. Get Events by Organizer
```
GET /events/organizer/{organizerId}

Response (200 OK):
{
  "success": true,
  "message": "Organizer's events fetched",
  "data": [
    {...},
    {...}
  ],
  "statusCode": 200
}
```

---

### 📝 Registration Endpoints

#### 1. Register for Event (Student Only)
```
POST /registrations?eventId=1
Authorization: Bearer <studentToken>

Response (201 Created):
{
  "success": true,
  "message": "Registered for event successfully",
  "data": {
    "id": 5,
    "student": {...},
    "event": {...},
    "registrationDate": "2026-03-15T10:30:00",
    "attendanceStatus": "PENDING"
  },
  "statusCode": 201
}
```

**Error Cases**:
- `400`: Already registered for this event
- `400`: Registration deadline has passed
- `400`: Event is full

#### 2. Get Registration by ID
```
GET /registrations/{registrationId}

Response (200 OK):
{
  "success": true,
  "message": "Registration fetched successfully",
  "data": {
    "id": 5,
    "student": {...},
    "event": {...},
    "registrationDate": "2026-03-15T10:30:00",
    "attendanceStatus": "PENDING"
  },
  "statusCode": 200
}
```

#### 3. Get My Registrations (Student Only)
```
GET /registrations?page=0&size=10
Authorization: Bearer <studentToken>

Response (200 OK):
{
  "success": true,
  "message": "Registrations fetched",
  "data": {
    "content": [{...}],
    "totalElements": 5
  },
  "statusCode": 200
}
```

#### 4. Cancel Registration (Student Only)
```
DELETE /registrations/{registrationId}
Authorization: Bearer <studentToken>

Response (200 OK):
{
  "success": true,
  "message": "Registration cancelled successfully",
  "statusCode": 200
}
```

#### 5. Get Event Registrations (Admin Only)
```
GET /registrations/event/{eventId}?page=0&size=10
Authorization: Bearer <adminToken>

Response (200 OK):
{
  "success": true,
  "message": "Event registrations fetched",
  "data": {
    "content": [{...}],
    "totalElements": 45,
    "totalPages": 5
  },
  "statusCode": 200
}
```

#### 6. Mark Attendance (Admin Only)
```
POST /registrations/{registrationId}/attendance?status=ATTENDED
Authorization: Bearer <adminToken>

Response (200 OK):
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "id": 5,
    "attendanceStatus": "ATTENDED"
  },
  "statusCode": 200
}
```

**Attendance Status**: `PENDING`, `ATTENDED`, `CANCELLED`, `REMOVED`

#### 7. Get Registration Count for Event
```
GET /registrations/event/{eventId}/count

Response (200 OK):
{
  "success": true,
  "message": "Registration count fetched",
  "data": 45,
  "statusCode": 200
}
```

#### 8. Check Registration Status
```
GET /registrations/event/{eventId}/check/{studentId}

Response (200 OK):
{
  "success": true,
  "message": "Registration status checked",
  "data": true,
  "statusCode": 200
}
```

---

## 📊 Response Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## ⚠️ Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "statusCode": 400
}
```

---

## 🔒 Role-Based Access

| Endpoint | STUDENT | ADMIN |
|----------|---------|-------|
| GET /events | ✓ | ✓ |
| GET /events/{id} | ✓ | ✓ |
| POST /events | ✗ | ✓ |
| PUT /events/{id} | ✗ | ✓ |
| DELETE /events/{id} | ✗ | ✓ |
| POST /events/{id}/approve | ✗ | ✓ |
| POST /events/{id}/reject | ✗ | ✓ |
| POST /registrations | ✓ | ✗ |
| DELETE /registrations/{id} | ✓ | ✗ |
| GET /registrations/event/{id} | ✗ | ✓ |
| POST /registrations/{id}/attendance | ✗ | ✓ |

---

### 👥 User Management Endpoints (Admin Only)

#### 1. Get All Users
```
GET /api/users?page=0&size=20
Authorization: Bearer <adminToken>

Response (200 OK):
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "email": "admin@college.edu",
        "firstName": "Admin",
        "lastName": "User",
        "role": "ADMIN",
        "accountStatus": "ACTIVE"
      }
    ],
    "totalElements": 50,
    "totalPages": 3,
    "currentPage": 0
  },
  "statusCode": 200
}
```

#### 2. Get User by ID
```
GET /api/users/{userId}
Authorization: Bearer <adminToken>

Response (200 OK):
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": 3,
    "email": "student@college.edu",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "department": "Computer Science",
    "role": "STUDENT",
    "accountStatus": "ACTIVE"
  },
  "statusCode": 200
}
```

#### 3. Get Users by Role
```
GET /api/users/role/{role}?page=0&size=20
Authorization: Bearer <adminToken>

Path Parameters:
- role: STUDENT | ADMIN

Response (200 OK):
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "content": [...],
    "totalElements": 150,
    "totalPages": 8
  },
  "statusCode": 200
}
```

#### 4. Search Users
```
GET /api/users/search?keyword=john&page=0&size=20
Authorization: Bearer <adminToken>

Query Parameters:
- keyword: Search term (matches firstName, lastName, email)
- page: Page number (default 0)
- size: Page size (default 20)

Response (200 OK):
{
  "success": true,
  "message": "Users found successfully",
  "data": {
    "content": [...],
    "totalElements": 5,
    "totalPages": 1
  },
  "statusCode": 200
}
```

#### 5. Count Users by Role
```
GET /api/users/count/role/{role}
Authorization: Bearer <adminToken>

Path Parameters:
- role: STUDENT | ADMIN

Response (200 OK):
{
  "success": true,
  "message": "User count retrieved successfully",
  "data": 145,
  "statusCode": 200
}
```

#### 6. Get Total User Count
```
GET /api/users/count/total
Authorization: Bearer <adminToken>

Response (200 OK):
{
  "success": true,
  "message": "Total user count retrieved successfully",
  "data": 162,
  "statusCode": 200
}
```

#### 7. Lock User Account
```
POST /api/users/{userId}/lock
Authorization: Bearer <adminToken>

Response (200 OK):
{
  "success": true,
  "message": "User account locked successfully",
  "data": "Account locked for user: 3",
  "statusCode": 200
}
```

#### 8. Unlock User Account
```
POST /api/users/{userId}/unlock
Authorization: Bearer <adminToken>

Response (200 OK):
{
  "success": true,
  "message": "User account unlocked successfully",
  "data": "Account unlocked for user: 3",
  "statusCode": 200
}
```

#### 9. Delete User
```
DELETE /api/users/{userId}
Authorization: Bearer <adminToken>

Response (200 OK):
{
  "success": true,
  "message": "User deleted successfully",
  "data": "User removed: 3",
  "statusCode": 200
}
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "password": "Pass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@college.edu",
    "password": "Pass123!"
  }'
```

### Create Event (as Admin)
```bash
curl -X POST http://localhost:8080/api/events \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Workshop",
    "description": "Description...",
    "category": "Workshop",
    "startDateTime": "2026-03-22T10:00:00",
    "endDateTime": "2026-03-22T12:00:00",
    "location": "Room 101",
    "capacity": 50,
    "registrationDeadline": "2026-03-20T23:59:00"
  }'
```

### Register for Event (as Student)
```bash
curl -X POST "http://localhost:8080/api/registrations?eventId=1" \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 📚 Swagger/OpenAPI

Visit: `http://localhost:8080/api/swagger-ui.html`

---

**API Version**: 1.0.0  
**Last Updated**: March 15, 2026  
**Status**: Sprint 3-4 Complete
