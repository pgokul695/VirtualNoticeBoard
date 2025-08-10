import React, { useState } from 'react';
import { Calendar, Eye, User, Edit, Trash2 } from 'lucide-react';

const NoticeCard = ({ notice, onEdit, onDelete, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getPriorityClass = (priority) => {
    const priorityMap = { '3': 'high', '2': 'medium', '1': 'low' };
    const normalizedPriority = priorityMap[String(priority)] || String(priority).toLowerCase() || 'default';
    return `priority-${normalizedPriority}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      setDeleting(true);
      try {
        await onDelete(notice.id);
      } catch (error) {
        console.error('Failed to delete notice:', error);
        alert('Failed to delete notice');
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className="notice-card">
      <div className="notice-header">
        <div className="notice-title-wrapper">
          <div className={`notice-priority-dot ${getPriorityClass(notice.priority)}`}></div>
          <h3 className="notice-title">{notice.title}</h3>
        </div>
        <div className="notice-actions">
          {notice.subcategory && (
            <span className="notice-subcategory-badge">{notice.subcategory}</span>
          )}
          {userRole === 'admin' && (
            <div className="notice-admin-actions">
              <button onClick={() => onEdit(notice)} className="edit-btn" title="Edit notice">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={handleDelete} disabled={deleting} className="delete-btn" title="Delete notice">
                {deleting ? <span className="animate-spin">⏳</span> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className={`notice-content ${!isExpanded && notice.content.length > 150 ? 'line-clamp-3' : ''}`}>
        {notice.content}
      </p>
      
      <div className="notice-footer">
        <div className="notice-meta">
          <div className="notice-meta-item">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(notice.created_at || notice.createdAt)}</span>
          </div>
          {notice.views !== undefined && (
            <div className="notice-meta-item">
              <Eye className="w-4 h-4" />
              <span>{notice.views}</span>
            </div>
          )}
          {notice.author && (
            <div className="notice-meta-item">
              <User className="w-4 h-4" />
              <span>{notice.author}</span>
            </div>
          )}
        </div>
        {notice.content.length > 150 && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="read-more-btn">
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default NoticeCard;
