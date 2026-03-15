# ✅ API Testing Checklist

**Date**: March 15, 2026  
**Sprint**: 3-4 Complete  
**Status**: Ready for Manual & Automated Testing

---

## 📋 Pre-Testing Setup

- [ ] Backend running on `http://localhost:8080`
- [ ] MySQL database connected
- [ ] Application properties configured
- [ ] Sample data loaded via `init.sql`
- [ ] Postman installed
- [ ] `postman_collection.json` imported
- [ ] Environment variables set (baseUrl, tokens)

---

## 🔐 Authentication Tests (5 endpoints)

### Register Endpoint
- [ ] Valid registration creates user
- [ ] Duplicate email rejected (400)
- [ ] Invalid email format rejected (400)
- [ ] Weak password rejected (400)
- [ ] User role set to STUDENT by default
- [ ] Response includes user ID
- [ ] Password hashed (not returned)
- [ ] Response code: 201 Created

### Login Endpoint
- [ ] Valid credentials return tokens
- [ ] Invalid email returns 404/400
- [ ] Invalid password returns 401
- [ ] Response includes accessToken (JWT)
- [ ] Response includes refreshToken
- [ ] Response includes user details
- [ ] Token stored in Postman env automatically
- [ ] Response code: 200 OK

### Refresh Token Endpoint
- [ ] Valid refresh token returns new access token
- [ ] Expired refresh token rejected (401)
- [ ] Invalid refresh token rejected (401)
- [ ] Response includes new accessToken
- [ ] Old token still works until expiry
- [ ] Response code: 200 OK

### Get Current User Endpoint
- [ ] Authenticated user gets own details
- [ ] Unauthenticated request rejected (401)
- [ ] User role included in response
- [ ] Response code: 200 OK

### Logout Endpoint
- [ ] Logout successful message returned
- [ ] User can still login after logout
- [ ] Response code: 200 OK

---

## 📅 Event Management Tests (10 endpoints)

### Create Event (Admin Only)
- [ ] Admin can create event
- [ ] Event status set to PENDING
- [ ] Student cannot create event (403)
- [ ] Unauthenticated cannot create (401)
- [ ] All fields required validate
- [ ] Invalid dates rejected (400)
- [ ] Start date must be after registration deadline
- [ ] Event ID auto-generated
- [ ] Response code: 201 Created

### Get All Events
- [ ] Only APPROVED events shown
- [ ] Pagination works (page, size params)
- [ ] Sorting works (sort param)
- [ ] Empty list returns empty content
- [ ] Response includes totalElements
- [ ] Response includes totalPages
- [ ] Response code: 200 OK

### Get Event by ID
- [ ] Approved event returns 200
- [ ] Pending event returns 404
- [ ] Rejected event returns 404
- [ ] Invalid ID returns 404
- [ ] Response includes all event fields
- [ ] Response includes registration count
- [ ] Response code: 200 OK

### Search Events
- [ ] Keyword search in title returns matches
- [ ] Keyword search in description returns matches
- [ ] Case-insensitive search
- [ ] Empty keyword returns all events
- [ ] Pagination works
- [ ] Only approved events returned
- [ ] Response code: 200 OK

### Filter by Category
- [ ] Valid category returns events
- [ ] Invalid category returns empty
- [ ] Pagination works
- [ ] Only approved events returned
- [ ] Response code: 200 OK

### Filter by Date Range
- [ ] Events within range returned
- [ ] Events outside range excluded
- [ ] Start date inclusive
- [ ] End date inclusive
- [ ] Invalid date format rejected (400)
- [ ] Pagination works
- [ ] Response code: 200 OK

### Get Upcoming Events
- [ ] Returns events in next 7 days
- [ ] Excludes past events
- [ ] Only approved events
- [ ] Sorted by start date
- [ ] Response code: 200 OK

### Get Events by Organizer
- [ ] Returns organizer's events
- [ ] Invalid organizer ID returns empty
- [ ] Includes pending events (organizer can see own)
- [ ] Response code: 200 OK

### Update Event
- [ ] Admin can update own events
- [ ] Cannot update after event started
- [ ] Cannot change capacity below current registrations
- [ ] Student cannot update (403)
- [ ] Invalid event returns 404
- [ ] Partial updates work
- [ ] Response code: 200 OK

### Approve Event
- [ ] Admin can approve pending event
- [ ] Event status changes to APPROVED
- [ ] Already approved event returns error
- [ ] Rejected event cannot be approved again
- [ ] Invalid event returns 404
- [ ] Student cannot approve (403)
- [ ] Response code: 200 OK

### Reject Event
- [ ] Admin can reject pending event
- [ ] Event status changes to REJECTED
- [ ] Rejection reason stored
- [ ] Already approved event cannot be rejected
- [ ] Rejected event cannot be rejected again
- [ ] Student cannot reject (403)
- [ ] Rejection reason optional
- [ ] Response code: 200 OK

---

## 📝 Registration Tests (8 endpoints)

### Register for Event
- [ ] Student can register for approved event
- [ ] Cannot register for pending event (404)
- [ ] Cannot register for rejected event (404)
- [ ] Cannot register twice for same event (400)
- [ ] Cannot register after deadline (400)
- [ ] Cannot register when event full (400)
- [ ] Registration date auto-set
- [ ] Attendance status set to PENDING
- [ ] Current registrations count incremented
- [ ] Admin cannot register (403)
- [ ] Response code: 201 Created

### Get Registration by ID
- [ ] Student can get own registration
- [ ] Admin can get any registration
- [ ] Invalid registration returns 404
- [ ] Response includes all fields
- [ ] Response code: 200 OK

