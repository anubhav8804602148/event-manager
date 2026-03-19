import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { useFetch } from '../../hooks/useFetch';
import { Card, CardBody } from '../common/Card';
import { Loading } from '../common/Loading';
import './Admin.css';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    approvedEvents: 0,
    pendingEvents: 0,
    totalRegistrations: 0
  });

  const { data: events, loading: eventsLoading } = useFetch(
    () => eventService.getAllEvents(0, 100),
    []
  );

  useEffect(() => {
    if (events?.content) {
      const approved = events.content.filter(e => e.status === 'APPROVED').length;
      const pending = events.content.filter(e => e.status === 'PENDING').length;

      setStats({
        totalEvents: events.totalElements || 0,
        approvedEvents: approved,
        pendingEvents: pending,
        totalRegistrations: events.content.reduce((sum, e) => sum + (e.currentRegistrations || 0), 0)
      });
    }
  }, [events]);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>System Overview & Quick Stats</p>
      </div>

      <div className="stats-grid">
        <Card className="stat-card">
          <CardBody>
            <div className="stat-value">{stats.totalEvents}</div>
            <div className="stat-label">Total Events</div>
          </CardBody>
        </Card>

        <Card className="stat-card">
          <CardBody>
            <div className="stat-value stat-approved">{stats.approvedEvents}</div>
            <div className="stat-label">Approved Events</div>
          </CardBody>
        </Card>

        <Card className="stat-card">
          <CardBody>
            <div className="stat-value stat-pending">{stats.pendingEvents}</div>
            <div className="stat-label">Pending Approval</div>
          </CardBody>
        </Card>

        <Card className="stat-card">
          <CardBody>
            <div className="stat-value">{stats.totalRegistrations}</div>
            <div className="stat-label">Total Registrations</div>
          </CardBody>
        </Card>
      </div>

      <div className="admin-actions">
        <a href="/admin/events/create" className="btn btn-primary btn-large">
          Create New Event
        </a>
        <a href="/admin/events" className="btn btn-secondary btn-large">
          View All Events
        </a>
        <a href="/admin/users" className="btn btn-secondary btn-large">
          Manage Users
        </a>
      </div>

      {eventsLoading ? (
        <Loading />
      ) : (
        <div className="recent-events">
          <h2>Recent Events</h2>
          <div className="events-list">
            {events?.content?.slice(0, 5).map(event => (
              <Card key={event.id} className="event-card">
                <CardBody>
                  <h3>{event.title}</h3>
                  <p className="event-status">Status: <strong>{event.status}</strong></p>
                  <p className="event-registrations">Registrations: {event.currentRegistrations}/{event.capacity}</p>
                  <a href={`/admin/events/${event.id}`} className="btn btn-small">View</a>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
