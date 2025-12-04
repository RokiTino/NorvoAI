import { createClient } from '@supabase/supabase-js';

// These should be replaced with your actual Supabase credentials
// Get these from your Supabase project settings > API
const supabaseUrl = 'https://ddgfdprteldsjbobyvav.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZ2ZkcHJ0ZWxkc2pib2J5dmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MjUzMDMsImV4cCI6MjA4MDQwMTMwM30.0PqCzTpHW_2kmHUIvvLSG0FmFDeIieomDHUIieUu0Bw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const db = {
  // User profile operations
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Workspace operations
  async getWorkspaces(userId) {
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createWorkspace(workspace) {
    const { data, error } = await supabase
      .from('workspaces')
      .insert(workspace)
      .select()
      .single();
    return { data, error };
  },

  // Integration operations
  async getIntegrations(workspaceId) {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('workspace_id', workspaceId);
    return { data, error };
  },

  async upsertIntegration(integration) {
    const { data, error } = await supabase
      .from('integrations')
      .upsert(integration)
      .select()
      .single();
    return { data, error };
  },

  // Automation operations
  async getAutomations(workspaceId) {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createAutomation(automation) {
    const { data, error } = await supabase
      .from('automations')
      .insert(automation)
      .select()
      .single();
    return { data, error };
  },

  async updateAutomation(id, updates) {
    const { data, error } = await supabase
      .from('automations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async deleteAutomation(id) {
    const { error } = await supabase
      .from('automations')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Task operations
  async getTasks(workspaceId, filters = {}) {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('workspace_id', workspaceId);
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.assignee) {
      query = query.eq('assignee_id', filters.assignee);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  async createTask(task) {
    const { data, error } = await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
    return { data, error };
  },

  async updateTask(id, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Document operations
  async getDocuments(workspaceId) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  async createDocument(document) {
    const { data, error } = await supabase
      .from('documents')
      .insert(document)
      .select()
      .single();
    return { data, error };
  },

  async updateDocument(id, updates) {
    const { data, error } = await supabase
      .from('documents')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Activity log operations
  async getActivityLog(workspaceId, limit = 50) {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  async logActivity(activity) {
    const { data, error } = await supabase
      .from('activity_log')
      .insert(activity)
      .select()
      .single();
    return { data, error };
  },

  // Analytics operations
  async getAnalytics(workspaceId, startDate, endDate) {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('workspace_id', workspaceId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    return { data, error };
  }
};

// Real-time subscriptions
export const subscriptions = {
  subscribeToTasks(workspaceId, callback) {
    return supabase
      .channel(`tasks:${workspaceId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks', filter: `workspace_id=eq.${workspaceId}` },
        callback
      )
      .subscribe();
  },

  subscribeToAutomations(workspaceId, callback) {
    return supabase
      .channel(`automations:${workspaceId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'automations', filter: `workspace_id=eq.${workspaceId}` },
        callback
      )
      .subscribe();
  },

  subscribeToActivity(workspaceId, callback) {
    return supabase
      .channel(`activity:${workspaceId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_log', filter: `workspace_id=eq.${workspaceId}` },
        callback
      )
      .subscribe();
  }
};

// Storage helpers for file uploads
export const storage = {
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  async getFileUrl(bucket, path) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  async deleteFile(bucket, path) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    return { error };
  }
};