### Get My Registrations
- [ ] Student gets only own registrations
- [ ] Includes all statuses (PENDING, ATTENDED, CANCELLED)
- [ ] Pagination works
- [ ] Sorting works
- [ ] Empty list when no registrations
- [ ] Admin gets error (403) or different endpoint
- [ ] Response code: 200 OK

### Cancel Registration
- [ ] Student can cancel own registration
- [ ] Cannot cancel after event starts (400)
- [ ] Cannot cancel already cancelled (400)
- [ ] Status changes to CANCELLED
- [ ] Current registrations count decremented
- [ ] Invalid registration returns 404
- [ ] Response code: 200 OK

### Get Event Registrations (Admin)
- [ ] Admin can view all registrations for event
- [ ] Student cannot view (403)
- [ ] Invalid event returns 404
- [ ] Pagination works
- [ ] Includes all registrations (pending + attended + cancelled)
- [ ] Response code: 200 OK

### Mark Attendance
- [ ] Admin can mark attendance ATTENDED
- [ ] Admin can mark attendance CANCELLED
- [ ] Admin can mark attendance REMOVED
- [ ] Invalid registration returns 404
- [ ] Student cannot mark attendance (403)
- [ ] Status updates correctly
- [ ] Response code: 200 OK

### Get Registration Count
- [ ] Returns accurate count for event
- [ ] Excludes cancelled registrations (optional)
- [ ] Invalid event returns 0 or 404
- [ ] Count matches actual registrations
- [ ] Response code: 200 OK

### Check Registration Status
- [ ] Returns true if registered
- [ ] Returns false if not registered
- [ ] Returns false if cancelled (optional)
- [ ] Invalid event/student returns false
- [ ] Response code: 200 OK

---

## 🔒 Authorization & Security Tests

### Role-Based Access Control
- [ ] STUDENT cannot create events
- [ ] STUDENT cannot approve/reject events
- [ ] STUDENT cannot view event registrations
- [ ] STUDENT cannot mark attendance
- [ ] ADMIN can perform all operations
- [ ] ADMIN can view user registrations
- [ ] Invalid role rejected

### Token Validation
- [ ] Expired token rejected (401)
- [ ] Invalid token rejected (401)
- [ ] Missing token rejected (401)
- [ ] Malformed token rejected (401)
- [ ] Token refreshes work (7-day refresh token)
- [ ] Access token expiry: 24 hours

### CORS
- [ ] Frontend can make requests
- [ ] Preflight OPTIONS request succeeds
- [ ] Cross-origin credentials supported
- [ ] Proper CORS headers in response

---

## 🧮 Data Validation Tests

### Event Fields
- [ ] Title: max 255 chars
- [ ] Title: min 3 chars
- [ ] Description: max 5000 chars
- [ ] Category: enum validation
- [ ] Capacity: positive integer
- [ ] Capacity: max reasonable value
- [ ] Start date: valid format
- [ ] End date: after start date
- [ ] Registration deadline: before start date

### User Fields
- [ ] Email: valid format
- [ ] Password: min 8 chars
- [ ] Password: special char required
- [ ] Phone: valid format
- [ ] Department: max 100 chars

---

## 📊 Performance Tests

- [ ] Get all events with pagination (1000 events)
- [ ] Search events (large keyword set)
- [ ] List registrations for large event (5000+ registrations)
- [ ] Bulk registration creation
- [ ] Response time < 2 seconds (avg)
- [ ] Database queries optimized

---

## 🚀 Integration Tests

### Complete User Flow
- [ ] Register → Login → Create Event → Approve → Register → View
- [ ] Multiple students register for same event
- [ ] Event capacity reaches limit
- [ ] Attendance marking workflow

### Error Recovery
- [ ] Duplicate registration attempt → appropriate error
- [ ] Deadline passed attempt → appropriate error
- [ ] Capacity full attempt → appropriate error
- [ ] Unauthorized access → 403 Forbidden

---

## 📱 Response Format Tests

### Success Response
- [ ] Contains `success: true`
- [ ] Contains `message`
- [ ] Contains `data` with resource
- [ ] Contains `statusCode`
- [ ] Proper JSON format

### Error Response
- [ ] Contains `success: false`
- [ ] Contains `message` (user-friendly)
- [ ] Contains `error` (error code)
- [ ] Contains `statusCode`
- [ ] No sensitive data leaked

---

## 🧪 Test Data Requirements

### Users
- [ ] 1 Admin user created
- [ ] 5+ Student users created
- [ ] Various departments

### Events
- [ ] 5+ approved events
- [ ] 2+ pending events
- [ ] 2+ rejected events
- [ ] Events with various capacities
- [ ] Events with past/future dates

### Registrations
- [ ] 10+ total registrations
- [ ] Events with multiple students
- [ ] Various attendance statuses
- [ ] Full capacity event

---

## 📝 Postman Collection Tests

- [ ] All requests in collection work
- [ ] Environment variables populate correctly
- [ ] Auth flow stores tokens
- [ ] Test scripts execute without error
- [ ] Pre-request scripts execute
- [ ] Response assertions pass

---

## 🐛 Bug Found Template

```
Title: [Brief description]
Endpoint: [GET/POST] /path
Status: [Status code]
Expected: [What should happen]
Actual: [What happened]
Steps to Reproduce:
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
Severity: [Critical/High/Medium/Low]
```

---

## ✅ Sign-Off

- [ ] All tests passed
- [ ] No critical bugs
- [ ] No blocking issues
- [ ] API ready for frontend integration
- [ ] Documentation complete
- [ ] Postman collection verified

**Tested By**: ________________  
**Date**: ________________  
**Notes**: ________________

---

**API Version**: 1.0.0  
**Last Updated**: March 15, 2026  
**Status**: Sprint 3-4 Complete
