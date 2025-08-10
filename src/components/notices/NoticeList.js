import React, { useState } from 'react';
import { Search, Filter, X, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import NoticeCard from './NoticeCard';
import NoticeForm from './NoticeForm';
import { useNotices, useSubcategories } from '../../hooks/useNotices';

const NoticeList = ({ category = null, subcategory = null, userRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [filters, setFilters] = useState({
    priority: 'all',
    dateRange: 'all',
  });

  const { 
    notices, 
    loading, 
    error, 
    pagination, 
    changePage,
    createNotice, 
    updateNotice, 
    deleteNotice,
  } = useNotices(category, subcategory);
  
  const { subcategories } = useSubcategories();

  const filteredNotices = React.useMemo(() => {
    if (!notices) return [];
    
    return [...notices]
      .filter(notice => {
        const matchesSearch = !searchQuery || 
          notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (notice.content && notice.content.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesPriority = filters.priority === 'all' || notice.priority === filters.priority;
        
        let matchesDate = true;
        if (filters.dateRange !== 'all') {
          const noticeDate = new Date(notice.created_at || notice.createdAt);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (filters.dateRange === 'today') matchesDate = noticeDate >= today;
          else if (filters.dateRange === 'week') {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            matchesDate = noticeDate >= weekAgo;
          } else if (filters.dateRange === 'month') {
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            matchesDate = noticeDate >= monthAgo;
          }
        }
        
        return matchesSearch && matchesPriority && matchesDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt);
        const dateB = new Date(b.created_at || b.createdAt);
        
        switch(sortBy) {
          case 'latest': return dateB - dateA;
          case 'oldest': return dateA - dateB;
          case 'priority':
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          default: return 0;
        }
      });
  }, [notices, searchQuery, filters, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSortBy('latest');
    setFilters({ priority: 'all', dateRange: 'all' });
  };
  
  const handleEditNotice = (notice) => {
    setEditingNotice(notice);
    setShowAddForm(true);
  };

  const handleSave = async (noticeData) => {
    if (editingNotice) {
      await updateNotice(editingNotice.id, noticeData);
    } else {
      await createNotice(noticeData);
    }
    setShowAddForm(false);
    setEditingNotice(null);
  };

  return (
    <div className="notice-list-container">
      <div className="notice-list-header">
        <div className="search-input-wrapper">
          <div className="search-input-icon">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search notices..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="header-actions">
          <button onClick={() => setShowFilters(!showFilters)} className="btn btn-secondary">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          
          {(userRole === 'admin' || userRole === 'faculty') && (
            <button
              onClick={() => {
                setEditingNotice(null);
                setShowAddForm(true);
              }}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4" />
              Add Notice
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={() => setShowFilters(false)} aria-label="Close filters">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="filters-grid">
            <div>
              <label htmlFor="priority">Priority</label>
              <select id="priority" value={filters.priority} onChange={(e) => setFilters({...filters, priority: e.target.value})}>
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="dateRange">Date Range</label>
              <select id="dateRange" value={filters.dateRange} onChange={(e) => setFilters({...filters, dateRange: e.target.value})}>
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div className="clear-filters-wrapper">
              <button onClick={clearFilters} className="btn btn-secondary">
                <X className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && !notices?.length ? (
        <div className="loading-spinner-container"><div className="loading-spinner"></div></div>
      ) : error ? (
        <div className="error-message-box">{error}</div>
      ) : filteredNotices.length === 0 ? (
        <div className="no-results-container">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3>No notices found</h3>
          <p>Try adjusting your search or filter criteria.</p>
          <button type="button" onClick={clearFilters} className="btn btn-primary">
            <X className="h-4 w-4" />
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="notices-grid">
          {filteredNotices.map((notice) => (
            <NoticeCard 
              key={notice.id} 
              notice={notice} 
              onEdit={handleEditNotice} 
              onDelete={deleteNotice}
              userRole={userRole}
            />
          ))}
        </div>
      )}
      
      {pagination && pagination.total_pages > 1 && (
        <div className="pagination-container">
          <div className="pagination-summary">
            <p>
              Showing <span className="font-medium">{pagination.from}</span> to <span className="font-medium">{pagination.to}</span> of <span className="font-medium">{pagination.total}</span> results
            </p>
          </div>
          <nav className="pagination-nav" aria-label="Pagination">
            <button onClick={() => changePage(1)} disabled={pagination.current_page === 1}><ChevronsLeft className="h-5 w-5" /></button>
            <button onClick={() => changePage(pagination.current_page - 1)} disabled={pagination.current_page === 1}><ChevronLeft className="h-5 w-5" /></button>
            {/* Simplified Pagination Logic */}
            <button className="active">{pagination.current_page}</button>
            <button onClick={() => changePage(pagination.current_page + 1)} disabled={pagination.current_page === pagination.total_pages}><ChevronRight className="h-5 w-5" /></button>
            <button onClick={() => changePage(pagination.total_pages)} disabled={pagination.current_page === pagination.total_pages}><ChevronsRight className="h-5 w-5" /></button>
          </nav>
        </div>
      )}

      {(showAddForm || editingNotice) && (
        <NoticeForm
          notice={editingNotice}
          onSave={handleSave}
          onCancel={() => { setShowAddForm(false); setEditingNotice(null); }}
          subcategories={subcategories}
          loading={loading}
        />
      )}
    </div>
  );
};

export default NoticeList;
