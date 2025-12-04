import React, { useState, useEffect } from 'react';
import { supabase, db } from '../services/supabase';
import Sidebar from '../components/Sidebar';
import '../styles/DashBoard.css';

const Dashboard = ({ session, onNavigate, onSignOut }) => {
  const [stats, setStats] = useState({
    tasksCreated: 0,
    docsGenerated: 0,
    timeSaved: 0,
    automationsRun: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [session]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // In a real app, these would come from Supabase
      // For demo purposes, we'll use mock data
      setStats({
        tasksCreated: 247,
        docsGenerated: 89,
        timeSaved: 32,
        automationsRun: 1024
      });

      setRecentActivity([
        {
          id: 1,
          type: 'task_created',
          title: 'Created 5 Jira tasks from meeting notes',
          time: '2 minutes ago',
          icon: '📋'
        },
        {
          id: 2,
          type: 'doc_generated',
          title: 'Generated PRD for "User Authentication"',
          time: '15 minutes ago',
          icon: '📝'
        },
        {
          id: 3,
          type: 'sync',
          title: 'Synced 12 Notion pages to Jira',
          time: '1 hour ago',
          icon: '🔄'
        },
        {
          id: 4,
          type: 'report',
          title: 'Weekly progress report generated',
          time: '3 hours ago',
          icon: '📊'
        },
        {
          id: 5,
          type: 'alert',
          title: 'Detected 3 overdue tasks in Sprint 12',
          time: '5 hours ago',
          icon: '⚠️'
        }
      ]);

      setAutomations([
        {
          id: 1,
          name: 'Meeting Notes → Jira',
          description: 'Convert meeting notes to Jira tasks',
          status: 'active',
          lastRun: '2 min ago',
          runs: 156
        },
        {
          id: 2,
          name: 'Daily Sync',
          description: 'Sync Notion ↔ Jira daily',
          status: 'active',
          lastRun: '1 hour ago',
          runs: 342
        },
        {
          id: 3,
          name: 'Weekly Report',
          description: 'Generate weekly progress report',
          status: 'active',
          lastRun: '3 hours ago',
          runs: 24
        },
        {
          id: 4,
          name: 'Backlog Cleanup',
          description: 'AI suggestions for backlog management',
          status: 'paused',
          lastRun: '2 days ago',
          runs: 12
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: '📋',
      title: 'Create Tasks',
      description: 'Convert notes to Jira tasks',
      color: 'blue',
      action: () => onNavigate('automations')
    },
    {
      icon: '📝',
      title: 'Generate PRD',
      description: 'AI-powered documentation',
      color: 'orange',
      action: () => onNavigate('documentation')
    },
    {
      icon: '🔄',
      title: 'Sync Now',
      description: 'Manual Notion-Jira sync',
      color: 'purple',
      action: () => console.log('Sync')
    },
    {
      icon: '📊',
      title: 'View Reports',
      description: 'Analytics & insights',
      color: 'blue',
      action: () => console.log('Reports')
    }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar 
        currentPage="dashboard" 
        onNavigate={onNavigate} 
        onSignOut={onSignOut}
        user={session?.user}
      />
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">
              Welcome back, {session?.user?.user_metadata?.full_name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="header-subtitle">
              Here's what's happening with your automations today.
            </p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
            <button className="btn btn-primary" onClick={() => onNavigate('automations')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Automation
            </button>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">📋</div>
              <div className="stat-info">
                <span className="stat-value">{stats.tasksCreated}</span>
                <span className="stat-label">Tasks Created</span>
              </div>
              <div className="stat-trend positive">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
                +23%
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">📝</div>
              <div className="stat-info">
                <span className="stat-value">{stats.docsGenerated}</span>
                <span className="stat-label">Docs Generated</span>
              </div>
              <div className="stat-trend positive">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
                +18%
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple">⏱️</div>
              <div className="stat-info">
                <span className="stat-value">{stats.timeSaved}h</span>
                <span className="stat-label">Time Saved</span>
              </div>
              <div className="stat-trend positive">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
                +12%
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue">🤖</div>
              <div className="stat-info">
                <span className="stat-value">{stats.automationsRun.toLocaleString()}</span>
                <span className="stat-label">Automations Run</span>
              </div>
              <div className="stat-trend positive">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
                +45%
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <section className="quick-actions-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button 
                  key={index} 
                  className={`quick-action-card quick-action-${action.color}`}
                  onClick={action.action}
                >
                  <span className="quick-action-icon">{action.icon}</span>
                  <div className="quick-action-content">
                    <span className="quick-action-title">{action.title}</span>
                    <span className="quick-action-desc">{action.description}</span>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              ))}
            </div>
          </section>

          <div className="dashboard-grid">
            {/* Automations */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Active Automations</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('automations')}>
                  View All
                </button>
              </div>
              <div className="automations-list">
                {automations.map((automation) => (
                  <div key={automation.id} className="automation-item">
                    <div className="automation-info">
                      <div className="automation-header">
                        <span className="automation-name">{automation.name}</span>
                        <span className={`automation-status ${automation.status}`}>
                          {automation.status}
                        </span>
                      </div>
                      <span className="automation-desc">{automation.description}</span>
                    </div>
                    <div className="automation-stats">
                      <span className="automation-runs">{automation.runs} runs</span>
                      <span className="automation-time">Last: {automation.lastRun}</span>
                    </div>
                    <button className="automation-menu">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">Recent Activity</h2>
                <button className="btn btn-ghost btn-sm">View All</button>
              </div>
              <div className="activity-list">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <span className="activity-icon">{activity.icon}</span>
                    <div className="activity-content">
                      <span className="activity-title">{activity.title}</span>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Integration Status */}
          <section className="integrations-section">
            <h2 className="section-title">Connected Integrations</h2>
            <div className="integrations-grid">
              <div className="integration-card connected">
                <img src="https://cdn.worldvectorlogo.com/logos/jira-1.svg" alt="Jira" />
                <div className="integration-info">
                  <span className="integration-name">Jira</span>
                  <span className="integration-status">Connected</span>
                </div>
                <div className="integration-badge connected">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>

              <div className="integration-card connected">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" alt="Notion" />
                <div className="integration-info">
                  <span className="integration-name">Notion</span>
                  <span className="integration-status">Connected</span>
                </div>
                <div className="integration-badge connected">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>

              <div className="integration-card">
                <img src="https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" alt="Slack" />
                <div className="integration-info">
                  <span className="integration-name">Slack</span>
                  <span className="integration-status">Not connected</span>
                </div>
                <button className="btn btn-sm btn-secondary">Connect</button>
              </div>

              <div className="integration-card">
                <img src="https://cdn.worldvectorlogo.com/logos/github-icon-1.svg" alt="GitHub" />
                <div className="integration-info">
                  <span className="integration-name">GitHub</span>
                  <span className="integration-status">Not connected</span>
                </div>
                <button className="btn btn-sm btn-secondary">Connect</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;