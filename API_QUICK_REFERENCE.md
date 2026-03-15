# 📋 API Quick Reference Card

**Base URL**: `http://localhost:8080/api`  
**Auth Header**: `Authorization: Bearer <accessToken>`

---

## 🔐 Authentication

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/auth/register` | Register new user | ✗ |
| POST | `/auth/login` | Login & get tokens | ✗ |
| POST | `/auth/refresh` | Refresh access token | ✓ Refresh |
| GET | `/auth/me` | Get current user | ✓ |
| POST | `/auth/logout` | Logout | ✓ |

---

## 📅 Events (10 endpoints)

| Method | Endpoint | Purpose | Role | Query/Params |
|--------|----------|---------|------|-------|
| POST | `/events` | Create event | ADMIN | - |
| GET | `/events` | List approved events | ALL | `page`, `size`, `sort` |
| GET | `/events/{id}` | Get event by ID | ALL | - |
| GET | `/events/search` | Search events | ALL | `keyword`, `page`, `size` |
| GET | `/events/category/{cat}` | Events by category | ALL | `page`, `size` |
| GET | `/events/date-range` | Events by date range | ALL | `startDate`, `endDate`, `page`, `size` |
| GET | `/events/upcoming` | Next 7 days events | ALL | - |
| GET | `/events/organizer/{id}` | Organizer's events | ALL | - |
| PUT | `/events/{id}` | Update event | ADMIN | - |
| DELETE | `/events/{id}` | Delete event | ADMIN | - |
| POST | `/events/{id}/approve` | Approve event | ADMIN | - |
| POST | `/events/{id}/reject` | Reject event | ADMIN | `rejectionReason` |

---

## 📝 Registrations (8 endpoints)

| Method | Endpoint | Purpose | Role | Query/Params |
|--------|----------|---------|------|-------|
| POST | `/registrations` | Register for event | STUDENT | `eventId` |
| GET | `/registrations/{id}` | Get registration | ALL | - |
| GET | `/registrations` | My registrations | STUDENT | `page`, `size` |
| DELETE | `/registrations/{id}` | Cancel registration | STUDENT | - |
| GET | `/registrations/event/{id}` | Event registrations | ADMIN | `page`, `size` |
| POST | `/registrations/{id}/attendance` | Mark attendance | ADMIN | `status` |
| GET | `/registrations/event/{id}/count` | Registration count | ALL | - |
| GET | `/registrations/event/{id}/check/{studentId}` | Check if registered | ALL | - |

---

## 🔑 Sample Requests

### 1. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@college.edu","password":"Admin123!"}'
```

### 2. Create Event
```bash
curl -X POST http://localhost:8080/api/events \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Workshop","description":"...","category":"Workshop",
    "startDateTime":"2026-03-22T10:00:00",
    "endDateTime":"2026-03-22T12:00:00",
    "location":"Room 101","capacity":50,
    "registrationDeadline":"2026-03-20T23:59:00"
  }'
```

### 3. Register for Event
```bash
curl -X POST "http://localhost:8080/api/registrations?eventId=1" \
  -H "Authorization: Bearer TOKEN"
```

### 4. Get My Events
```bash
curl "http://localhost:8080/api/registrations?page=0&size=10" \
  -H "Authorization: Bearer TOKEN"
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/expired token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔒 Role Access Matrix

| Endpoint | STUDENT | ADMIN |
|----------|---------|-------|
| POST `/events` | ✗ | ✓ |
| POST `/events/{id}/approve` | ✗ | ✓ |
| POST `/events/{id}/reject` | ✗ | ✓ |
| PUT `/events/{id}` | ✗ | ✓ |
| DELETE `/events/{id}` | ✗ | ✓ |
| POST `/registrations` | ✓ | ✗ |
| DELETE `/registrations/{id}` | ✓ | ✗ |
| GET `/registrations/event/{id}` | ✗ | ✓ |
| POST `/registrations/{id}/attendance` | ✗ | ✓ |

---

## 🚀 Common Workflows

### Student Registration Workflow
```
1. POST /auth/register        → Create account
2. POST /auth/login           → Get tokens
3. GET /events                → Browse events
4. GET /events/search         → Search events
5. GET /events/{id}           → Event details
6. POST /registrations        → Register
7. GET /registrations         → My registrations
```

### Admin Event Approval Workflow
```
1. POST /auth/login           → Admin login
2. GET /events                → View pending
3. PUT /events/{id}           → Edit if needed
4. POST /events/{id}/approve  → Approve
5. GET /registrations/event/{id} → View registrations
6. POST /registrations/{id}/attendance → Mark attendance
```

---

## ⚠️ Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 400: Already registered | Duplicate registration | Cancel first registration |
| 400: Deadline passed | Past registration deadline | Check event dates |
| 400: Event full | Capacity reached | Join waitlist (future feature) |
| 401: Unauthorized | Missing/invalid token | Login again |
| 403: Forbidden | Insufficient permissions | Use correct role |
| 404: Not found | Invalid ID | Verify resource exists |

---

## 💾 Test Data

### Default Admin
- Email: `admin@college.edu`
- Password: `Admin123!`
- Role: `ADMIN`

### Default Student
- Email: `student1@college.edu`
- Password: `Student123!`
- Role: `STUDENT`

### Sample Events (from init.sql)
- ID 1: "Tech Conference"
- ID 2: "Web Development Workshop"
- ID 3: "Cloud Computing Seminar"

---

## 📚 More Info

- **Full API Docs**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Testing Guide**: [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)
- **Postman Collection**: [postman_collection.json](postman_collection.json)

---

**Version**: 1.0.0 | **Last Updated**: March 15, 2026 | **Status**: Sprint 3-4 ✅
