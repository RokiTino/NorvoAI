import React, { useState, useEffect } from 'react';
import {
  fetchNotionDatabases,
  updateNotionConfig,
  syncNotionPages
} from '../lib/api/api-supabase-functions';
import '../styles/NotionSyncConfig.css';

const NotionSyncConfig = ({ workspaceId, currentConfig, onClose, onSave }) => {
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [syncResult, setSyncResult] = useState(null);

  const [config, setConfig] = useState({
    database_id: currentConfig?.database_id || '',
    sync_direction: currentConfig?.sync_direction || 'bidirectional',
    field_mapping: currentConfig?.field_mapping || {
      status: {
        todo: 'Not Started',
        in_progress: 'In Progress',
        done: 'Done',
      },
    },
  });

  useEffect(() => {
    loadDatabases();
  }, []);

  const loadDatabases = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchNotionDatabases(workspaceId);
      setDatabases(result.databases);
    } catch (err) {
      setError('Failed to load Notion databases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config.database_id) {
      setError('Please select a database');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await updateNotionConfig(workspaceId, config);
      onSave?.(config);
      onClose();
    } catch (err) {
      setError('Failed to save configuration');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSyncNow = async () => {
    try {
      setSyncing(true);
      setError(null);
      setSyncResult(null);
      const result = await syncNotionPages(workspaceId);
      setSyncResult(result);
    } catch (err) {
      setError('Sync failed: ' + err.message);
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleStatusMappingChange = (localStatus, notionStatus) => {
    setConfig({
      ...config,
      field_mapping: {
        ...config.field_mapping,
        status: {
          ...config.field_mapping.status,
          [localStatus]: notionStatus,
        },
      },
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content notion-config-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Notion Sync Configuration</h2>
          <button className="modal-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="config-error">
              {error}
            </div>
          )}

          {/* Database Selection */}
          <div className="config-section">
            <label className="config-label">Notion Database</label>
            <p className="config-desc">Select the database to sync tasks with</p>

            {loading ? (
              <div className="config-loading">Loading databases...</div>
            ) : (
              <select
                className="config-select"
                value={config.database_id}
                onChange={(e) => setConfig({ ...config, database_id: e.target.value })}
              >
                <option value="">Select a database</option>
                {databases.map((db) => (
                  <option key={db.id} value={db.id}>
                    {db.icon ? `${db.icon} ` : ''}{db.title}
                  </option>
                ))}
              </select>
            )}

            <button
              className="btn btn-ghost btn-sm refresh-btn"
              onClick={loadDatabases}
              disabled={loading}
            >
              Refresh list
            </button>
          </div>

          {/* Sync Direction */}
          <div className="config-section">
            <label className="config-label">Sync Direction</label>
            <p className="config-desc">Choose how tasks sync between your app and Notion</p>

            <div className="sync-direction-options">
              <label className={`direction-option ${config.sync_direction === 'bidirectional' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="sync_direction"
                  value="bidirectional"
                  checked={config.sync_direction === 'bidirectional'}
                  onChange={(e) => setConfig({ ...config, sync_direction: e.target.value })}
                />
                <div className="direction-content">
                  <span className="direction-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <span className="direction-label">Bidirectional</span>
                  <span className="direction-desc">Sync changes both ways</span>
                </div>
              </label>

              <label className={`direction-option ${config.sync_direction === 'to_notion' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="sync_direction"
                  value="to_notion"
                  checked={config.sync_direction === 'to_notion'}
                  onChange={(e) => setConfig({ ...config, sync_direction: e.target.value })}
                />
                <div className="direction-content">
                  <span className="direction-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <span className="direction-label">To Notion</span>
                  <span className="direction-desc">Push tasks to Notion only</span>
                </div>
              </label>

              <label className={`direction-option ${config.sync_direction === 'from_notion' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="sync_direction"
                  value="from_notion"
                  checked={config.sync_direction === 'from_notion'}
                  onChange={(e) => setConfig({ ...config, sync_direction: e.target.value })}
                />
                <div className="direction-content">
                  <span className="direction-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                  </span>
                  <span className="direction-label">From Notion</span>
                  <span className="direction-desc">Pull tasks from Notion only</span>
                </div>
              </label>
            </div>
          </div>

          {/* Status Mapping */}
          <div className="config-section">
            <label className="config-label">Status Mapping</label>
            <p className="config-desc">Map your task statuses to Notion status values</p>

            <div className="status-mapping">
              {Object.entries(config.field_mapping.status).map(([localStatus, notionStatus]) => (
                <div key={localStatus} className="mapping-row">
                  <span className="local-status">{localStatus.replace('_', ' ')}</span>
                  <span className="mapping-arrow">→</span>
                  <input
                    type="text"
                    className="notion-status-input"
                    value={notionStatus}
                    onChange={(e) => handleStatusMappingChange(localStatus, e.target.value)}
                    placeholder="Notion status"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Manual Sync */}
          <div className="config-section">
            <label className="config-label">Manual Sync</label>
            <p className="config-desc">Trigger a sync immediately</p>

            <button
              className="btn btn-secondary sync-now-btn"
              onClick={handleSyncNow}
              disabled={syncing || !config.database_id}
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>

            {syncResult && (
              <div className={`sync-result ${syncResult.success ? 'success' : 'warning'}`}>
                <p>Synced {syncResult.syncedFromNotion} from Notion, {syncResult.syncedToNotion} to Notion</p>
                {syncResult.errors && syncResult.errors.length > 0 && (
                  <p className="sync-errors">{syncResult.errors.length} errors occurred</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || !config.database_id}
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotionSyncConfig;
