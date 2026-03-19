import api from './api';

export const eventService = {
  // Get all approved events with pagination - matches API: GET /events
  getAllEvents: (page = 0, size = 10, params = {}) => {
    return api.get('/events', {
      params: {
        page,
        size,
        ...params
      }
    });
  },

  // Get event by ID - matches API: GET /events/{id}
  getEventById: (id) => {
    return api.get(`/events/${id}`);
  },

  // Create event (admin only) - matches API: POST /events
  createEvent: (eventData) => {
    return api.post('/events', eventData);
  },

  // Update event (admin only) - matches API: PUT /events/{id}
  updateEvent: (id, eventData) => {
    return api.put(`/events/${id}`, eventData);
  },

  // Delete event (admin only) - matches API: DELETE /events/{id}
  deleteEvent: (id) => {
    return api.delete(`/events/${id}`);
  },

  // Approve event (admin only) - matches API: POST /events/{id}/approve
  approveEvent: (id) => {
    return api.post(`/events/${id}/approve`);
  },

  // Reject event (admin only) - matches API: POST /events/{id}/reject?rejectionReason=...
  rejectEvent: (id, rejectionReason) => {
    return api.post(`/events/${id}/reject`, null, {
      params: { rejectionReason }
    });
  },

  // Get upcoming events - matches API: GET /events/upcoming
  getUpcomingEvents: () => {
    return api.get('/events/upcoming');
  },

  // Search events - matches API: GET /events/search?keyword=...
  searchEvents: (keyword, page = 0, size = 10) => {
    return api.get('/events/search', {
      params: { keyword, page, size }
    });
  },

  // Get events by organizer - matches API: GET /events/organizer/{organizerId}
  getEventsByOrganizer: (organizerId) => {
    return api.get(`/events/organizer/${organizerId}`);
  },

  // Get events by date range - matches API: GET /events/date-range
  getEventsByDateRange: (startDate, endDate, page = 0, size = 10) => {
    return api.get('/events/date-range', {
      params: { startDate, endDate, page, size }
    });
  },

  // Get events by category - matches API: GET /events/category/{category}
  getEventsByCategory: (category, page = 0, size = 10) => {
    return api.get(`/events/category/${category}`, {
      params: { page, size }
    });
  }
};

