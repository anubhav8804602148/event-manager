import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { Card, CardBody, CardHeader } from '../common/Card';
import { Button } from '../common/Button';
import { FormInput } from '../common/FormInput';
import { Loading } from '../common/Loading';
import './Student.css';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { success, error: showError } = useNotification();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await userService.updateProfile(profileData);
      updateProfile(response.data);
      success('Profile updated successfully');
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await userService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings</p>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Personal Information
        </button>
        <button
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </button>
        <button
          className={`tab-button ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
      </div>

      {activeTab === 'info' && (
        <Card className="profile-card">
          <CardHeader>
            <h2>Personal Information</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <FormInput
                name="email"
                label="Email Address"
                type="email"
                value={profileData.email}
                disabled
                required
              />

              <FormInput
                name="name"
                label="Full Name"
                type="text"
                value={profileData.name}
                onChange={handleProfileChange}
                error={errors.name}
                required
              />

              <FormInput
                name="phone"
                label="Phone Number (Optional)"
                type="tel"
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="+1 (555) 000-0000"
              />

              <FormInput
                name="department"
                label="Department (Optional)"
                type="text"
                value={profileData.department}
                onChange={handleProfileChange}
                placeholder="e.g., Computer Science"
              />

              <div className="form-actions">
                <Button type="submit" variant="primary" loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {activeTab === 'password' && (
        <Card className="profile-card">
          <CardHeader>
            <h2>Change Password</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleChangePassword} className="profile-form">
              <FormInput
                name="currentPassword"
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                error={errors.currentPassword}
                required
              />

              <FormInput
                name="newPassword"
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                error={errors.newPassword}
                required
              />

              <FormInput
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                error={errors.confirmPassword}
                required
              />

              <div className="form-actions">
                <Button type="submit" variant="primary" loading={loading}>
                  Change Password
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {activeTab === 'activity' && (
        <Card className="profile-card">
          <CardHeader>
            <h2>Account Activity</h2>
          </CardHeader>
          <CardBody>
            <p>Account created: {new Date(user?.createdAt).toLocaleDateString()}</p>
            <p>Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Profile;
