// supabase/functions/notion-integration/index.ts
// Notion Integration Edge Function for Norvo.AI
// Uses Internal Integration (API Key) authentication

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NOTION_API_VERSION = '2022-06-28'
const NOTION_API_BASE = 'https://api.notion.com/v1'

interface NotionRequest {
  action: string
  workspaceId: string
  data?: any
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify the user is authenticated
    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { action, workspaceId, data }: NotionRequest = await req.json()

    // Verify user has access to the workspace
    const { data: workspace, error: workspaceError } = await supabaseClient
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .eq('user_id', user.id)
      .single()

    if (workspaceError || !workspace) {
      return new Response(JSON.stringify({ error: 'Workspace not found or access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let result

    switch (action) {
      case 'connect':
        result = await connectIntegration(supabaseClient, workspaceId)
        break

      case 'fetch_databases':
        result = await fetchDatabases()
        break

      case 'create_page':
        result = await createPage(supabaseClient, workspaceId, data)
        break

      case 'update_page':
        result = await updatePage(supabaseClient, workspaceId, data.pageId, data.content)
        break

      case 'fetch_pages':
        result = await fetchPages(supabaseClient, workspaceId, data?.databaseId)
        break

      case 'search':
        result = await searchNotion(data.query)
        break

      case 'sync':
        result = await syncTasks(supabaseClient, workspaceId)
        break

      case 'update_config':
        result = await updateConfig(supabaseClient, workspaceId, data)
        break

      case 'disconnect':
        result = await disconnect(supabaseClient, workspaceId)
        break

      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Notion integration error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// Get the Notion API token (Internal Integration)
function getNotionToken(): string {
  const token = Deno.env.get('NOTION_API_TOKEN')
  if (!token) {
    throw new Error('Notion API token not configured. Set NOTION_API_TOKEN in Edge Function secrets.')
  }
  return token
}

// Connect the internal integration
async function connectIntegration(supabase: any, workspaceId: string) {
  const token = getNotionToken()

  // Test the connection by fetching user info
  const response = await fetch(`${NOTION_API_BASE}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': NOTION_API_VERSION,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to connect: ${errorData.message || 'Invalid API token'}`)
  }

  const botUser = await response.json()

  // Store the integration in database
  const { error: upsertError } = await supabase
    .from('integrations')
    .upsert({
      workspace_id: workspaceId,
      type: 'notion',
      config: {
        workspace_name: botUser.bot?.owner?.workspace?.name || 'Notion Workspace',
        bot_id: botUser.id,
        integration_type: 'internal',
        sync_direction: 'bidirectional',
        field_mapping: {
          status: {
            todo: 'Not Started',
            in_progress: 'In Progress',
            done: 'Done',
          },
        },
      },
      connected: true,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'workspace_id,type',
    })

  if (upsertError) {
    throw new Error(`Failed to store integration: ${upsertError.message}`)
  }

  return {
    success: true,
    workspaceName: botUser.bot?.owner?.workspace?.name || 'Notion Workspace',
  }
}

// Fetch user's Notion databases
async function fetchDatabases() {
  const token = getNotionToken()

  const response = await fetch(`${NOTION_API_BASE}/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': NOTION_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: { property: 'object', value: 'database' },
      page_size: 100,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to fetch databases: ${errorData.message}`)
  }

  const data = await response.json()

  // Extract relevant database info
  const databases = data.results.map((db: any) => ({
    id: db.id,
    title: db.title?.[0]?.plain_text || 'Untitled',
    icon: db.icon?.emoji || db.icon?.external?.url || null,
    properties: Object.keys(db.properties || {}),
  }))

  return { databases }
}

// Create a page in Notion
async function createPage(supabase: any, workspaceId: string, pageData: any) {
  const token = getNotionToken()

  // Get integration config for database ID
  const { data: integration } = await supabase
    .from('integrations')
    .select('config')
    .eq('workspace_id', workspaceId)
    .eq('type', 'notion')
    .single()

  const databaseId = pageData.databaseId || integration?.config?.database_id
  if (!databaseId) {
    throw new Error('No database configured for Notion sync')
  }

  const properties: any = {
    title: {
      title: [{ text: { content: pageData.title } }],
    },
  }

  // Add status if provided
  if (pageData.status) {
    const statusMapping = integration?.config?.field_mapping?.status || {}
    const notionStatus = statusMapping[pageData.status] || pageData.status
    properties['Status'] = { status: { name: notionStatus } }
  }

  // Add tags if provided
  if (pageData.tags && Array.isArray(pageData.tags)) {
    properties['Tags'] = {
      multi_select: pageData.tags.map((tag: string) => ({ name: tag })),
    }
  }

  const body: any = {
    parent: { database_id: databaseId },
    properties,
  }

  // Add content as children blocks if provided
  if (pageData.content) {
    body.children = [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: pageData.content } }],
        },
      },
    ]
  }

  const response = await fetch(`${NOTION_API_BASE}/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': NOTION_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to create page: ${errorData.message}`)
  }

  const page = await response.json()

  return {
    success: true,
    pageId: page.id,
    url: page.url,
  }
}

