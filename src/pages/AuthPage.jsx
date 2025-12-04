import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import '../styles/AuthPage.css';
import '../styles/global.css';

const AuthPage = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    company: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          onNavigate('dashboard');
        }
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              company: formData.company,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          setMessage('Check your email to confirm your account!');
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMessage('Password reset email sent!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
        <div className="auth-grid"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo" onClick={() => onNavigate('landing')}>
            <div className="logo">
              <span className="logo-icon">N</span>
              <span className="logo-text">Norvo<span className="logo-highlight">.AI</span></span>
            </div>
          </div>

          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Sign in to access your automations' 
                : 'Start automating your workflow today'
              }
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="oauth-buttons">
            <button 
              className="oauth-btn"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button 
              className="oauth-btn"
              onClick={() => handleOAuthLogin('github')}
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="input"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Company (Optional)</label>
                  <input
                    type="text"
                    name="company"
                    className="input"
                    placeholder="Acme Inc"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                name="email"
                className="input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                name="password"
                className="input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            {isLogin && (
              <button 
                type="button" 
                className="forgot-password"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            )}

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="auth-message">{message}</div>}

            <button 
              type="submit" 
              className="btn btn-primary btn-lg btn-block"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="auth-toggle">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)}>Sign up</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)}>Sign in</button>
              </>
            )}
          </div>

          {/* Back to home */}
          <button className="back-home" onClick={() => onNavigate('landing')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to home
          </button>
        </div>

        {/* Features side */}
        <div className="auth-features">
          <h2 className="features-title">
            Automate your workflow with <span className="text-gradient">AI</span>
          </h2>
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-item-icon blue">🔄</div>
              <div className="feature-item-content">
                <h3>Two-Way Sync</h3>
                <p>Keep Jira and Notion perfectly synchronized</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-item-icon orange">📝</div>
              <div className="feature-item-content">
                <h3>AI Documentation</h3>
                <p>Generate PRDs and specs automatically</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-item-icon purple">🤖</div>
              <div className="feature-item-content">
                <h3>Smart Agent</h3>
                <p>Predict delays and manage your backlog</p>
              </div>
            </div>
          </div>
          <div className="auth-testimonial">
            <p>"Norvo.AI transformed how our team manages projects. We save 20+ hours every week."</p>
            <div className="testimonial-author">
              <div className="author-avatar">SC</div>
              <div>
                <div className="author-name">Sarah Chen</div>
                <div className="author-role">Engineering Manager, TechStart</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;