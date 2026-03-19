import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../hooks/useNotification';
import { registrationService } from '../../services/registrationService';
import { REGISTRATION_STATUS } from '../../utils/constants';
import { Card, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import { Loading } from '../common/Loading';
import { StatusBadge } from '../common/Badge';
import { Pagination } from '../common/Pagination';
import { Modal, ConfirmModal } from '../common/Modal';
import { FormSelect } from '../common/FormInput';
import './Student.css';

export const MyRegistrations = () => {
  const { success, error: showError } = useNotification();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const { data, loading, refetch } = useFetch(
    () => registrationService.getMyRegistrations(page, 10, {
      status: statusFilter || undefined
    }),
    [page, statusFilter]
  );

  const handleCancelRegistration = async () => {
    try {
      setCancelling(true);
      await registrationService.cancelRegistration(selectedRegistration.id);
      success('Registration cancelled successfully');
      setShowCancelConfirm(false);
      refetch();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to cancel registration');
    } finally {
      setCancelling(false);
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  if (loading) return <Loading />;

  return (
    <div className="my-registrations">
      <div className="registrations-header">
        <h1>My Event Registrations</h1>
        <p>Manage your event registrations</p>
      </div>

      <div className="registrations-filter">
        <FormSelect
          name="status"
          label="Filter by Status"
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'REGISTERED', label: 'Registered' },
            { value: 'ATTENDED', label: 'Attended' },
            { value: 'CANCELLED', label: 'Cancelled' },
            { value: 'REMOVED', label: 'Removed' }
          ]}
        />
      </div>

      {data?.content?.length > 0 ? (
        <>
          <div className="registrations-list">
            {data.content.map(registration => (
              <Card key={registration.id} className="registration-card">
                <CardBody>
                  <div className="reg-header">
                    <h3>{registration.event?.title}</h3>
                    <StatusBadge status={registration.status} />
                  </div>

                  <div className="reg-details">
                    <div className="detail">
                      <span className="label">📅 Event Date:</span>
                      <span>{new Date(registration.event?.startDateTime).toLocaleDateString()}</span>
                    </div>
                    <div className="detail">
                      <span className="label">📍 Location:</span>
                      <span>{registration.event?.location}</span>
                    </div>
                    <div className="detail">
                      <span className="label">📝 Registration Date:</span>
                      <span>{new Date(registration.registrationDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="reg-actions">
                    <Button variant="secondary" size="small">
                      <a href={`/events/${registration.event?.id}`}>View Event</a>
                    </Button>
                    {registration.status === 'REGISTERED' && (
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setShowCancelConfirm(true);
                        }}
                      >
                        Cancel Registration
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={data.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="no-registrations">
          <p>You haven't registered for any events yet.</p>
          <Button variant="primary">
            <a href="/events">Browse Events</a>
          </Button>
        </div>
      )}

      <ConfirmModal
        isOpen={showCancelConfirm}
        title="Cancel Registration"
        message={`Are you sure you want to cancel your registration for "${selectedRegistration?.event?.title}"?`}
        onConfirm={handleCancelRegistration}
        onCancel={() => setShowCancelConfirm(false)}
        confirmText="Cancel Registration"
        cancelText="Keep Registration"
        isDangerous={true}
      />
    </div>
  );
};

export default MyRegistrations;
