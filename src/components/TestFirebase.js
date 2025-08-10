import React, { useEffect } from 'react';
import { auth } from '../firebase';

const TestFirebase = () => {
  useEffect(() => {
    console.log('Firebase Config:');
    console.log('API Key:', process.env.REACT_APP_FIREBASE_API_KEY ? 'Present' : 'Missing');
    console.log('Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
    console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
    console.log('Current User:', auth.currentUser);
  }, []);

  return (
    <div style={{ display: 'none' }}>
      Firebase Test Component - Check console for output
    </div>
  );
};

export default TestFirebase;
