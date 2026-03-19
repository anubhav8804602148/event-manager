import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../hooks/useNotification';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { Card, CardBody, CardHeader } from '../common/Card';
import { Button } from '../common/Button';
import { Loading } from '../common/Loading';
import { StatusBadge } from '../common/Badge';
import { Modal, ConfirmModal } from '../common/Modal';
import './Student.css';

export const EventDetails = () => {
  const { eventId } = useParams();
  const { success, error: showError } = useNotification();
  const [showConfirm, setShowConfirm] = useState(false);
  const [registering, setRegistering] = useState(false);

  const { data: event, loading } = useFetch(
    () => eventService.getEventById(eventId),
    [eventId]
  );

  const handleRegister = async () => {
    try {
      setRegistering(true);
      await registrationService.registerForEvent(eventId);
      success('Successfully registered for the event!');
      setShowConfirm(false);
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <Loading />;

  if (!event) {
    return (
      <div className="event-not-found">
        <h2>Event not found</h2>
        <Button variant="primary">
          <a href="/events">Back to Events</a>
        </Button>
      </div>
    );
  }

  const capacityPercentage = (event.currentRegistrations / event.capacity) * 100;
  const isFull = capacityPercentage >= 100;

  return (
    <div className="event-details">
      {event.imageUrl && (
        <div className="event-hero">
          <img src={event.imageUrl} alt={event.title} />
        </div>
      )}

      <div className="event-content">
        <div className="event-title-section">
          <h1>{event.title}</h1>
          <StatusBadge status={event.status} />
        </div>

        <p className="event-category">{event.category}</p>

        <div className="event-details-grid">
          <div className="detail-item">
            <span className="detail-label">📅 Date</span>
            <span className="detail-value">
              {new Date(event.startDateTime).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">⏰ Time</span>
            <span className="detail-value">
              {new Date(event.startDateTime).toLocaleTimeString()} - {new Date(event.endDateTime).toLocaleTimeString()}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📍 Location</span>
            <span className="detail-value">{event.location}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">👤 Organizer</span>
            <span className="detail-value">{event.organizer?.name}</span>
          </div>
        </div>

        <div className="event-description-section">
          <h2>About This Event</h2>
          <p>{event.description}</p>
        </div>

        <Card className="capacity-card">
          <CardBody>
            <h3>Capacity Information</h3>
            <div className="capacity-details">
              <div className="capacity-bar">
                <div
                  className={`capacity-fill ${isFull ? 'full' : ''}`}
                  style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="capacity-text">
                <strong>{event.currentRegistrations}</strong> out of <strong>{event.capacity}</strong> spots taken
              </p>
              {event.registrationDeadline && (
                <p className="registration-deadline">
                  Registration closes on: {new Date(event.registrationDeadline).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardBody>
        </Card>

        <div className="event-actions">
          {isFull ? (
            <Button variant="danger" disabled>
              Event is Full
            </Button>
          ) : (
            <Button
              variant="primary"
              size="large"
              onClick={() => setShowConfirm(true)}
              loading={registering}
            >
              Register Now
            </Button>
          )}
          <Button variant="secondary" size="large">
            <a href="/events">Back to Events</a>
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Registration"
        message={`Are you sure you want to register for "${event.title}"?`}
        onConfirm={handleRegister}
        onCancel={() => setShowConfirm(false)}
        confirmText="Register"
        cancelText="Cancel"
      />
    </div>
  );
};

export default EventDetails;
