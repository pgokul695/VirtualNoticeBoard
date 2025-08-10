import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, FileText, BarChart2, Activity, Clock, CheckCircle, XCircle, Bell } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, change, changeType = 'neutral' }) => (
  <div className={`stat-card`}>
    <div className="stat-icon"><Icon className="w-6 h-6" /></div>
    <div className="stat-content">
      <span className="stat-value">{value}</span>
      <h3 className="stat-label">{title}</h3>
      {change && (
        <span className={`stat-change ${changeType}`}>
          <Activity className="w-3.5 h-3.5" />
          <span>{change}</span>
        </span>
      )}
    </div>
  </div>
);

const ActivityItem = ({ user, action, target, time }) => {
  const getActionIcon = () => {
    switch (action) {
      case 'created': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'updated': return <Activity className="w-4 h-4 text-blue-400" />;
      case 'deleted': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="activity-item">
      <div className="activity-icon">{getActionIcon()}</div>
      <div className="activity-details">
        <div className="activity-text">
          <span className="font-medium">{user}</span> {action} <span className="text-blue-300">{target}</span>
        </div>
        <div className="activity-time">{time}</div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const mockStats = {
          totalUsers: 1248, activeNotices: 87,
          departments: [
            { name: 'CSE', count: 124 }, { name: 'ECE', count: 98 }, { name: 'EEE', count: 76 },
            { name: 'MECH', count: 65 }, { name: 'CIVIL', count: 43 }
          ],
          recentActivity: [
            { id: 1, user: 'John Doe', action: 'created', target: 'Notice #4582', time: '5 minutes ago' },
            { id: 2, user: 'Jane Smith', action: 'updated', target: 'Profile', time: '12 minutes ago' },
            { id: 3, user: 'Admin', action: 'deleted', target: 'User #2384', time: '1 hour ago' },
            { id: 4, user: 'Robert Johnson', action: 'created', target: 'Notice #4581', time: '2 hours ago' },
            { id: 5, user: 'Emily Davis', action: 'updated', target: 'Department Info', time: '3 hours ago' }
          ]
        };
        setStats(mockStats);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="loading-spinner-container"><div className="loading-spinner"></div></div>;
  if (error) return <div className="error-message-box">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name || 'Admin'}! Here's what's happening.</p>
      </div>

      <div className="dashboard-content">
        <main className="dashboard-main">
          <div className="stats-grid">
            <StatCard icon={Users} title="Total Users" value={stats.totalUsers.toLocaleString()} change="12% from last month" changeType="positive" />
            <StatCard icon={FileText} title="Active Notices" value={stats.activeNotices} change="5% from last week" changeType="positive" />
            <StatCard icon={BarChart2} title="Departments" value={stats.departments.length} change="No change" changeType="neutral" />
            <StatCard icon={Clock} title="Recent Activities" value={stats.recentActivity.length} change="3 new today" changeType="negative" />
          </div>

          <div className="dashboard-card">
            <h2>Departments</h2>
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr><th>Department</th><th>Users</th><th>Notices</th></tr>
                </thead>
                <tbody>
                  {stats.departments.map((dept) => (
                    <tr key={dept.name}>
                      <td>{dept.name}</td>
                      <td style={{ textAlign: 'right' }}>{dept.count}</td>
                      <td style={{ textAlign: 'right' }}>{Math.floor(dept.count * 0.7)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Recent Activity</h2>
              <button className="read-more-btn">View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {stats.recentActivity.map((activity) => <ActivityItem key={activity.id} {...activity} />)}
            </div>
          </div>
        </main>

        <aside className="dashboard-sidebar">
          <div className="dashboard-card">
            <h2>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/admin/create-notice" className="btn btn-primary">
                <FileText className="w-5 h-5" />
                <span>Create New Notice</span>
              </Link>
              <button className="btn btn-secondary"><Users className="w-5 h-5" /><span>Manage Users</span></button>
              <button className="btn btn-secondary"><BarChart2 className="w-5 h-5" /><span>View Analytics</span></button>
            </div>
          </div>

          <div className="dashboard-card">
            <h2>System Status</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Database</span><span className="text-green-400" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><div className="w-2 h-2 rounded-full bg-green-400"></div>Operational</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>API</span><span className="text-green-400" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><div className="w-2 h-2 rounded-full bg-green-400"></div>Operational</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Storage</span><span>45% used</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboard;
