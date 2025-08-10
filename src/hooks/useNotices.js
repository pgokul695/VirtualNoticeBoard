import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useNotices = (category = null, subcategory = null) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0
  });

  const fetchNotices = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        per_page: pagination.perPage,
        include_expired: false
      };
      
      if (category) params.category = category;
      if (subcategory) params.subcategory = subcategory;
      
      const data = await apiService.getNotices(params);
      
      // Update notices and pagination
      setNotices(data);
      setPagination(prev => ({
        ...prev,
        page,
        total: data.total || 0,
        totalPages: Math.ceil((data.total || 0) / pagination.perPage)
      }));
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch notices:', err);
      setError(err.message || 'Failed to load notices. Please try again later.');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, [category, subcategory, pagination.perPage]);
  
  // Function to change page
  const changePage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchNotices(newPage);
    }
  }, [fetchNotices, pagination.totalPages]);

  useEffect(() => {
    fetchNotices();
  }, [category, subcategory, fetchNotices]);

  const createNotice = async (noticeData) => {
    try {
      const newNotice = await apiService.createNotice(noticeData);
      await fetchNotices(); // Refresh the notices list
      return { success: true, data: newNotice };
    } catch (error) {
      console.error('Failed to create notice:', error);
      return { success: false, error: error.message };
    }
  };

  const updateNotice = async (noticeId, noticeData) => {
    try {
      const updatedNotice = await apiService.updateNotice(noticeId, noticeData);
      await fetchNotices(); // Refresh the notices list
      return { success: true, data: updatedNotice };
    } catch (error) {
      console.error('Failed to update notice:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteNotice = async (noticeId) => {
    try {
      await apiService.deleteNotice(noticeId);
      await fetchNotices(); // Refresh the notices list
      return { success: true };
    } catch (error) {
      console.error('Failed to delete notice:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    notices,
    loading,
    error,
    pagination,
    changePage,
    createNotice,
    updateNotice,
    deleteNotice,
    refreshNotices: fetchNotices
  };
};

export const useSubcategories = () => {
  const [subcategories, setSubcategories] = useState({
    departments: [],
    clubs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSubcategories();
      setSubcategories({
        departments: data.departments || [],
        clubs: data.clubs || []
      });
      setError(null);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
      // Fallback to default subcategories
      setSubcategories({
        departments: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'MBA', 'MCA'],
        clubs: ['IEEE', 'Coding Club', 'Debate Society', 'Music Club', 'Drama Club', 'Photography Club', 'Sports Club']
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return {
    subcategories,
    loading,
    error,
    refresh: fetchSubcategories
  };
};
