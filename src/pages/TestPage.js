import React from 'react';

const TestPage = () => {
  const envVars = {
    'REACT_APP_FIREBASE_API_KEY': process.env.REACT_APP_FIREBASE_API_KEY ? 'Present' : 'Missing',
    'REACT_APP_FIREBASE_AUTH_DOMAIN': process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'Missing',
    'REACT_APP_FIREBASE_PROJECT_ID': process.env.REACT_APP_FIREBASE_PROJECT_ID || 'Missing',
    'REACT_APP_FIREBASE_STORAGE_BUCKET': process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'Missing',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID': process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'Missing',
    'REACT_APP_FIREBASE_APP_ID': process.env.REACT_APP_FIREBASE_APP_ID || 'Missing',
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Environment Variables Test</h1>
        <div className="bg-gray-700 rounded-lg p-4">
          <pre className="text-green-400 text-sm overflow-x-auto">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Next Steps:</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Check if all Firebase environment variables are present (should not say 'Missing')</li>
            <li>Ensure the .env file is in the project root directory</li>
            <li>Make sure the .env file is named exactly <code>.env</code> (not .env.local, .env.development, etc.)</li>
            <li>Restart the development server after making changes to .env file</li>
            <li>Verify that the .env file is not in .gitignore (but make sure it's in .gitignore in production)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