// Update a Notion page
async function updatePage(supabase: any, workspaceId: string, pageId: string, content: any) {
  const token = getNotionToken()

  const { data: integration } = await supabase
    .from('integrations')
    .select('config')
    .eq('workspace_id', workspaceId)
    .eq('type', 'notion')
    .single()

  const body: any = {}

  if (content.properties) {
    body.properties = {}

    if (content.properties.title) {
      body.properties.title = {
        title: [{ text: { content: content.properties.title } }],
      }
    }

    if (content.properties.status) {
      const statusMapping = integration?.config?.field_mapping?.status || {}
      const notionStatus = statusMapping[content.properties.status] || content.properties.status
      body.properties.Status = { status: { name: notionStatus } }
    }
  }

  const response = await fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': NOTION_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to update page: ${errorData.message}`)
  }

  return { success: true, pageId }
}

// Fetch pages from a Notion database
async function fetchPages(supabase: any, workspaceId: string, databaseId?: string) {
  const token = getNotionToken()

  // Get database ID from config if not provided
  if (!databaseId) {
    const { data: integration } = await supabase
      .from('integrations')
      .select('config')
      .eq('workspace_id', workspaceId)
      .eq('type', 'notion')
      .single()

    databaseId = integration?.config?.database_id
    if (!databaseId) {
      throw new Error('No database configured')
    }
  }

  const response = await fetch(`${NOTION_API_BASE}/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': NOTION_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 100 }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Failed to fetch pages: ${errorData.message}`)
  }

  const data = await response.json()

  // Parse pages into a simpler format
  const pages = data.results.map((page: any) => ({
    id: page.id,
    title: page.properties?.title?.title?.[0]?.plain_text ||
           page.properties?.Name?.title?.[0]?.plain_text ||
           'Untitled',
    status: page.properties?.Status?.status?.name || null,
    url: page.url,
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
  }))

  return { pages, hasMore: data.has_more, nextCursor: data.next_cursor }
}

// Search Notion
async function searchNotion(query: string) {
  const token = getNotionToken()

  const response = await fetch(`${NOTION_API_BASE}/search`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': NOTION_API_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, page_size: 20 }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Search failed: ${errorData.message}`)
  }

  const data = await response.json()

  const results = data.results.map((item: any) => ({
    id: item.id,
    type: item.object,
    title: item.properties?.title?.title?.[0]?.plain_text ||
           item.properties?.Name?.title?.[0]?.plain_text ||
           item.title?.[0]?.plain_text ||
           'Untitled',
    url: item.url,
  }))

  return { results }
}

