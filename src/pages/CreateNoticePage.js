import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// The `useNotices` hook is no longer needed for creating a notice with the new endpoint.
// We keep `useSubcategories` to populate the dropdowns.
import { useSubcategories } from '../hooks/useNotices'; 
// import { useAuth } from '../contexts/AuthContext'; // Temporarily disabled for secret key auth
import { Save, Loader2, ArrowLeft } from 'lucide-react';

const CreateNoticePage = () => {
  const navigate = useNavigate();
  const { subcategories } = useSubcategories();
  
  // We now use a local state to handle the submission loading status.
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Clear validation error on change
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
    if (id === 'category') {
      setFormData(prev => ({ ...prev, subcategory: '' }));
      if (errors.subcategory) {
         setErrors(prev => ({ ...prev, subcategory: undefined }));
      }
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

  /**
   * Handles the form submission by sending data to the new bypass API endpoint.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({}); // Clear previous submission errors

    const priorityMap = {
      high: 3,
      medium: 2,
      low: 1,
    };
    
    // As per the API spec, an expires_at field is required.
    // Here, we calculate a date 30 days in the future.
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const noticeData = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      // API expects subcategory to be a string, or null if not applicable.
      subcategory: formData.category !== 'main' ? formData.subcategory : null,
      priority: priorityMap[formData.priority] || 0,
      expires_at: expiresAt.toISOString(), // Format date to ISO string
    };

    // The secret key is sent as a query parameter.
    const DEV_SECRET_KEY = "eNQLU0WqH37?";
    const apiUrl = `/api/v1/bypass/notices?secret=${encodeURIComponent(DEV_SECRET_KEY)}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(noticeData),
      });

      if (response.ok) { // Status 200
        navigate('/notices'); // Success, navigate away
      } else if (response.status === 422) {
        // Handle validation errors from the server
        const errorData = await response.json();
        const errorMessages = errorData.detail.map(err => `Error in '${err.loc[1]}': ${err.msg}`).join('. ');
        setErrors({ form: `Validation Error: ${errorMessages}` });
      } else {
        // Handle other server errors (e.g., 500, 401, 403)
        const errorText = await response.text();
        setErrors({ form: `Failed to create notice. Server responded with status ${response.status}. ${errorText}` });
      }
    } catch (error) {
      // Handle network errors or exceptions during the fetch call
      console.error("Submission failed:", error);
      setErrors({ form: 'A network error occurred. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false); // Ensure loading state is always turned off
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
          <input type="text" id="title" value={formData.title} onChange={handleChange} className={errors.title ? 'error' : ''} placeholder="Enter notice title" disabled={isSubmitting} />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="content">Content *</label>
          <textarea id="content" value={formData.content} onChange={handleChange} rows={10} className={errors.content ? 'error' : ''} placeholder="Enter notice content..." disabled={isSubmitting} />
          {errors.content && <p className="error-message">{errors.content}</p>}
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="category">Category *</label>
            <select id="category" value={formData.category} onChange={handleChange} disabled={isSubmitting}>
              <option value="main">Main Notice</option>
              <option value="department">Department</option>
              <option value="club">Club</option>
            </select>
          </div>

          {formData.category !== 'main' && (
            <div className="form-field">
              <label htmlFor="subcategory">{formData.category === 'department' ? 'Department' : 'Club'} *</label>
              <select id="subcategory" value={formData.subcategory} onChange={handleChange} className={errors.subcategory ? 'error' : ''} disabled={isSubmitting || !getSubcategoryOptions().length}>
                <option value="">Select...</option>
                {getSubcategoryOptions().map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              {errors.subcategory && <p className="error-message">{errors.subcategory}</p>}
            </div>
          )}

          <div className="form-field">
            <label htmlFor="priority">Priority</label>
            <select id="priority" value={formData.priority} onChange={handleChange} disabled={isSubmitting}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div className="notice-editor-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary" disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
            <span>Publish Notice</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNoticePage;
