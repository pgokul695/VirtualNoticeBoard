import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, BookOpen, Users, Calendar, Clock } from 'lucide-react';
import NoticeList from '../components/notices/NoticeList';

const HomePage = ({ userRole }) => {
  const stats = [
    { name: 'Total Notices', value: '1,234', icon: Bell },
    { name: 'Active Students', value: '5,678', icon: Users },
    { name: 'Upcoming Events', value: '24', icon: Calendar },
    { name: 'Avg. Response Time', value: '2.4h', icon: Clock },
  ];

  const featuredNotices = [
    { id: 1, title: "Welcome to New Academic Year 2025", content: "We are thrilled to welcome all new and returning students...", category: "main", priority: "high", author: "Main Office" },
    { id: 2, title: "IEEE Workshop on Machine Learning", content: "Join us for an exciting, hands-on workshop...", category: "club", subcategory: "IEEE", priority: "medium", author: "IEEE Club" },
    { id: 3, title: "CSE Department Lab Schedule Update", content: "The updated lab schedules for all CSE courses are now available...", category: "department", subcategory: "CSE", priority: "medium", author: "CSE Dept." }
  ];

  const quickLinks = [
    { name: 'Academic Calendar', href: '#', icon: Calendar },
    { name: 'Course Materials', href: '#', icon: BookOpen },
    { name: 'Student Portal', href: '#', icon: Users },
  ];

  const recentActivity = [
    { id: 1, user: 'Gokul P', action: 'created a new notice', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'updated the academic calendar', time: '5 hours ago' },
    { id: 3, user: 'Admin', action: 'posted exam schedule', time: '1 day ago' },
  ];

  return (
    <div className="home-container">
      <div className="welcome-banner">
        <h1>Welcome back, {userRole === 'admin' ? 'Admin' : 'Student'}!</h1>
        <p>Stay updated with the latest announcements, events, and important notices from your college.</p>
      </div>

      <div className="home-stats-grid">
        {stats.map((stat) => (
          <div key={stat.name} className="home-stat-card">
            <div className="stat-icon-wrapper">
              <stat.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="stat-info">
              <dt>{stat.name}</dt>
              <dd>{stat.value}</dd>
            </div>
          </div>
        ))}
      </div>

      <div className="home-main-content">
        <div className="featured-notices-column">
          <div className="section-header">
            <h2>Featured Notices</h2>
            <Link to="/notices" className="view-all-link">View all →</Link>
          </div>
          <div className="featured-notices-list">
            {featuredNotices.map((notice) => (
              <div key={notice.id} className="featured-notice-card">
                <div className="featured-notice-header">
                  <span className={`badge priority-${notice.priority}`}>{notice.priority} priority</span>
                  {notice.subcategory && <span className="badge badge-subcategory">{notice.subcategory}</span>}
                </div>
                <h3 className="featured-notice-title">
                  <Link to={`/notices/${notice.id}`}>{notice.title}</Link>
                </h3>
                <p className="featured-notice-content">{notice.content}</p>
                <div className="featured-notice-footer">
                  <div className="author-info">
                    <div className="author-avatar">{notice.author.charAt(0)}</div>
                    <span>{notice.author}</span>
                  </div>
                  <Link to={`/notices/${notice.id}`} className="read-more-link">Read more →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-column">
          <div className="quick-links-card">
            <h3>Quick Links</h3>
            <div className="quick-links-list">
              {quickLinks.map((link) => (
                <a key={link.name} href={link.href} className="quick-link-item">
                  <div className="quick-link-icon"><link.icon /></div>
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {userRole === 'admin' && (
            <div className="activity-card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="home-activity-item">
                     <div className="activity-avatar">{activity.user.charAt(0)}</div>
                     <div className="activity-text-wrapper">
                       <p><span className="font-semibold">{activity.user}</span> {activity.action}.</p>
                       <p className="time">{activity.time}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="latest-notices-section">
        <h2>Latest Notices</h2>
        <div className="latest-notices-list">
           <NoticeList category="main" userRole={userRole} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
