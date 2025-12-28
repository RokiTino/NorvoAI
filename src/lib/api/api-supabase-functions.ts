// src/lib/api/supabase-functions.ts
// API client for Supabase Edge Functions

import { supabase } from '../../services/supabase'

// ============================================
// Type Definitions
// ============================================

export type DocumentType = 'prd' | 'tech_spec' | 'sprint_summary' | 'release_notes'
export type DocumentTone = 'professional' | 'casual' | 'technical' | 'executive'
export type DocumentLength = 'brief' | 'detailed' | 'comprehensive'

export interface GenerateDocumentRequest {
  type: DocumentType
  input: string
  workspaceId: string
  tone?: DocumentTone
  length?: DocumentLength
  includeCriteria?: boolean
}

export interface GenerateDocumentResponse {
  success: boolean
  document: {
    id: string
    title: string
    content: string
    type: DocumentType
    status: string
    created_at: string
  }
  content: string
}

export interface JiraIssue {
  summary: string
  description: string
  issueType?: string
  assignee?: string
  priority?: string
  labels?: string[]
}

export interface JiraIntegrationRequest {
  action: 'create_issue' | 'create_bulk' | 'update_issue' | 'sync' | 'fetch_issues'
  workspaceId: string
  data?: any
}

export interface NotionIntegrationRequest {
  action: 'create_page' | 'update_page' | 'sync' | 'fetch_pages' | 'search'
  workspaceId: string
  data?: any
}

export interface RunAutomationRequest {
  automationId: string
}

export type AutomationType = 
  | 'meeting_to_tasks'
  | 'bidirectional_sync'
  | 'weekly_report'
  | 'backlog_cleanup'
  | 'overdue_alerts'
  | 'sprint_summary'

// ============================================
// Document Generation Functions
// ============================================

/**
 * Generate an AI document (PRD, Tech Spec, etc.)
 */
export async function generateDocument(request: GenerateDocumentRequest) {
  try {
    const { data, error } = await supabase.functions.invoke('generate-document', {
      body: request,
    })

    if (error) throw error
    return data as GenerateDocumentResponse
  } catch (error) {
    console.error('Error generating document:', error)
    throw error
  }
}

/**
 * Generate a Product Requirements Document
 */
export async function generatePRD(
  input: string,
  workspaceId: string,
  options?: Partial<GenerateDocumentRequest>
) {
  return generateDocument({
    type: 'prd',
    input,
    workspaceId,
    tone: options?.tone || 'professional',
    length: options?.length || 'detailed',
    includeCriteria: options?.includeCriteria || true,
  })
}

/**
 * Generate a Technical Specification
 */
export async function generateTechSpec(
  input: string,
  workspaceId: string,
  options?: Partial<GenerateDocumentRequest>
) {
  return generateDocument({
    type: 'tech_spec',
    input,
    workspaceId,
    tone: options?.tone || 'technical',
    length: options?.length || 'comprehensive',
  })
}

/**
 * Generate Sprint Summary
 */
export async function generateSprintSummary(
  input: string,
  workspaceId: string,
  options?: Partial<GenerateDocumentRequest>
) {
  return generateDocument({
    type: 'sprint_summary',
    input,
    workspaceId,
    tone: options?.tone || 'professional',
    length: options?.length || 'detailed',
  })
}

/**
 * Generate Release Notes
 */
export async function generateReleaseNotes(
  input: string,
  workspaceId: string,
  options?: Partial<GenerateDocumentRequest>
) {
  return generateDocument({
    type: 'release_notes',
    input,
    workspaceId,
    tone: options?.tone || 'professional',
    length: options?.length || 'brief',
  })
}

// ============================================
// Jira Integration Functions
// ============================================

/**
 * Create a single Jira issue
 */
