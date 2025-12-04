import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import '../styles/Automations.css';

const Automations = ({ session, onNavigate, onSignOut }) => {
  const [automations, setAutomations] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = () => {
    // Mock data - in real app, fetch from Supabase
    setAutomations([
      {
        id: 1,
        name: 'Meeting Notes → Jira Tasks',
        description: 'Automatically convert meeting notes from Notion into Jira epics, stories, and subtasks with AI-generated acceptance criteria.',
        trigger: 'When a new page is added to "Meeting Notes" in Notion',
        status: 'active',
        lastRun: '2 minutes ago',
        totalRuns: 156,
        successRate: 98,
        icon: '📋',
        color: 'blue'
      },
      {
        id: 2,
        name: 'Daily Notion ↔ Jira Sync',
        description: 'Keep Notion project pages synchronized with Jira tickets. Updates flow both ways automatically.',
        trigger: 'Every day at 9:00 AM',
        status: 'active',
        lastRun: '1 hour ago',
        totalRuns: 342,
        successRate: 99,
        icon: '🔄',
        color: 'purple'
      },
      {
        id: 3,
        name: 'Weekly Progress Report',
        description: 'Generate comprehensive weekly progress reports from Jira data and insert them into Notion.',
        trigger: 'Every Friday at 5:00 PM',
        status: 'active',
        lastRun: '3 days ago',
        totalRuns: 24,
        successRate: 100,
        icon: '📊',
        color: 'orange'
      },
      {
        id: 4,
        name: 'Backlog Cleanup Suggestions',
        description: 'AI analyzes your backlog and suggests tasks to archive, merge, or prioritize.',
        trigger: 'Every Monday at 10:00 AM',
        status: 'paused',
        lastRun: '1 week ago',
        totalRuns: 12,
        successRate: 95,
        icon: '🧹',
        color: 'blue'
      },
      {
        id: 5,
        name: 'Overdue Task Alerts',
        description: 'Get Slack notifications when tasks become overdue or at risk.',
        trigger: 'Real-time monitoring',
        status: 'active',
        lastRun: '5 hours ago',
        totalRuns: 89,
        successRate: 100,
        icon: '⚠️',
        color: 'orange'
      },
      {
        id: 6,
        name: 'Sprint Summary Generator',
        description: 'Automatically generate sprint retrospective summaries at the end of each sprint.',
        trigger: 'When sprint ends in Jira',
        status: 'active',
        lastRun: '1 week ago',
        totalRuns: 8,
        successRate: 100,
        icon: '🏃',
        color: 'purple'
      }
    ]);
  };

  const templates = [
    {
      id: 'meeting-to-tasks',
      name: 'Meeting Notes → Tasks',
      description: 'Convert meeting notes to Jira tasks with AI',
      icon: '📋',
      color: 'blue',
      popular: true
    },
    {
      id: 'bidirectional-sync',
      name: 'Notion ↔ Jira Sync',
      description: 'Two-way synchronization between tools',
      icon: '🔄',
      color: 'purple',
      popular: true
    },
    {
      id: 'prd-generator',
      name: 'PRD Generator',
      description: 'Generate PRDs from feature requests',
      icon: '📝',
      color: 'orange',
      popular: false
    },
    {
      id: 'weekly-report',
      name: 'Weekly Report',
      description: 'Automated progress reports',
      icon: '📊',
      color: 'blue',
      popular: true
    },
    {
      id: 'backlog-cleanup',
      name: 'Backlog Cleanup',
      description: 'AI suggestions for backlog management',
      icon: '🧹',
      color: 'purple',
      popular: false
    },
    {
      id: 'release-notes',
      name: 'Release Notes',
      description: 'Auto-generate release notes from tickets',
      icon: '🚀',
      color: 'orange',
      popular: false
    }
  ];

  const toggleAutomationStatus = (id) => {
    setAutomations(automations.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'paused' : 'active' } : a
    ));
  };

  const filteredAutomations = automations.filter(a => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar 
        currentPage="automations" 
        onNavigate={onNavigate} 
        onSignOut={onSignOut}
        user={session?.user}
      />
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">Automations</h1>
            <p className="header-subtitle">
              Create and manage your AI-powered workflow automations.
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Automation
            </button>
          </div>
        </header>

        <div className="automations-content">
          {/* Filters */}
          <div className="automations-filters">
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({automations.length})
              </button>
              <button 
                className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active ({automations.filter(a => a.status === 'active').length})
              </button>
              <button 
                className={`filter-tab ${filter === 'paused' ? 'active' : ''}`}
                onClick={() => setFilter('paused')}
              >
                Paused ({automations.filter(a => a.status === 'paused').length})
              </button>
            </div>
            <div className="filter-search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Search automations..." />
            </div>
          </div>

          {/* Automations Grid */}
          <div className="automations-grid">
            {filteredAutomations.map((automation) => (
              <div key={automation.id} className={`automation-card automation-card-${automation.color}`}>
                <div className="automation-card-header">
                  <span className={`automation-icon automation-icon-${automation.color}`}>
                    {automation.icon}
                  </span>
                  <div className="automation-actions">
                    <button 
                      className={`status-toggle ${automation.status}`}
                      onClick={() => toggleAutomationStatus(automation.id)}
                    >
                      <span className="toggle-track">
                        <span className="toggle-thumb"></span>
                      </span>
                    </button>
                    <button className="action-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <h3 className="automation-card-title">{automation.name}</h3>
                <p className="automation-card-description">{automation.description}</p>

                <div className="automation-trigger">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  {automation.trigger}
                </div>

                <div className="automation-card-stats">
                  <div className="stat-item">
                    <span className="stat-number">{automation.totalRuns}</span>
                    <span className="stat-text">Total runs</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{automation.successRate}%</span>
                    <span className="stat-text">Success rate</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{automation.lastRun}</span>
                    <span className="stat-text">Last run</span>
                  </div>
                </div>

                <div className="automation-card-footer">
                  <button className="btn btn-ghost btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    Run Now
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    Logs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Automation</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <p className="modal-description">
                Choose a template to get started quickly, or create a custom automation.
              </p>

              <div className="templates-section">
                <h3>Popular Templates</h3>
                <div className="templates-grid">
                  {templates.filter(t => t.popular).map((template) => (
                    <button
                      key={template.id}
                      className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <span className={`template-icon template-icon-${template.color}`}>
                        {template.icon}
                      </span>
                      <div className="template-info">
                        <span className="template-name">{template.name}</span>
                        <span className="template-desc">{template.description}</span>
                      </div>
                      {selectedTemplate === template.id && (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="templates-section">
                <h3>All Templates</h3>
                <div className="templates-grid">
                  {templates.filter(t => !t.popular).map((template) => (
                    <button
                      key={template.id}
                      className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <span className={`template-icon template-icon-${template.color}`}>
                        {template.icon}
                      </span>
                      <div className="template-info">
                        <span className="template-name">{template.name}</span>
                        <span className="template-desc">{template.description}</span>
                      </div>
                      {selectedTemplate === template.id && (
                        <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                disabled={!selectedTemplate}
              >
                Continue with Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Automations;