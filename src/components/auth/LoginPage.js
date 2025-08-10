import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

const LoginPage = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isSigningUp) {
      result = await signUp(email, password, { name });
    } else {
      result = await signIn(email, password);
    }

    if (!result.success) {
      setError(result.error || 'An unexpected error occurred.');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isSigningUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p>{isSigningUp ? 'Join our community' : 'Sign in to your account'}</p>
        </div>

        {error && <div className="error-message-auth">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isSigningUp && (
            <div className="form-field">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="form-field">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : (isSigningUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="auth-divider">or</div>
        
        {/* Placeholder for Google/Social Sign In */}
        <button className="btn btn-secondary w-full" disabled={loading}>
          Continue with Google
        </button>

        <div className="auth-toggle-link">
          {isSigningUp ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsSigningUp(!isSigningUp)}>
            {isSigningUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
