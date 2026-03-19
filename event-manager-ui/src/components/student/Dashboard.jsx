import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { Card, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import { Loading, Spinner } from '../common/Loading';
import './Student.css';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    registeredEvents: 0,
    upcomingEvents: 0
  });

  const { data: registrations, loading: regsLoading } = useFetch(
    () => registrationService.getMyRegistrations(0, 5),
    []
  );

  const { data: events, loading: eventsLoading } = useFetch(
    () => eventService.getAllEvents(0, 5, { status: 'APPROVED' }),
    []
  );

  useEffect(() => {
    if (registrations?.content) {
      setStats(prev => ({
        ...prev,
        registeredEvents: registrations.totalElements || 0
      }));
    }
    if (events?.content) {
      setStats(prev => ({
        ...prev,
        upcomingEvents: events.totalElements || 0
      }));
    }
  }, [registrations, events]);

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'Student'}!</h1>
        <p>Here's what's happening with your events</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.registeredEvents}</div>
          <div className="stat-label">Events Registered</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.upcomingEvents}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Button variant="primary" size="large">
          <a href="/events">Browse Events</a>
        </Button>
        <Button variant="secondary" size="large">
          <a href="/my-registrations">View My Registrations</a>
        </Button>
      </div>

      <div className="dashboard-section">
        <h2>Upcoming Events (Next 7 Days)</h2>
        {eventsLoading ? (
          <Loading />
        ) : events?.content?.length > 0 ? (
          <div className="events-list">
            {events.content.map(event => (
              <Card key={event.id} className="event-card">
                <CardBody>
                  <h3>{event.title}</h3>
                  <p className="event-date">📅 {new Date(event.startDateTime).toLocaleDateString()}</p>
                  <p className="event-location">📍 {event.location}</p>
                  <Button variant="primary" size="small">
                    View Details
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <p className="no-data">No upcoming events at the moment.</p>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Recent Registrations</h2>
        {regsLoading ? (
          <Loading />
        ) : registrations?.content?.length > 0 ? (
          <div className="registrations-list">
            {registrations.content.map(reg => (
              <Card key={reg.id} className="registration-card">
                <CardBody>
                  <h3>{reg.event?.title}</h3>
                  <p className="reg-status">Status: <strong>{reg.status}</strong></p>
                  <p className="reg-date">Registered on: {new Date(reg.registrationDate).toLocaleDateString()}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <p className="no-data">You haven't registered for any events yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
