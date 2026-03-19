import React, { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useNotification } from '../../hooks/useNotification';
import { userService } from '../../services/userService';
import { Card, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import { FormInput } from '../common/FormInput';
import { Loading } from '../common/Loading';
import { Pagination } from '../common/Pagination';
import { Modal, ConfirmModal } from '../common/Modal';
import './Admin.css';

export const ManageUsers = () => {
  const { success, error: showError } = useNotification();
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);

  const { data, loading, refetch } = useFetch(
    () => searchQuery
      ? userService.searchUsers(searchQuery, page, 10)
      : userService.getAllUsers(page, 10),
    [page, searchQuery]
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleToggleStatus = async () => {
    try {
      await userService.toggleUserStatus(selectedUser.id, !selectedUser.enabled);
      success(`User account ${selectedUser.enabled ? 'disabled' : 'enabled'}`);
      setShowStatusConfirm(false);
      refetch();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="manage-users">
      <div className="manage-header">
        <h1>Manage Users</h1>
      </div>

      <div className="manage-filters">
        <FormInput
          name="search"
          label="Search Users"
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name or email..."
        />
      </div>

      {data?.content?.length > 0 ? (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th>Events Attended</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.content.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>0</td>
                    <td>
                      <span className={`status-badge ${user.enabled ? 'active' : 'inactive'}`}>
                        {user.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserDetails(true);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant={user.enabled ? 'danger' : 'success'}
                        size="small"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowStatusConfirm(true);
                        }}
                      >
                        {user.enabled ? 'Disable' : 'Enable'}
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
        <div className="no-users">
          <p>No users found.</p>
        </div>
      )}

      <Modal
        isOpen={showUserDetails}
        title={`User Profile: ${selectedUser?.name}`}
        onClose={() => setShowUserDetails(false)}
      >
        {selectedUser && (
          <div className="user-details">
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Registered:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedUser.enabled ? 'Active' : 'Inactive'}</p>
            <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
            <p><strong>Department:</strong> {selectedUser.department || 'N/A'}</p>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={showStatusConfirm}
        title={`${selectedUser?.enabled ? 'Disable' : 'Enable'} User`}
        message={`Are you sure you want to ${selectedUser?.enabled ? 'disable' : 'enable'} this user account?`}
        onConfirm={handleToggleStatus}
        onCancel={() => setShowStatusConfirm(false)}
        confirmText={selectedUser?.enabled ? 'Disable' : 'Enable'}
        isDangerous={selectedUser?.enabled}
      />
    </div>
  );
};

export default ManageUsers;
