import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../hooks/useNotification';
import { eventService } from '../../services/eventService';
import { Card, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import { FormInput, FormSelect } from '../common/FormInput';
import { Loading } from '../common/Loading';
import { Pagination } from '../common/Pagination';
import { StatusBadge } from '../common/Badge';
import { Modal, ConfirmModal } from '../common/Modal';
import './Admin.css';

export const ManageEvents = () => {
  const { success, error: showError } = useNotification();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data, loading, refetch } = useFetch(
    () => eventService.getAllEvents(page, 10, {
      status: statusFilter || undefined
    }),
    [page, statusFilter]
  );

  const handleApprove = async (eventId) => {
    try {
      await eventService.approveEvent(eventId);
      success('Event approved successfully');
      refetch();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to approve event');
    }
  };

  const handleReject = async (eventId) => {
    try {
      await eventService.rejectEvent(eventId, 'Rejected by admin');
      success('Event rejected successfully');
      refetch();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to reject event');
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await eventService.deleteEvent(selectedEvent.id);
      success('Event deleted successfully');
      setShowDeleteConfirm(false);
      refetch();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  if (loading) return <Loading />;

  return (
    <div className="manage-events">
      <div className="manage-header">
        <h1>Manage Events</h1>
        <Button variant="primary">
          <a href="/admin/events/create">Create New Event</a>
        </Button>
      </div>

      <div className="manage-filters">
        <FormSelect
          name="status"
          label="Filter by Status"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Rejected' },
            { value: 'CANCELLED', label: 'Cancelled' }
          ]}
        />
      </div>

      {data?.content?.length > 0 ? (
        <>
          <div className="events-table-container">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Registrations</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map(event => (
                  <tr key={event.id}>
                    <td className="title-cell">{event.title}</td>
                    <td>{event.category}</td>
                    <td>{new Date(event.startDateTime).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={event.status} />
                    </td>
                    <td>{event.currentRegistrations}/{event.capacity}</td>
                    <td className="actions-cell">
                      <Button variant="secondary" size="small">
                        <a href={`/admin/events/${event.id}`}>View</a>
                      </Button>
                      {event.status === 'PENDING' && (
                        <>
                          <Button variant="success" size="small" onClick={() => handleApprove(event.id)}>
                            Approve
                          </Button>
                          <Button variant="danger" size="small" onClick={() => handleReject(event.id)}>
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={data.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="no-events">
          <p>No events found.</p>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete Event"
        message={`Are you sure you want to delete "${selectedEvent?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
};

export default ManageEvents;
