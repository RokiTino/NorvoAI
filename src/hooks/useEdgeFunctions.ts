// src/hooks/useEdgeFunctions.ts
// React hooks for Supabase Edge Functions

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  generateDocument,
  generatePRD,
  generateTechSpec,
  generateSprintSummary,
  generateReleaseNotes,
  createJiraIssue,
  createBulkJiraIssues,
  updateJiraIssue,
  syncJiraIssues,
  fetchJiraIssues,
  createNotionPage,
  updateNotionPage,
  searchNotion,
  fetchNotionPages,
  syncNotionPages,
  runAutomation,
  generateAndExportToNotion,
  meetingNotesToJiraTasks,
  type DocumentType,
  type DocumentTone,
  type DocumentLength,
  type JiraIssue,
} from '../lib/api/api-supabase-functions'

// ============================================
// Document Generation Hooks
// ============================================

/**
 * Hook for generating documents with AI
 */
export function useGenerateDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      type,
      input,
      workspaceId,
      tone,
      length,
    }: {
      type: DocumentType
      input: string
      workspaceId: string
      tone?: DocumentTone
      length?: DocumentLength
    }) => {
      return generateDocument({ type, input, workspaceId, tone, length })
    },
    onSuccess: () => {
      // Invalidate documents query to refetch
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

/**
 * Hook for generating PRDs
 */
export function useGeneratePRD() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      input,
      workspaceId,
      tone,
      length,
    }: {
      input: string
      workspaceId: string
      tone?: DocumentTone
      length?: DocumentLength
    }) => {
      return generatePRD(input, workspaceId, { tone, length })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

/**
 * Hook for generating Tech Specs
 */
export function useGenerateTechSpec() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      input,
      workspaceId,
      tone,
      length,
    }: {
      input: string
      workspaceId: string
      tone?: DocumentTone
      length?: DocumentLength
    }) => {
      return generateTechSpec(input, workspaceId, { tone, length })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}

// ============================================
// Jira Integration Hooks
// ============================================

/**
 * Hook for creating Jira issues
 */
export function useCreateJiraIssue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      workspaceId,
      issue,
    }: {
      workspaceId: string
      issue: JiraIssue
    }) => {
      return createJiraIssue(workspaceId, issue)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jira-issues'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Hook for creating bulk Jira issues
 */
export function useCreateBulkJiraIssues() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      workspaceId,
      issues,
    }: {
      workspaceId: string
      issues: JiraIssue[]
    }) => {
      return createBulkJiraIssues(workspaceId, issues)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jira-issues'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Hook for syncing Jira issues
 */
export function useSyncJiraIssues() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      return syncJiraIssues(workspaceId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jira-issues'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

/**
 * Hook for fetching Jira issues
 */
export function useJiraIssues(workspaceId: string, jql?: string) {
  return useQuery({
    queryKey: ['jira-issues', workspaceId, jql],
    queryFn: () => fetchJiraIssues(workspaceId, jql),
    enabled: !!workspaceId,
  })
}

// ============================================
// Notion Integration Hooks
// ============================================

/**
 * Hook for creating Notion pages
 */
export function useCreateNotionPage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      workspaceId,
      pageData,
    }: {
      workspaceId: string
      pageData: {
        title: string
        content?: string
        databaseId?: string
        status?: string
        tags?: string[]
      }
    }) => {
      return createNotionPage(workspaceId, pageData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion-pages'] })
    },
  })
}

/**
 * Hook for searching Notion
 */
export function useSearchNotion(workspaceId: string, query: string) {
  return useQuery({
    queryKey: ['notion-search', workspaceId, query],
    queryFn: () => searchNotion(workspaceId, query),
    enabled: !!workspaceId && query.length > 0,
  })
}

/**
 * Hook for fetching Notion pages
 */
export function useNotionPages(workspaceId: string) {
  return useQuery({
    queryKey: ['notion-pages', workspaceId],
    queryFn: () => fetchNotionPages(workspaceId),
    enabled: !!workspaceId,
  })
}

/**
 * Hook for syncing Notion pages
 */
export function useSyncNotionPages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      return syncNotionPages(workspaceId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion-pages'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

// ============================================
// Automation Hooks
// ============================================

/**
 * Hook for running automations
 */
export function useRunAutomation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (automationId: string) => {
      return runAutomation(automationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] })
      queryClient.invalidateQueries({ queryKey: ['automation-executions'] })
    },
  })
}

// ============================================
// Combined Workflow Hooks
// ============================================

/**
 * Hook for generating document and exporting to Notion
 */
export function useGenerateAndExportToNotion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      type,
      input,
      workspaceId,
      notionDatabaseId,
    }: {
      type: DocumentType
      input: string
      workspaceId: string
      notionDatabaseId?: string
    }) => {
      return generateAndExportToNotion(type, input, workspaceId, notionDatabaseId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['notion-pages'] })
    },
  })
}

/**
 * Hook for converting meeting notes to Jira tasks
 */
export function useMeetingNotesToJiraTasks() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      workspaceId,
      meetingNotes,
    }: {
      workspaceId: string
      meetingNotes: string
    }) => {
      return meetingNotesToJiraTasks(workspaceId, meetingNotes)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      queryClient.invalidateQueries({ queryKey: ['jira-issues'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

// ============================================
// Loading State Helper Hook
// ============================================

/**
 * Unified loading state for edge functions
 */
export function useEdgeFunctionsStatus() {
  const [status, setStatus] = useState<{
    isGenerating: boolean
    isSyncing: boolean
    isCreating: boolean
    error: Error | null
  }>({
    isGenerating: false,
    isSyncing: false,
    isCreating: false,
    error: null,
  })

  return {
    status,
    setGenerating: (value: boolean) =>
      setStatus((s) => ({ ...s, isGenerating: value })),
    setSyncing: (value: boolean) =>
      setStatus((s) => ({ ...s, isSyncing: value })),
    setCreating: (value: boolean) =>
      setStatus((s) => ({ ...s, isCreating: value })),
    setError: (error: Error | null) =>
      setStatus((s) => ({ ...s, error })),
  }
}