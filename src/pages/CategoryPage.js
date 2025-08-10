import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import NoticeList from '../components/notices/NoticeList';
import { useAuth } from '../contexts/AuthContext';

const CategoryPage = () => {
  const { name } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  // Determine the category type ('department' or 'club') from the URL
  const category = location.pathname.startsWith('/departments') ? 'department' : 'club';

  return (
    <div style={{ padding: '2rem', maxWidth: '80rem', marginInline: 'auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', textTransform: 'capitalize' }}>
          {category}: <span style={{ color: 'var(--color-primary)' }}>{name}</span>
        </h1>
        <p style={{ color: 'var(--color-texxt-muted)' }}>
          Showing all notices for the {name} {category}.
        </p>
      </div>
      <NoticeList 
        category={category} 
        subcategory={name} 
        userRole={user?.role} 
      />
    </div>
  );
};

export default CategoryPage;