export async function createJiraIssue(workspaceId: string, issue: JiraIssue) {
  try {
    const { data, error } = await supabase.functions.invoke('jira-integration', {
      body: {
        action: 'create_issue',
        workspaceId,
        data: issue,
      } as JiraIntegrationRequest,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating Jira issue:', error)
    throw error
  }
}

/**
 * Create multiple Jira issues in bulk
 */
export async function createBulkJiraIssues(workspaceId: string, issues: JiraIssue[]) {
  try {
    const { data, error } = await supabase.functions.invoke('jira-integration', {
      body: {
        action: 'create_bulk',
        workspaceId,
        data: issues,
      } as JiraIntegrationRequest,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating bulk Jira issues:', error)
    throw error
  }
}

/**
 * Update a Jira issue
 */
export async function updateJiraIssue(
  workspaceId: string,
  issueKey: string,
  updates: Partial<JiraIssue>
) {
  try {
    const { data, error } = await supabase.functions.invoke('jira-integration', {
      body: {
        action: 'update_issue',
        workspaceId,
        data: { issueKey, updates },
      } as JiraIntegrationRequest,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating Jira issue:', error)
    throw error
  }
}

/**
 * Sync all Jira issues to local database
 */
export async function syncJiraIssues(workspaceId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('jira-integration', {
      body: {
        action: 'sync',
        workspaceId,
      } as JiraIntegrationRequest,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error syncing Jira issues:', error)
    throw error
  }
}

/**
 * Fetch Jira issues with optional JQL query
 */
export async function fetchJiraIssues(workspaceId: string, jql?: string) {
  try {
    const { data, error } = await supabase.functions.invoke('jira-integration', {
      body: {
        action: 'fetch_issues',
        workspaceId,
        data: jql ? { jql } : undefined,
      } as JiraIntegrationRequest,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching Jira issues:', error)
    throw error
  }
}

// ============================================
// Notion Integration Functions
// ============================================

/**
 * Create a Notion page
 */
export async function createNotionPage(
  workspaceId: string,
  pageData: {
    title: string
    databaseId?: string
    parentId?: string
    content?: string
    status?: string
    tags?: string[]
  }
) {
  try {
    const { data, error } = await supabase.functions.invoke('notion-integration', {
      body: {
        action: 'create_page',
        workspaceId,
        data: pageData,
      } as NotionIntegrationRequest,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating Notion page:', error)
    throw error
  }
}

/**
 * Update a Notion page
 */
export async function updateNotionPage(
  workspaceId: string,
  pageId: string,
  content: {
    properties?: any
    blocks?: string
  }
) {
  try {
    const { data, error } = await supabase.functions.invoke('notion-integration', {
      body: {
        action: 'update_page',
        workspaceId,
        data: { pageId, content },
      } as NotionIntegrationRequest,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating Notion page:', error)
    throw error
  }
}

/**
 * Search Notion pages
 */
export async function searchNotion(workspaceId: string, query: string) {
  try {
    const { data, error } = await supabase.functions.invoke('notion-integration', {
      body: {
        action: 'search',
        workspaceId,
        data: { query },
      } as NotionIntegrationRequest,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error searching Notion:', error)
    throw error
  }
}

/**
 * Fetch all pages from Notion database
 */
export async function fetchNotionPages(workspaceId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('notion-integration', {
      body: {
        action: 'fetch_pages',
        workspaceId,
      } as NotionIntegrationRequest,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching Notion pages:', error)
    throw error
  }
}

/**
 * Sync Notion pages to local database
 */
export async function syncNotionPages(workspaceId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('notion-integration', {
      body: {
        action: 'sync',
        workspaceId,
      } as NotionIntegrationRequest,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error syncing Notion pages:', error)
    throw error
  }
}

// ============================================
// Automation Functions
// ============================================

/**
 * Run an automation
 */
export async function runAutomation(automationId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('run-automation', {
      body: {
        automationId,
      } as RunAutomationRequest,
    })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error running automation:', error)
    throw error
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Export document to Notion after generation
 */
export async function generateAndExportToNotion(
  type: DocumentType,
  input: string,
  workspaceId: string,
  notionDatabaseId?: string
) {
  try {
    // Generate the document
    const docResult = await generateDocument({
      type,
      input,
      workspaceId,
    })

    if (!docResult.success) {
      throw new Error('Failed to generate document')
    }

    // Export to Notion
    const notionResult = await createNotionPage(workspaceId, {
      title: docResult.document.title,
      content: docResult.document.content,
      databaseId: notionDatabaseId,
      tags: [type, 'ai-generated'],
    })

    return {
      document: docResult.document,
      notionPage: notionResult,
    }
  } catch (error) {
    console.error('Error generating and exporting document:', error)
    throw error
  }
}

/**
 * Convert meeting notes to Jira tasks
 */
export async function meetingNotesToJiraTasks(
  workspaceId: string,
  meetingNotes: string
) {
  try {
    // Generate tech spec with action items
    const docResult = await generateTechSpec(
      `Extract action items and tasks from these meeting notes:\n\n${meetingNotes}`,
      workspaceId
    )

    // Parse tasks from the generated content
    const tasks = parseTasksFromContent(docResult.content)

    // Create Jira issues in bulk
    const jiraResult = await createBulkJiraIssues(workspaceId, tasks)

    return {
      document: docResult.document,
      tasksCreated: jiraResult.result.successful,
      tasksFailed: jiraResult.result.failed,
      results: jiraResult.result.results,
    }
  } catch (error) {
    console.error('Error converting meeting notes to tasks:', error)
    throw error
  }
}

/**
 * Parse tasks from AI-generated content
 */
function parseTasksFromContent(content: string): JiraIssue[] {
  const tasks: JiraIssue[] = []
  const lines = content.split('\n')
  
  let currentTask: Partial<JiraIssue> | null = null

  for (const line of lines) {
    // Match bullet points or numbered lists
    const taskMatch = line.match(/^[-*\d.]\s+(.+)/)
    if (taskMatch) {
      if (currentTask) {
        tasks.push(currentTask as JiraIssue)
      }
      currentTask = {
        summary: taskMatch[1].trim(),
        description: '',
        issueType: 'Task',
        labels: ['ai-generated'],
      }
    } else if (currentTask && line.trim()) {
      currentTask.description += line.trim() + ' '
    }
  }

  if (currentTask) {
    tasks.push(currentTask as JiraIssue)
  }

  return tasks.slice(0, 10) // Limit to 10 tasks
}