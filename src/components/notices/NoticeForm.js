import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

const NoticeForm = ({ notice, onSave, onCancel, loading, subcategories }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'main',
    subcategory: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title || '',
        content: notice.content || '',
        category: notice.category || 'main',
        subcategory: notice.subcategory || '',
        priority: notice.priority || 'medium'
      });
    }
  }, [notice]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (id === 'category') {
        setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.category !== 'main' && !formData.subcategory) {
      newErrors.subcategory = 'Please select a subcategory';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
        ...formData,
        subcategory: formData.category !== 'main' ? formData.subcategory : null,
    });
  };

  const getSubcategoryOptions = () => {
    if (formData.category === 'department') return subcategories.departments || [];
    if (formData.category === 'club') return subcategories.clubs || [];
    return [];
  };

  return (
    <div className="notice-form-overlay">
      <div className="notice-form-container">
        <div className="notice-form-header">
          <div className="notice-form-header-content">
            <h2>{notice ? 'Edit Notice' : 'Add New Notice'}</h2>
            <button onClick={onCancel} className="close-btn" disabled={loading}>
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="notice-form-body">
          <div className="form-field">
            <label htmlFor="title">Title *</label>
            <input type="text" id="title" value={formData.title} onChange={handleChange} className={errors.title ? 'error' : ''} placeholder="Enter notice title" disabled={loading} />
            {errors.title && <p className="error-message">{errors.title}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="content">Content *</label>
            <textarea id="content" value={formData.content} onChange={handleChange} rows={6} className={errors.content ? 'error' : ''} placeholder="Enter notice content" disabled={loading} />
            {errors.content && <p className="error-message">{errors.content}</p>}
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="category">Category *</label>
              <select id="category" value={formData.category} onChange={handleChange} disabled={loading}>
                <option value="main">Main Notice</option>
                <option value="department">Department</option>
                <option value="club">Club</option>
              </select>
            </div>

            {formData.category !== 'main' && (
              <div className="form-field">
                <label htmlFor="subcategory">{formData.category === 'department' ? 'Department' : 'Club'} *</label>
                <select id="subcategory" value={formData.subcategory} onChange={handleChange} className={errors.subcategory ? 'error' : ''} disabled={loading || !getSubcategoryOptions().length}>
                  <option value="">Select...</option>
                  {getSubcategoryOptions().map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
                {errors.subcategory && <p className="error-message">{errors.subcategory}</p>}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="priority">Priority</label>
              <select id="priority" value={formData.priority} onChange={handleChange} disabled={loading}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="notice-form-footer">
            <button type="button" onClick={onCancel} disabled={loading} className="btn btn-cancel">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-submit">
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              <span>{loading ? 'Saving...' : (notice ? 'Update' : 'Publish')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeForm;
