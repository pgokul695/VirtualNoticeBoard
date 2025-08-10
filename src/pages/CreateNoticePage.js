import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotices, useSubcategories } from '../hooks/useNotices';
// import { useAuth } from '../contexts/AuthContext'; // Temporarily disabled for secret key auth
import { Save, Loader2, ArrowLeft } from 'lucide-react';

const CreateNoticePage = () => {
  const navigate = useNavigate();
  const { createNotice, loading } = useNotices();
  const { subcategories } = useSubcategories();
  // const { user } = useAuth(); // Temporarily disabled

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'main',
    subcategory: '',
    priority: 'medium', // Stays as a string for the form
  });
  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const priorityMap = {
      high: 3,
      medium: 2,
      low: 1,
    };
    
    const noticeData = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      subcategory: formData.category !== 'main' ? formData.subcategory : null,
      priority: priorityMap[formData.priority] || 0,
    };

    // --- CHANGE: Using a hardcoded secret key instead of user.token ---
    // Make sure this secret matches what your backend expects for this temporary setup.
    const DEV_SECRET_KEY = "eNQLU0WqH37?";
    
    const success = await createNotice(noticeData, DEV_SECRET_KEY); 
    
    if (success) {
      navigate('/notices');
    } else {
      setErrors({ form: 'Failed to create the notice. Please try again.' });
    }
  };

  const getSubcategoryOptions = () => {
    if (formData.category === 'department') return subcategories.departments || [];
    if (formData.category === 'club') return subcategories.clubs || [];
    return [];
  };

  return (
    <div className="create-notice-container">
      <div className="create-notice-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1>Create New Notice</h1>
        <p>Fill out the form below to publish a new notice to the board.</p>
      </div>

      <form onSubmit={handleSubmit} className="notice-editor-form">
        {errors.form && <div className="error-message-auth">{errors.form}</div>}
        
        <div className="form-field">
          <label htmlFor="title">Title *</label>
          <input type="text" id="title" value={formData.title} onChange={handleChange} className={errors.title ? 'error' : ''} placeholder="Enter notice title" disabled={loading} />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="content">Content *</label>
          <textarea id="content" value={formData.content} onChange={handleChange} rows={10} className={errors.content ? 'error' : ''} placeholder="Enter notice content..." disabled={loading} />
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
                {getSubcategoryOptions().map((item) => <option key={item} value={item}>{item}</option>)}
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
        
        <div className="notice-editor-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Save />}
            <span>Publish Notice</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNoticePage;
