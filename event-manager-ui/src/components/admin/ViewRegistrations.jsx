import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../hooks/useNotification';
import { registrationService } from '../../services/registrationService';
import { Card, CardBody, CardHeader } from '../common/Card';
import { Button } from '../common/Button';
import { Loading } from '../common/Loading';
import { Pagination } from '../common/Pagination';
import { StatusBadge } from '../common/Badge';
import { FormSelect } from '../common/FormInput';
import { ConfirmModal } from '../common/Modal';
import './Admin.css';

export const EventRegistrations = () => {
  const { eventId } = useParams();
  const { success, error: showError } = useNotification();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState(null);

  const { data, loading, refetch } = useFetch(
    () => registrationService.getEventRegistrations(eventId, page, 10),
    [page, eventId]
  );

  const handleMarkAttended = async () => {
    try {
      await registrationService.markAttendance(selectedRegistration.id, 'ATTENDED');
      success('Marked as attended');
      setShowConfirm(false);
      refetch();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const handleRemoveStudent = async () => {
    try {
      await registrationService.markAttendance(selectedRegistration.id, 'REMOVED');
      success('Student removed from event');
      setShowConfirm(false);
      refetch();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to remove student');
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  if (loading) return <Loading />;

  const handleActionClick = (reg, act) => {
    setSelectedRegistration(reg);
    setAction(act);
    setShowConfirm(true);
  };

  return (
    <div className="event-registrations">
      <div className="registrations-header">
        <h1>Event Registrations</h1>
        <p>Manage student registrations for this event</p>
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
            { value: 'REMOVED', label: 'Removed' }
          ]}
        />
      </div>

      {data?.content?.length > 0 ? (
        <>
          <div className="registrations-table-container">
            <table className="registrations-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map(reg => (
                  <tr key={reg.id}>
                    <td>{reg.student?.name}</td>
                    <td>{reg.student?.email}</td>
                    <td>{new Date(reg.registrationDate).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="actions-cell">
                      {reg.status === 'REGISTERED' && (
                        <>
                          <Button
                            variant="success"
                            size="small"
                            onClick={() => handleActionClick(reg, 'attend')}
                          >
                            Mark Attended
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => handleActionClick(reg, 'remove')}
                          >
                            Remove
                          </Button>
                        </>
                      )}
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
        <div className="no-registrations">
          <p>No registrations found.</p>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        title={action === 'attend' ? 'Mark as Attended' : 'Remove Student'}
        message={action === 'attend'
          ? `Mark ${selectedRegistration?.student?.name} as attended?`
          : `Remove ${selectedRegistration?.student?.name} from this event?`
        }
        onConfirm={action === 'attend' ? handleMarkAttended : handleRemoveStudent}
        onCancel={() => setShowConfirm(false)}
        confirmText={action === 'attend' ? 'Mark Attended' : 'Remove'}
        isDangerous={action === 'remove'}
      />
    </div>
  );
};

export default EventRegistrations;
