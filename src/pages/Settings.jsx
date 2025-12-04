import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import Sidebar from '../components/Sidebar';
import '../styles/Settings.css';

const Settings = ({ session, onNavigate, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profile, setProfile] = useState({
    fullName: session?.user?.user_metadata?.full_name || '',
    email: session?.user?.email || '',
    company: session?.user?.user_metadata?.company || '',
    role: 'Product Manager'
  });

  const [notifications, setNotifications] = useState({
    emailDigest: true,
    taskAlerts: true,
    weeklyReport: true,
    slackNotifications: false,
    automationFailures: true
  });

  const [integrations, setIntegrations] = useState({
    jira: { connected: true, workspace: 'my-company.atlassian.net' },
    notion: { connected: true, workspace: 'My Company' },
    slack: { connected: false, workspace: null },
    github: { connected: false, workspace: null }
  });

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          company: profile.company
        }
      });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar 
        currentPage="settings" 
        onNavigate={onNavigate} 
        onSignOut={onSignOut}
        user={session?.user}
      />
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">Settings</h1>
            <p className="header-subtitle">Manage your account and preferences.</p>
          </div>
        </header>

        <div className="settings-content">
          <div className="settings-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="settings-panel">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="settings-section">
                <h2 className="settings-section-title">Profile Information</h2>
                <p className="settings-section-desc">Update your personal details and preferences.</p>

                {message.text && (
                  <div className={`settings-message ${message.type}`}>
                    {message.text}
                  </div>
                )}

                <div className="profile-form">
                  <div className="profile-avatar-section">
                    <div className="profile-avatar">
                      {profile.fullName?.[0] || 'U'}
                    </div>
                    <button className="btn btn-secondary btn-sm">Change Avatar</button>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label className="input-label">Full Name</label>
                      <input
                        type="text"
                        className="input"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Email</label>
                      <input
                        type="email"
                        className="input"
                        value={profile.email}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label className="input-label">Company</label>
                      <input
                        type="text"
                        className="input"
                        value={profile.company}
                        onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Role</label>
                      <select 
                        className="input"
                        value={profile.role}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      >
                        <option>Product Manager</option>
                        <option>Engineering Manager</option>
                        <option>Developer</option>
                        <option>Designer</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={handleProfileSave}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="settings-section">
                <h2 className="settings-section-title">Connected Integrations</h2>
                <p className="settings-section-desc">Manage your tool connections and permissions.</p>

                <div className="integrations-list">
                  <div className={`integration-item ${integrations.jira.connected ? 'connected' : ''}`}>
                    <div className="integration-icon">
                      <img src="https://cdn.worldvectorlogo.com/logos/jira-1.svg" alt="Jira" />
                    </div>
                    <div className="integration-info">
                      <h3>Jira</h3>
                      {integrations.jira.connected ? (
                        <span className="integration-workspace">{integrations.jira.workspace}</span>
                      ) : (
                        <span className="integration-status">Not connected</span>
                      )}
                    </div>
                    <div className="integration-actions">
                      {integrations.jira.connected ? (
                        <>
                          <button className="btn btn-ghost btn-sm">Configure</button>
                          <button className="btn btn-secondary btn-sm">Disconnect</button>
                        </>
                      ) : (
                        <button className="btn btn-primary btn-sm">Connect</button>
                      )}
                    </div>
                  </div>

                  <div className={`integration-item ${integrations.notion.connected ? 'connected' : ''}`}>
                    <div className="integration-icon">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" alt="Notion" />
                    </div>
                    <div className="integration-info">
                      <h3>Notion</h3>
                      {integrations.notion.connected ? (
                        <span className="integration-workspace">{integrations.notion.workspace}</span>
                      ) : (
                        <span className="integration-status">Not connected</span>
                      )}
                    </div>
                    <div className="integration-actions">
                      {integrations.notion.connected ? (
                        <>
                          <button className="btn btn-ghost btn-sm">Configure</button>
                          <button className="btn btn-secondary btn-sm">Disconnect</button>
                        </>
                      ) : (
                        <button className="btn btn-primary btn-sm">Connect</button>
                      )}
                    </div>
                  </div>

                  <div className={`integration-item ${integrations.slack.connected ? 'connected' : ''}`}>
                    <div className="integration-icon">
                      <img src="https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" alt="Slack" />
                    </div>
                    <div className="integration-info">
                      <h3>Slack</h3>
                      <span className="integration-status">Not connected</span>
                    </div>
                    <div className="integration-actions">
                      <button className="btn btn-primary btn-sm">Connect</button>
                    </div>
                  </div>

                  <div className={`integration-item ${integrations.github.connected ? 'connected' : ''}`}>
                    <div className="integration-icon">
                      <img src="https://cdn.worldvectorlogo.com/logos/github-icon-1.svg" alt="GitHub" />
                    </div>
                    <div className="integration-info">
                      <h3>GitHub</h3>
                      <span className="integration-status">Not connected</span>
                    </div>
                    <div className="integration-actions">
                      <button className="btn btn-primary btn-sm">Connect</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="settings-section">
                <h2 className="settings-section-title">Notification Preferences</h2>
                <p className="settings-section-desc">Control how and when you receive notifications.</p>

                <div className="notifications-list">
                  {Object.entries({
                    emailDigest: { label: 'Daily Email Digest', desc: 'Summary of daily automation activity' },
                    taskAlerts: { label: 'Task Alerts', desc: 'Get notified when tasks are created or updated' },
                    weeklyReport: { label: 'Weekly Report', desc: 'Receive weekly progress summary' },
                    slackNotifications: { label: 'Slack Notifications', desc: 'Send alerts to Slack channel' },
                    automationFailures: { label: 'Automation Failures', desc: 'Alert when automations fail' }
                  }).map(([key, { label, desc }]) => (
                    <div key={key} className="notification-item">
                      <div className="notification-info">
                        <h3>{label}</h3>
                        <p>{desc}</p>
                      </div>
                      <button
                        className={`toggle-switch ${notifications[key] ? 'active' : ''}`}
                        onClick={() => handleNotificationToggle(key)}
                      >
                        <span className="toggle-track">
                          <span className="toggle-thumb"></span>
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="settings-section">
                <h2 className="settings-section-title">Billing & Subscription</h2>
                <p className="settings-section-desc">Manage your subscription and payment methods.</p>

                <div className="billing-plan">
                  <div className="current-plan">
                    <div className="plan-badge">Current Plan</div>
                    <h3 className="plan-name">Small Team</h3>
                    <div className="plan-price">$29<span>/month</span></div>
                    <ul className="plan-features">
                      <li>3 workspaces</li>
                      <li>25 automations</li>
                      <li>Full AI features</li>
                      <li>Priority support</li>
                    </ul>
                  </div>
                  <div className="plan-actions">
                    <button className="btn btn-primary">Upgrade Plan</button>
                    <button className="btn btn-ghost">View Invoices</button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="settings-section">
                <h2 className="settings-section-title">Security Settings</h2>
                <p className="settings-section-desc">Manage your account security and access.</p>

                <div className="security-options">
                  <div className="security-item">
                    <div className="security-info">
                      <h3>Change Password</h3>
                      <p>Update your account password</p>
                    </div>
                    <button className="btn btn-secondary">Change</button>
                  </div>
                  <div className="security-item">
                    <div className="security-info">
                      <h3>Two-Factor Authentication</h3>
                      <p>Add an extra layer of security</p>
                    </div>
                    <button className="btn btn-secondary">Enable</button>
                  </div>
                  <div className="security-item danger">
                    <div className="security-info">
                      <h3>Delete Account</h3>
                      <p>Permanently delete your account and data</p>
                    </div>
                    <button className="btn btn-ghost danger-btn">Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;