import React, { useState, useEffect } from "react";
import { useCreateJiraIssue, useJiraIssues } from "../hooks/useEdgeFunctions";
import { supabase } from "../services/supabase";
import Sidebar from "../components/Sidebar";

const Tasks = ({ session, onNavigate, onSignOut }) => {
  const [workspaceId, setWorkspaceId] = useState(null);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");

  const createIssue = useCreateJiraIssue();
  const { data: jiraIssues, isLoading } = useJiraIssues(workspaceId);

  useEffect(() => {
    const loadWorkspace = async () => {
      if (session?.user) {
        const { data } = await supabase
          .from("workspaces")
          .select("id")
          .eq("user_id", session.user.id)
          .single();

        if (data) setWorkspaceId(data.id);
      }
    };
    loadWorkspace();
  }, [session]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!workspaceId) return;

    try {
      await createIssue.mutateAsync({
        workspaceId,
        issue: {
          summary,
          description,
          issueType: "Task",
          priority: "Medium",
        },
      });

      alert("Task created in Jira!");
      setSummary("");
      setDescription("");
    } catch (error) {
      alert("Failed to create task: " + error.message);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        currentPage="tasks"
        onNavigate={onNavigate}
        onSignOut={onSignOut}
        user={session?.user}
      />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="header-title">Tasks</h1>
            <p className="header-subtitle">Manage your Jira tasks</p>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Create Task Form */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <h2>Create New Task</h2>
            <form
              onSubmit={handleCreate}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <input
                type="text"
                className="input"
                placeholder="Task summary..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              />
              <textarea
                className="input"
                placeholder="Task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createIssue.isPending}
              >
                {createIssue.isPending ? "Creating..." : "Create Task"}
              </button>
            </form>
          </div>

          {/* Tasks List */}
          <div className="card">
            <h2>Your Tasks</h2>
            {isLoading && <p>Loading tasks...</p>}
            {jiraIssues && (
              <div style={{ marginTop: "1rem" }}>
                {jiraIssues.result.issues.map((issue) => (
                  <div
                    key={issue.key}
                    style={{
                      padding: "1rem",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <h3>{issue.summary}</h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {issue.key} • {issue.status} • {issue.issueType}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tasks;
