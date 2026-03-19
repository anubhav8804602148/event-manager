import api from './api';

export const registrationService = {
  // Get all registrations for current user - matches API: GET /registrations
  getMyRegistrations: (page = 0, size = 10, params = {}) => {
    return api.get('/registrations', {
      params: {
        page,
        size,
        ...params
      }
    });
  },

  // Get registration by ID - matches API: GET /registrations/{id}
  getRegistrationById: (id) => {
    return api.get(`/registrations/${id}`);
  },

  // Get registrations for a specific event (admin only) - matches API: GET /registrations/event/{eventId}
  getEventRegistrations: (eventId, page = 0, size = 10) => {
    return api.get(`/registrations/event/${eventId}`, {
      params: { page, size }
    });
  },

  // Register for event - matches API: POST /registrations?eventId={eventId}
  registerForEvent: (eventId) => {
    return api.post('/registrations', null, {
      params: { eventId }
    });
  },

  // Cancel registration - matches API: DELETE /registrations/{id}
  cancelRegistration: (registrationId) => {
    return api.delete(`/registrations/${registrationId}`);
  },

  // Mark attendance - matches API: POST /registrations/{id}/attendance?status=ATTENDED
  markAttendance: (registrationId, status = 'ATTENDED') => {
    return api.post(`/registrations/${registrationId}/attendance`, null, {
      params: { status }
    });
  },

  // Get registration count for event - matches API: GET /registrations/event/{eventId}/count
  getRegistrationCount: (eventId) => {
    return api.get(`/registrations/event/${eventId}/count`);
  },

  // Check if student is registered - matches API: GET /registrations/event/{eventId}/check/{studentId}
  checkIfRegistered: (eventId, studentId) => {
    return api.get(`/registrations/event/${eventId}/check/${studentId}`);
  }
};

