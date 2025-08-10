import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const getRoleBadgeClass = (role) => {
    if (role === 'admin') return 'badge-admin';
    return 'badge-user';
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <h3>Profile Information</h3>
            <p>Personal details and preferences</p>
          </div>
          <button onClick={signOut} className="btn btn-signout">
            Sign Out
          </button>
        </div>
        <dl className="profile-details-list">
          <div className="profile-detail-item">
            <dt className="profile-detail-term">Full name</dt>
            <dd className="profile-detail-description">{user.name || 'Not provided'}</dd>
          </div>
          <div className="profile-detail-item">
            <dt className="profile-detail-term">Email address</dt>
            <dd className="profile-detail-description">{user.email || 'Not provided'}</dd>
          </div>
          <div className="profile-detail-item">
            <dt className="profile-detail-term">Role</dt>
            <dd className="profile-detail-description">
              <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                {user.role || 'user'}
              </span>
            </dd>
          </div>
          <div className="profile-detail-item">
            <dt className="profile-detail-term">Department</dt>
            <dd className="profile-detail-description">{user.department || 'Not specified'}</dd>
          </div>
          <div className="profile-detail-item">
            <dt className="profile-detail-term">Account Status</dt>
            <dd className="profile-detail-description">
              {user.is_active ? (
                <span className="badge badge-active">Active</span>
              ) : (
                <span className="badge badge-inactive">Inactive</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProfilePage;