// Bidirectional sync between Notion and local tasks
async function syncTasks(supabase: any, workspaceId: string) {
  const token = getNotionToken()

  const { data: integration } = await supabase
    .from('integrations')
    .select('config')
    .eq('workspace_id', workspaceId)
    .eq('type', 'notion')
    .single()

  if (!integration?.config?.database_id) {
    throw new Error('Notion not configured for sync. Please select a database first.')
  }

  const syncDirection = integration.config.sync_direction || 'bidirectional'
  const databaseId = integration.config.database_id
  const statusMapping = integration.config.field_mapping?.status || {}

  // Reverse status mapping for Notion -> App
  const reverseStatusMapping: Record<string, string> = {}
  for (const [key, value] of Object.entries(statusMapping)) {
    reverseStatusMapping[value as string] = key
  }

  let syncedFromNotion = 0
  let syncedToNotion = 0
  const errors: string[] = []

  // Sync FROM Notion (if bidirectional or from_notion)
  if (syncDirection === 'bidirectional' || syncDirection === 'from_notion') {
    try {
      const { pages } = await fetchPages(supabase, workspaceId, databaseId)

      for (const page of pages) {
        // Check if task exists
        const { data: existingTask } = await supabase
          .from('tasks')
          .select('id, updated_at')
          .eq('workspace_id', workspaceId)
          .eq('notion_page_id', page.id)
          .single()

        const mappedStatus = reverseStatusMapping[page.status] || page.status?.toLowerCase().replace(' ', '_') || 'todo'

        if (existingTask) {
          // Update if Notion is newer
          if (new Date(page.lastEditedTime) > new Date(existingTask.updated_at)) {
            await supabase
              .from('tasks')
              .update({
                title: page.title,
                status: mappedStatus,
                updated_at: page.lastEditedTime,
              })
              .eq('id', existingTask.id)
            syncedFromNotion++
          }
        } else {
          // Create new task
          await supabase
            .from('tasks')
            .insert({
              workspace_id: workspaceId,
              title: page.title,
              status: mappedStatus,
              source: 'notion',
              notion_page_id: page.id,
              created_at: page.createdTime,
              updated_at: page.lastEditedTime,
            })
          syncedFromNotion++
        }
      }
    } catch (error) {
      errors.push(`Sync from Notion failed: ${error.message}`)
    }
  }

  // Sync TO Notion (if bidirectional or to_notion)
  if (syncDirection === 'bidirectional' || syncDirection === 'to_notion') {
    try {
      // Get local tasks without notion_page_id
      const { data: localTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('workspace_id', workspaceId)
        .is('notion_page_id', null)

      for (const task of localTasks || []) {
        try {
          // Create in Notion
          const result = await createPage(supabase, workspaceId, {
            databaseId,
            title: task.title,
            status: task.status,
            content: task.description,
          })

          // Update task with Notion page ID
          await supabase
            .from('tasks')
            .update({ notion_page_id: result.pageId })
            .eq('id', task.id)

          syncedToNotion++
        } catch (error) {
          errors.push(`Failed to sync task "${task.title}": ${error.message}`)
        }
      }
    } catch (error) {
      errors.push(`Sync to Notion failed: ${error.message}`)
    }
  }

  // Log sync activity
  await supabase.from('activity_log').insert({
    workspace_id: workspaceId,
    action: 'notion_sync',
    details: {
      syncedFromNotion,
      syncedToNotion,
      errors: errors.length,
    },
  })

  return {
    success: errors.length === 0,
    syncedFromNotion,
    syncedToNotion,
    errors: errors.length > 0 ? errors : undefined,
  }
}

// Update integration configuration
async function updateConfig(supabase: any, workspaceId: string, config: any) {
  const { data: existing } = await supabase
    .from('integrations')
    .select('config')
    .eq('workspace_id', workspaceId)
    .eq('type', 'notion')
    .single()

  const updatedConfig = {
    ...existing?.config,
    ...config,
  }

  const { error } = await supabase
    .from('integrations')
    .update({
      config: updatedConfig,
      updated_at: new Date().toISOString(),
    })
    .eq('workspace_id', workspaceId)
    .eq('type', 'notion')

  if (error) {
    throw new Error(`Failed to update config: ${error.message}`)
  }

  return { success: true, config: updatedConfig }
}

// Disconnect Notion integration
async function disconnect(supabase: any, workspaceId: string) {
  const { error } = await supabase
    .from('integrations')
    .update({
      connected: false,
      updated_at: new Date().toISOString(),
    })
    .eq('workspace_id', workspaceId)
    .eq('type', 'notion')

  if (error) {
    throw new Error(`Failed to disconnect: ${error.message}`)
  }

  return { success: true }
}
