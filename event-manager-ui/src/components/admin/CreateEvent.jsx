import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';
import { eventService } from '../../services/eventService';
import { EVENT_CATEGORIES } from '../../utils/constants';
import { FormInput, FormSelect, FormTextarea } from '../common/FormInput';
import { Button } from '../common/Button';
import { Card, CardBody } from '../common/Card';
import './Admin.css';

export const CreateEvent = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    capacity: '',
    registrationDeadline: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 255) {
      newErrors.title = 'Title must not exceed 255 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    } else if (formData.description.trim().length > 5000) {
      newErrors.description = 'Description must not exceed 5000 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.startDateTime) {
      newErrors.startDateTime = 'Start date/time is required';
    }

    if (!formData.endDateTime) {
      newErrors.endDateTime = 'End date/time is required';
    } else if (new Date(formData.endDateTime) <= new Date(formData.startDateTime)) {
      newErrors.endDateTime = 'End date must be after start date';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }

    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline = 'Registration deadline is required';
    } else if (new Date(formData.registrationDeadline) >= new Date(formData.startDateTime)) {
      newErrors.registrationDeadline = 'Deadline must be before event start';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await eventService.createEvent({
        ...formData,
        capacity: parseInt(formData.capacity)
      });
      success('Event created successfully!');
      navigate('/admin/events');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-event">
      <div className="form-header">
        <h1>Create New Event</h1>
        <p>Fill in the details below to create a new event</p>
      </div>

      <div className="form-layout">
        <div className="form-section">
          <form onSubmit={handleSubmit} className="event-form">
            <FormInput
              name="title"
              label="Event Title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter event title"
              maxLength={255}
              required
            />

            <FormTextarea
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              placeholder="Enter detailed event description (min 50 characters)"
              rows={4}
              maxLength={5000}
              required
            />

            <FormSelect
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
              options={EVENT_CATEGORIES.map(cat => ({
                value: cat,
                label: cat
              }))}
              required
            />

            <FormInput
              name="startDateTime"
              label="Start Date & Time"
              type="datetime-local"
              value={formData.startDateTime}
              onChange={handleChange}
              error={errors.startDateTime}
              required
            />

            <FormInput
              name="endDateTime"
              label="End Date & Time"
              type="datetime-local"
              value={formData.endDateTime}
              onChange={handleChange}
              error={errors.endDateTime}
              required
            />

            <FormInput
              name="location"
              label="Location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="Event location"
              required
            />

            <FormInput
              name="capacity"
              label="Maximum Capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              error={errors.capacity}
              placeholder="Number of participants"
              required
            />

            <FormInput
              name="registrationDeadline"
              label="Registration Deadline"
              type="datetime-local"
              value={formData.registrationDeadline}
              onChange={handleChange}
              error={errors.registrationDeadline}
              required
            />

            <FormInput
              name="imageUrl"
              label="Image URL (Optional)"
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />

            <div className="form-actions">
              <Button type="submit" variant="primary" size="large" loading={loading}>
                Create Event
              </Button>
              <Button type="button" variant="secondary" size="large">
                <a href="/admin/events">Cancel</a>
              </Button>
            </div>
          </form>
        </div>

        <div className="preview-section">
          <Card>
            <CardBody>
              <h3>Event Preview</h3>
              {formData.title && <h4>{formData.title}</h4>}
              {formData.description && <p>{formData.description}</p>}
              {formData.category && <p><strong>Category:</strong> {formData.category}</p>}
              {formData.startDateTime && <p><strong>Date:</strong> {new Date(formData.startDateTime).toLocaleDateString()}</p>}
              {formData.location && <p><strong>Location:</strong> {formData.location}</p>}
              {formData.capacity && <p><strong>Capacity:</strong> {formData.capacity} participants</p>}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
